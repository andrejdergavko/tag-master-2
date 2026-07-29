import {
  FetchMessageObject,
  MailboxLockObject,
  MessageStructureObject,
} from 'imapflow/lib/imap-flow';
import { mkdir, writeFile } from 'fs/promises';
import { join, resolve } from 'path';
import { createImapClient } from './client';
import {
  findAttachments,
  getAttachmentFilename,
  getAttachmentPath as getAttachmentFilePath,
  getMessageAttachmentsFlat,
  getSupplierAttachmentsDir,
} from './utils';
import suppliers from '../../modules/suppliers';
import { ATTACHMENTS_DIR } from './constants';

export type MailInboxPreview = {
  latestMessage: string | null;
  subjects: string[];
};

export type MailMessage = {
  uid: number;
  subject: string | null;
  from: string[];
  date: string | null;
  flags: string[];
};

export const fetchNewInvoicesBySupplier = async (supplierId: string) => {
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
        since: new Date('2026-07-27T14:32:49.000Z'),
      },
      { envelope: true, uid: true, bodyStructure: true },
    );

    // const maskMapper: {
    //   attachment: FetchMessageObject;
    //   mask: IMask;
    // }[] = attachments.reduce<{ attachment: FetchMessageObject; mask: IMask }[]>(
    //   (acc, attachment) => {
    //     for (const mask of supplier.masks) {
    //       if (mask.isMatch(attachment)) {
    //         return [...acc, { attachment, mask }];
    //       }
    //     }

    //     return acc;
    //   },
    //   [],
    // );

    // const attachments = getMessagesAttachments(messages);

    const supplierAttachmentsDir = getSupplierAttachmentsDir(supplierId);
    await mkdir(supplierAttachmentsDir, { recursive: true });

    for (const message of messages) {
      if (!message.bodyStructure) continue;

      const messageAttachments = getMessageAttachmentsFlat(message);

      if (!messageAttachments.length) continue;

      const downloadedAttachments = await client.downloadMany(
        String(message.uid),
        messageAttachments.map(({ part }) => part),
        { uid: true },
      );

      await Promise.all(
        messageAttachments.map(async ({ part, attachment }) => {
          const downloadedAttachment = downloadedAttachments[part];

          if (!downloadedAttachment?.content) return;

          await writeFile(
            getAttachmentFilePath(
              supplierAttachmentsDir,
              attachment,
              message.uid,
            ),
            downloadedAttachment.content,
          );
        }),
      );
    }

    return null;
  } finally {
    lock?.release();
    await client.logout().catch(() => undefined);
  }
};

// export const getSupplierInvoices = async (supplierEmail: string) => {
//   return null;
// };
