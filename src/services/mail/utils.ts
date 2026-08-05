import {
  FetchMessageObject,
  ImapFlow,
  MessageStructureObject,
} from 'imapflow/lib/imap-flow';
import { WorkSheet, utils } from 'xlsx';
import { buffer as streamToBuffer } from 'node:stream/consumers';
import { DocumentDTO, DocumentType, SupplierId } from '../../shared/types';
import { Document, DocumentItem } from '../../../generated/prisma/client';

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

export const toDocumentDTO = (
  document: Document & { items: DocumentItem[] },
): DocumentDTO => ({
  id: document.id,
  type: document.type as DocumentType,
  supplierId: document.supplierId as SupplierId,
  number: document.number ?? undefined,
  date: document.date ?? undefined,
  totalSumWithVat: Number(document.totalSumWithVat),
  items: document.items.map((item) => ({
    id: item.id,
    sku: item.sku ?? undefined,
    name: item.name,
    units: item.units,
    quantity: item.quantity,
    sumWithVat: Number(item.sumWithVat),
    description: item.description,
  })),
  source: document.source ?? undefined,
});
