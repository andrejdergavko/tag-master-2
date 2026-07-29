import { join, resolve } from 'path';
import {
  FetchMessageObject,
  MessageStructureObject,
} from 'imapflow/lib/imap-flow';
import { ATTACHMENTS_DIR } from './constants';

export function findAttachments(
  node: MessageStructureObject,
): MessageStructureObject[] {
  const attachments = [];
  const topType = (node.type || '').split('/')[0];

  const isAttachment =
    node.disposition === 'attachment' ||
    (node.type &&
      topType !== 'text' &&
      topType !== 'multipart' &&
      !node.disposition);

  if (isAttachment) {
    attachments.push(node);
  }

  if (node.childNodes) {
    for (const child of node.childNodes) {
      attachments.push(...findAttachments(child));
    }
  }

  return attachments;
}

export const getMessageAttachmentsFlat = (message: FetchMessageObject) =>
  message.bodyStructure
    ? findAttachments(message.bodyStructure).flatMap((attachment) =>
        attachment.part ? [{ part: attachment.part, attachment }] : [],
      )
    : [];

export const getAttachmentFilename = (
  attachment: MessageStructureObject,
  messageUid: number,
) => {
  const filename = sanitizeFilename(
    attachment.dispositionParameters?.filename || '',
  );

  return `${messageUid}-${filename}`;
};

export const getAttachmentPath = (
  supplierAttachmentsDir: string,
  attachment: MessageStructureObject,
  messageUid: number,
) =>
  join(supplierAttachmentsDir, getAttachmentFilename(attachment, messageUid));

export const getSupplierAttachmentsDir = (supplierId: string) =>
  resolve(process.cwd(), ATTACHMENTS_DIR, supplierId);

const sanitizeFilename = (filename: string) =>
  filename.replace(/[<>:"/\\|?*]/g, '_');
