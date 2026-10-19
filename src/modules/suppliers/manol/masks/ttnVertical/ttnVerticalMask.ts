import { MessageStructureObject } from 'imapflow/lib/imap-flow';
import { read } from 'xlsx';
import {
  DocumentType,
  DocumentItemDTO,
  SupplierId,
} from '../../../../../shared/types';
import {
  MIME_TYPE_EXCEL_MSEXCEL,
  MIME_TYPE_EXCEL_OLD,
} from '../../../../../shared/constants';
import {
  fixMulBlankRecords,
  getProductRowData,
  getRowType,
  getTotalRowData,
  parseDecimal,
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

    return /out\d+\.xls$/.test(name);
  },

  extractData: (buffer: Buffer) => {
    const workbook = read(fixMulBlankRecords(buffer), {
      type: 'buffer',
      codepage: 1251,
    });
    const sheet = workbook.Sheets[workbook.SheetNames[0] ?? ''];

    if (!sheet) throw new Error('Sheet not found');

    let totalSumWithVat = 0;
    const invoiceItems: DocumentItemDTO[] = [];

    getRowsInJSON(sheet).forEach((row) => {
      const rowType = getRowType(row);

      if (rowType === 'product') {
        const productRowData = getProductRowData(row);
        const sku = String(productRowData.sku ?? '').trim();

        invoiceItems.push({
          sku: sku || undefined,
          name: String(productRowData.name).trim(),
          units: String(productRowData.units).trim(),
          quantity: parseDecimal(productRowData.quantity) ?? 0,
          sumWithVat: parseDecimal(productRowData.sumWithVat) ?? 0,
          description: String(productRowData.description ?? '').trim(),
        });
      }
      if (rowType === 'total') {
        const totalRowData = getTotalRowData(row);
        totalSumWithVat = parseDecimal(totalRowData.totalSumWithVat) ?? 0;
      }
    });

    return {
      type: DocumentType.TTN,
      date: parseTTNDate(sheet.B3?.v) ?? new Date(),
      number: parseTTNNumber(sheet.A2?.v),
      supplierId: SupplierId.MANOL,
      totalSumWithVat,
      items: invoiceItems,
    };
  },
};
