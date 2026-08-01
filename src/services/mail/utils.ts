import {
  FetchMessageObject,
  ImapFlow,
  MessageStructureObject,
} from 'imapflow/lib/imap-flow';
import { buffer as streamToBuffer } from 'node:stream/consumers';
import { WorkSheet, utils } from 'xlsx';

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
        attachment.part ? [attachment] : [],
      )
    : [];

export const getAttachmentBuffer = async (
  client: ImapFlow,
  messageUid: number,
  attachment: MessageStructureObject,
) => {
  const downloadedAttachment = await client.download(
    String(messageUid),
    attachment.part ?? '',
    { uid: true },
  );

  return downloadedAttachment?.content
    ? await streamToBuffer(
        downloadedAttachment.content as unknown as NodeJS.ReadableStream,
      )
    : null;
};

export const getRowsInJSON = (
  sheet: WorkSheet,
): (string | number | null)[][] => {
  return utils.sheet_to_json(sheet, {
    header: 1,
    defval: null,
  });
};
