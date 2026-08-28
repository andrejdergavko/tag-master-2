import { MessageStructureObject } from 'imapflow/lib/imap-flow';
import { read, utils } from 'xlsx';
import {
  DocumentType,
  DocumentItemDTO,
  SupplierId,
} from '../../../../../shared/types';
import {
  MIME_TYPE_EXCEL,
  MIME_TYPE_EXCEL_OLD,
} from '../../../../../shared/constants';
import {
  getProductRowData,
  getRowType,
  getTotalRowData,
  parseInvoiceDateAndNumber,
} from './utils';
import { getRowsInJSON } from '../../../../../shared/utils/common';

export const invoiceMask = {
  type: DocumentType.OTHER,
  description: 'Счет-фактура',
  isMatch: (attachment: MessageStructureObject) => {
    const name = (attachment.parameters?.name ?? '').toLowerCase();
    const isExcel =
      attachment.type === MIME_TYPE_EXCEL ||
      attachment.type === MIME_TYPE_EXCEL_OLD ||
      name.endsWith('.xlsx') ||
      name.endsWith('.xls');

    if (!isExcel) {
      return false;
    }

    return name.includes('счет-фактура') || name.includes('счёт-фактура');
  },

  extractData: (buffer: Buffer) => {
    const workbook = read(buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0] ?? ''];

    if (!sheet) throw new Error('Sheet not found');

    if (sheet['!ref']) {
      const range = utils.decode_range(sheet['!ref']);
      range.s.c = 0;
      sheet['!ref'] = utils.encode_range(range);
    }

    let totalSumWithVat = 0;
    const invoiceItems: DocumentItemDTO[] = [];
    const rows = getRowsInJSON(sheet);

    rows.forEach((row) => {
      const rowType = getRowType(row);

      if (rowType === 'product') {
        const productRowData = getProductRowData(row);
        const barcode =
          productRowData.barcode != null ? String(productRowData.barcode) : '';

        invoiceItems.push({
          sku: String(productRowData.sku),
          name: String(productRowData.name),
          units: String(productRowData.units),
          quantity: Number(productRowData.quantity),
          sumWithVat: Number(productRowData.sumWithVat),
          description: barcode,
        });
      }
      if (rowType === 'total') {
        const totalRowData = getTotalRowData(row);
        totalSumWithVat = Number(totalRowData.totalSumWithVat);
      }
    });

    const parsed = parseInvoiceDateAndNumber(rows);

    return {
      type: DocumentType.OTHER,
      date: parsed?.date ?? new Date(),
      number: parsed?.number,
      supplierId: SupplierId.WURTH,
      totalSumWithVat,
      items: invoiceItems,
    };
  },
};
