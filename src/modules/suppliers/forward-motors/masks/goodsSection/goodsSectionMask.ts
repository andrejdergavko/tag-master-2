import { MessageStructureObject } from 'imapflow/lib/imap-flow';
import { read } from 'xlsx';
import {
  DocumentType,
  DocumentItemDTO,
  SupplierId,
} from '../../../../../shared/types';
import {
  MIME_TYPE_EXCEL,
  MIME_TYPE_EXCEL_MSEXCEL,
  MIME_TYPE_EXCEL_OLD,
} from '../../../../../shared/constants';
import {
  clearUtf8ZipFlag,
  getProductRowData,
  getRowType,
  getTotalRowData,
  parseDocumentDate,
  parseDocumentNumber,
} from './utils';
import { getRowsInJSON } from '../../../../../shared/utils/common';

export const goodsSectionMask = {
  type: DocumentType.TTN,
  description: 'Товарный раздел',
  isMatch: (attachment: MessageStructureObject) => {
    if (
      attachment.type !== MIME_TYPE_EXCEL &&
      attachment.type !== MIME_TYPE_EXCEL_OLD &&
      attachment.type !== MIME_TYPE_EXCEL_MSEXCEL
    ) {
      return false;
    }

    const name = attachment.parameters?.name?.toLowerCase() ?? '';

    return /от\s+\d{1,2}\.\d{1,2}\.\d{2,4}/.test(name);
  },

  extractData: (buffer: Buffer) => {
    const workbook = read(clearUtf8ZipFlag(buffer), { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0] ?? ''];

    if (!sheet) throw new Error('Sheet not found');

    let totalSumWithVat = 0;
    let date: Date | null = null;
    let number: string | null = null;
    const invoiceItems: DocumentItemDTO[] = [];

    getRowsInJSON(sheet).forEach((row) => {
      if (!date) {
        const parsedDate = parseDocumentDate(row[0]);
        const parsedNumber = parseDocumentNumber(row[1]);

        if (parsedDate && parsedNumber) {
          date = parsedDate;
          number = parsedNumber;
        }
      }

      const rowType = getRowType(row);

      if (rowType === 'product') {
        const productRowData = getProductRowData(row);
        const note =
          productRowData.note != null ? String(productRowData.note).trim() : '';

        invoiceItems.push({
          sku: String(productRowData.sku).trim(),
          name: String(productRowData.name).trim(),
          units: String(productRowData.units).trim(),
          quantity: Number(productRowData.quantity),
          sumWithVat: Number(productRowData.sumWithVat),
          description: note,
        });
      }
      if (rowType === 'total') {
        const totalRowData = getTotalRowData(row);
        totalSumWithVat = Number(totalRowData.totalSumWithVat);
      }
    });

    return {
      type: DocumentType.TTN,
      date: date ?? new Date(),
      number,
      supplierId: SupplierId.FORWARD_MOTORS,
      totalSumWithVat,
      items: invoiceItems,
    };
  },
};
