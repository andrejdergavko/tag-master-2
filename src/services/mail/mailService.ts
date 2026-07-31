import { MailboxLockObject } from 'imapflow/lib/imap-flow';
import { createImapClient } from './client';
import { getAttachmentBuffer, getMessageAttachmentsFlat } from './utils';
import suppliers from '../../modules/suppliers';
import { IDocument } from '../../shared/types';

export const fetchNewInvoicesBySupplier = async (
  supplierId: string,
): Promise<IDocument[]> => {
  const client = createImapClient();
  let lock: MailboxLockObject | undefined;
  await client.connect();
  const supplier = suppliers.find((item) => item.id === supplierId);

  if (!supplier) throw new Error(`Supplier ${supplierId} not found`);

  try {
    lock = await client.getMailboxLock('INBOX');

    const messages = await client.fetchAll(
      {
        from: supplier.email,
        since: new Date('2026-07-27T14:32:49.000Z'), // TODO: add last fetched date
      },
      { envelope: true, uid: true, bodyStructure: true },
    );

    const documents: IDocument[] = [];

    for (const message of messages) {
      if (!message.bodyStructure) continue;

      const messageAttachments = getMessageAttachmentsFlat(message);

      if (!messageAttachments.length) continue;

      messageAttachments.forEach(async (attachment) => {
        for (const mask of supplier.masks) {
          if (mask.isMatch(attachment)) {
            const buffer = await getAttachmentBuffer(
              client,
              message.uid,
              attachment,
            );

            if (!buffer) continue;

            const data = mask.extractData(buffer);
            documents.push(data);
            break;
          }
        }
      }, []);
    }

    return documents;
  } finally {
    lock?.release();
    await client.logout().catch(() => undefined);
  }
};

// export const getSupplierInvoices = async (supplierEmail: string) => {
//   return null;
// };
