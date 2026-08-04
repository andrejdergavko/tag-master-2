import { MessageStructureObject } from 'imapflow/lib/imap-flow';
import {
  DocumentType,
  DocumentItemDTO,
  SupplierId,
} from '../../../../../shared/types';
import { MIME_TYPE_EXCEL } from '../../../../../shared/constants';
import { read } from 'xlsx';
import { getProductRowData, getRowType, getTotalRowData } from './utils';
import { getRowsInJSON, parseInvoiceDate } from '../utils';

export const ttnVerticalMask = {
  type: DocumentType.TTN,
  description: 'ТТН вертикальная',
  isMatch: (attachment: MessageStructureObject) => {
    if (attachment.type !== MIME_TYPE_EXCEL) {
      return false;
    }

    if (!attachment.parameters?.name?.includes('ТТН-1 (вертикальная')) {
      return false;
    }

    return true;
  },

  extractData: (buffer: Buffer) => {
    const workbook = read(buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0] ?? ''];

    if (!sheet) throw new Error('Sheet not found');

    let totalSumWithVat = 0;
    const invoiceItems: DocumentItemDTO[] = [];

    getRowsInJSON(sheet).forEach((row) => {
      const rowType = getRowType(row);

      if (rowType === 'product') {
        const productRowData = getProductRowData(row);
        invoiceItems.push({
          name: String(productRowData.name),
          units: String(productRowData.units),
          quantity: Number(productRowData.quantity),
          sumWithVat: Number(productRowData.sumWithVat),
          description: String(productRowData.description),
        });
      }
      if (rowType === 'total') {
        const totalRowData = getTotalRowData(row);
        totalSumWithVat = Number(totalRowData.totalSumWithVat);
      }
    });

    return {
      type: DocumentType.TTN,
      date: parseInvoiceDate(sheet.B23?.v) ?? new Date(),
      supplierId: SupplierId.AUTOPITER,
      totalSumWithVat: totalSumWithVat,
      items: invoiceItems,
    };
  },
};
