import { MessageStructureObject } from 'imapflow/lib/imap-flow';
import {
  DocumentType,
  DocumentItemDTO,
  SupplierId,
} from '../../../../../shared/types';
import { MIME_TYPE_EXCEL_OLD } from '../../../../../shared/constants';
import { read, set_cptable } from 'xlsx';
// @ts-expect-error SheetJS codepage tables ship without typings
import * as cptable from 'xlsx/dist/cpexcel.full.mjs';
import {
  getProductRowData,
  getRowType,
  getTotalRowData,
  parseTTNDate,
  parseTTNNumber,
} from './utils';
import { getRowsInJSON } from '../../../../../shared/utils/common';

set_cptable(cptable);

export const ttnVerticalMask = {
  type: DocumentType.TTN,
  description: 'ТТН вертикальная',
  isMatch: (attachment: MessageStructureObject) => {
    if (attachment.type !== MIME_TYPE_EXCEL_OLD) {
      return false;
    }

    const name = attachment.parameters?.name?.toLowerCase() ?? '';

    return name.includes('ттн') || name.includes('печатн');
  },

  extractData: (buffer: Buffer) => {
    const workbook = read(buffer, { type: 'buffer', codepage: 1251 });
    const sheet = workbook.Sheets[workbook.SheetNames[0] ?? ''];

    if (!sheet) throw new Error('Sheet not found');

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
          name: barcode
            ? `${String(productRowData.name)} ${barcode}`
            : String(productRowData.name),
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

    const parsed = parseTTNDate(sheet.A23?.v);

    return {
      type: DocumentType.TTN,
      date: parsed?.date ?? new Date(),
      number: parseTTNNumber(rows),
      supplierId: SupplierId.AMAZIS,
      totalSumWithVat: totalSumWithVat,
      items: invoiceItems,
    };
  },
};
