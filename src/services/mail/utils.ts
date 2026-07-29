export function findAttachments(node: any): any[] {
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
