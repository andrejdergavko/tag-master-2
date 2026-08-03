import { MailboxLockObject } from 'imapflow/lib/imap-flow';
import { createImapClient } from './client';
import {
  getAttachmentBuffer,
  getMessageAttachmentsFlat,
  toDocumentDTO,
} from './utils';
import suppliers from '../../modules/suppliers';
import { DocumentType, DocumentDTO, SupplierId } from '../../shared/types';
import { prisma } from '../db/prisma';

export const fetchNewInvoicesBySupplier = async (
  supplierId: string,
): Promise<DocumentDTO[]> => {
  const client = createImapClient();
  let lock: MailboxLockObject | undefined;
  await client.connect();
  const supplier = suppliers.find((item) => item.id === supplierId);

  if (!supplier) throw new Error(`Supplier ${supplierId} not found`);

  try {
    await prisma.supplier.upsert({
      where: { id: supplier.id },
      create: {
        id: supplier.id,
        name: supplier.name,
        email: supplier.email,
      },
      update: {
        name: supplier.name,
        email: supplier.email,
      },
    });

    const latestMail = await prisma.mail.findFirst({
      where: {
        supplier: {
          is: {
            id: supplier.id,
          },
        },
      },
      orderBy: { sentAt: 'desc' },
      select: { sentAt: true },
    });

    const sentSince =
      latestMail?.sentAt ?? new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);

    lock = await client.getMailboxLock('INBOX');

    const messages = (
      await client.fetchAll(
        { from: supplier.email, sentSince },
        { envelope: true, uid: true, bodyStructure: true },
      )
    ).filter(
      (message) =>
        message.envelope?.date &&
        new Date(message.envelope.date).getTime() > sentSince.getTime(),
    );

    const documents: DocumentDTO[] = [];

    for (const message of messages) {
      if (!message.bodyStructure || !message.envelope?.date) continue;

      const messageSentAt = new Date(message.envelope.date);
      const mailId = String(message.uid);
      const messageAttachments = getMessageAttachmentsFlat(message);
      let persistedMailId: string | undefined;

      if (!messageAttachments.length) continue;

      for (const attachment of messageAttachments) {
        for (const mask of supplier.masks) {
          if (mask.isMatch(attachment)) {
            const buffer = await getAttachmentBuffer(
              client,
              message.uid,
              attachment,
            );

            if (!buffer) continue;

            if (!persistedMailId) {
              await prisma.mail.upsert({
                where: { id: mailId },
                create: {
                  id: mailId,
                  supplierId: supplier.id,
                  sentAt: messageSentAt,
                },
                update: {
                  supplierId: supplier.id,
                  sentAt: messageSentAt,
                },
              });
              persistedMailId = mailId;
            }

            const data = mask.extractData(buffer);
            await prisma.document.create({
              data: {
                type: data.type,
                supplierId: data.supplierId,
                number: data.number,
                date: data.date,
                totalSumWithVat: data.totalSumWithVat,
                mailId: persistedMailId,
                items: {
                  create: data.items,
                },
                // source: data.source ?? attachment.parameters?.name ?? null,
              },
            });
            documents.push(data);
            break;
          }
        }
      }
    }

    return documents;
  } finally {
    lock?.release();
    await client.logout().catch((): undefined => undefined);
  }
};

export const getSupplierDocuments = async (
  supplierEmail: string,
): Promise<DocumentDTO[]> => {
  const documents = await prisma.document.findMany({
    where: {
      supplier: {
        is: { email: supplierEmail },
      },
    },
    include: { items: true },
  });

  return documents.map((document) => toDocumentDTO(document));
};
