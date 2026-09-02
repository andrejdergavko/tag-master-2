import { MessageStructureObject } from 'imapflow/lib/imap-flow';
import {
  DocumentType,
  DocumentItemDTO,
  SupplierId,
} from '../../../../../shared/types';
import {
  MIME_TYPE_EXCEL_MSEXCEL,
  MIME_TYPE_EXCEL_OLD,
} from '../../../../../shared/constants';
// @ts-expect-error this Excel file cannot be read by the default parser
import { read } from 'xlsx/xlsx.js';
import {
  getProductRowData,
  getRowType,
  getTotalRowData,
  parseTTNDate,
  parseTTNNumber,
} from './utils';
import { getRowsInJSON } from '../../../../../shared/utils/common';

export const ttnVerticalMask = {
  type: DocumentType.TTN,
  description: 'Приложение к ТТН',
  isMatch: (attachment: MessageStructureObject) => {
    if (
      attachment.type !== MIME_TYPE_EXCEL_OLD &&
      attachment.type !== MIME_TYPE_EXCEL_MSEXCEL
    ) {
      return false;
    }

    const name = attachment.parameters?.name?.toLowerCase() ?? '';

    return name.startsWith('out');
  },

  extractData: (buffer: Buffer) => {
    const workbook = read(buffer, { type: 'buffer', codepage: 1251 });
    const sheet = workbook.Sheets[workbook.SheetNames[0] ?? ''];

    if (!sheet) throw new Error('Sheet not found');

    let totalSumWithVat = 0;
    const invoiceItems: DocumentItemDTO[] = [];

    getRowsInJSON(sheet).forEach((row) => {
      const rowType = getRowType(row);

      if (rowType === 'product') {
        const productRowData = getProductRowData(row);
        invoiceItems.push({
          sku: String(productRowData.sku).trim(),
          name: String(productRowData.name),
          units: String(productRowData.units),
          quantity: Number(productRowData.quantity),
          sumWithVat: Number(productRowData.sumWithVat),
          description: String(productRowData.description ?? '').trim(),
        });
      }
      if (rowType === 'total') {
        const totalRowData = getTotalRowData(row);
        totalSumWithVat = Number(totalRowData.totalSumWithVat);
      }
    });

    const parsed = parseTTNDate(sheet.B3?.v);

    return {
      type: DocumentType.TTN,
      date: parsed?.date ?? new Date(),
      number: parseTTNNumber(sheet.A2?.v),
      supplierId: SupplierId.MANNOL,
      totalSumWithVat: totalSumWithVat,
      items: invoiceItems,
    };
  },
};
