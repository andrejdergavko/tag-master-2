import { MessageStructureObject } from 'imapflow/lib/imap-flow';
import {
  DocumentType,
  DocumentItemDTO,
  SupplierId,
} from '../../../../../shared/types';
import {
  getLineItemsXml,
  getProductRowData,
  getTagValue,
  parseTTNDate,
  parseTTNNumber,
} from './utils';

export const ttnVerticalMask = {
  type: DocumentType.OTHER,
  description: 'Электронная накладная',
  isMatch: (attachment: MessageStructureObject) => {
    const name = attachment.parameters?.name?.toLowerCase() ?? '';

    return name.endsWith('.xml');
  },

  extractData: (buffer: Buffer) => {
    const xml = buffer.toString('utf-8');
    const invoiceItems: DocumentItemDTO[] = [];

    getLineItemsXml(xml).forEach((lineItemXml) => {
      const productRowData = getProductRowData(lineItemXml);

      invoiceItems.push({
        sku: productRowData.sku ? String(productRowData.sku) : undefined,
        name: String(productRowData.name ?? ''),
        units: String(productRowData.units ?? ''),
        quantity: Number(productRowData.quantity),
        sumWithVat: Number(productRowData.sumWithVat),
        description: String(productRowData.description ?? ''),
      });
    });

    const totalSumWithVat = Number(getTagValue(xml, 'TotalAmount') ?? 0);
    const parsedDate = parseTTNDate(getTagValue(xml, 'TTNDate'));

    return {
      type: DocumentType.OTHER,
      date: parsedDate ?? new Date(),
      number: parseTTNNumber(xml),
      supplierId: SupplierId.SHATE_M,
      totalSumWithVat,
      items: invoiceItems,
    };
  },
};
