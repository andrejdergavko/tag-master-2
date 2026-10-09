import { MessageStructureObject } from 'imapflow/lib/imap-flow';
import { read } from 'xlsx';
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
  clearUtf8ZipFlag,
  getProductRowData,
  getRowType,
  getTotalRowData,
  parseSkuAndName,
  parseTTNDate,
  parseTTNNumber,
} from './utils';
import { getRowsInJSON } from '../../../../../shared/utils/common';

export const ttnVerticalMask = {
  type: DocumentType.TTN,
  description: 'ТТН вертикальная',
  isMatch: (attachment: MessageStructureObject) => {
    if (
      attachment.type !== MIME_TYPE_EXCEL &&
      attachment.type !== MIME_TYPE_EXCEL_OLD
    ) {
      return false;
    }

    const name = attachment.parameters?.name?.toLowerCase() ?? '';

    return name.includes('ттн-1 (вертикальная');
  },

  extractData: (buffer: Buffer) => {
    const workbook = read(clearUtf8ZipFlag(buffer), { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0] ?? ''];

    if (!sheet) throw new Error('Sheet not found');

    let totalSumWithVat = 0;
    const invoiceItems: DocumentItemDTO[] = [];

    getRowsInJSON(sheet).forEach((row) => {
      const rowType = getRowType(row);

      if (rowType === 'product') {
        const productRowData = getProductRowData(row);
        const { sku, name } = parseSkuAndName(productRowData.name);

        invoiceItems.push({
          sku,
          name,
          units: String(productRowData.units),
          quantity: Number(productRowData.quantity),
          sumWithVat: Number(productRowData.sumWithVat),
          description: String(productRowData.description ?? ''),
        });
      }
      if (rowType === 'total') {
        const totalRowData = getTotalRowData(row);
        totalSumWithVat = Number(totalRowData.totalSumWithVat);
      }
    });

    return {
      type: DocumentType.TTN,
      date: parseTTNDate(sheet.A23?.v) ?? new Date(),
      number: parseTTNNumber(sheet.E35?.v),
      supplierId: SupplierId.WUERTH,
      totalSumWithVat,
      items: invoiceItems,
    };
  },
};
