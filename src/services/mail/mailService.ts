import { MailboxLockObject } from 'imapflow/lib/imap-flow';
import { createImapClient } from './client';
import {
  getAttachmentBuffer,
  getMessageAttachmentsFlat,
  toDocumentDTO,
} from './utils';
import suppliers from '../../modules/suppliers';
import { DocumentDTO, SupplierId } from '../../shared/types';
import { getPrisma } from '../db/prisma';

export const fetchNewInvoicesBySupplier = async (
  supplierId: string,
): Promise<DocumentDTO[]> => {
  const client = createImapClient();
  let lock: MailboxLockObject | undefined;
  await client.connect();
  const supplier = suppliers.find((item) => item.id === supplierId);

  if (!supplier) throw new Error(`Supplier ${supplierId} not found`);

  try {
    await getPrisma().supplier.upsert({
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

    const latestMail = await getPrisma().mail.findFirst({
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
      latestMail?.sentAt ?? new Date(Date.now() - 20 * 24 * 60 * 60 * 1000); // 20 days ago

    const documents: DocumentDTO[] = [];

    for (const mailboxPath of ['INBOX', 'Спам']) {
      lock = await client.getMailboxLock(mailboxPath);

      try {
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

        for (const message of messages) {
          if (!message.bodyStructure || !message.envelope?.date) continue;

          const messageSentAt = new Date(message.envelope.date);
          const mailId = String(message.id);
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
                  await getPrisma().mail.upsert({
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

                const data = mask.extractData(
                  buffer,
                  attachment.parameters?.name,
                );
                await getPrisma().document.create({
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
      } finally {
        lock.release();
        lock = undefined;
      }
    }

    return documents;
  } finally {
    lock?.release();
    await client.logout().catch((): undefined => undefined);
  }
};

export const getSupplierDocuments = async (
  supplierId: SupplierId,
): Promise<DocumentDTO[]> => {
  const documents = await getPrisma().document.findMany({
    where: {
      supplier: {
        is: { id: supplierId },
      },
    },
    include: {
      items: {
        orderBy: { id: 'asc' },
      },
    },
    orderBy: { date: 'desc' },
  });

  return documents.map((document) => toDocumentDTO(document));
};

export const getDocument = async (
  supplierId: SupplierId,
  documentId: string,
): Promise<DocumentDTO | null> => {
  const document = await getPrisma().document.findFirst({
    where: {
      id: documentId,
      supplierId,
    },
    include: {
      items: {
        orderBy: { id: 'asc' },
      },
    },
  });

  return document ? toDocumentDTO(document) : null;
};

export const markDocumentItemsPrinted = async (ids: number[]) => {
  if (ids.length === 0) return;

  await getPrisma().documentItem.updateMany({
    where: {
      id: { in: ids },
      printedAt: null,
    },
    data: {
      printedAt: new Date(),
    },
  });
};
