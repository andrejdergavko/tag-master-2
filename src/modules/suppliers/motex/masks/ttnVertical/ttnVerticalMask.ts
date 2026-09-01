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
    if (
      attachment.type !== MIME_TYPE_EXCEL_OLD &&
      attachment.type !== MIME_TYPE_EXCEL_MSEXCEL
    ) {
      return false;
    }

    if (!attachment.parameters?.name?.includes('#ttn')) {
      return false;
    }

    return true;
  },

  extractData: (buffer: Buffer) => {
    const workbook = read(buffer, { type: 'buffer', codepage: 1251 });
    const sheet = workbook.Sheets[workbook.SheetNames[2] ?? ''];

    if (!sheet) throw new Error('Sheet not found');

    const rows = getRowsInJSON(sheet);
    let totalSumWithVat = 0;
    const invoiceItems: DocumentItemDTO[] = [];

    rows.forEach((row) => {
      const rowType = getRowType(row);

      if (rowType === 'product') {
        const productRowData = getProductRowData(row);
        const manufacturer =
          productRowData.manufacturer != null
            ? String(productRowData.manufacturer).trim()
            : '';

        invoiceItems.push({
          sku: String(productRowData.sku).trim(),
          name: manufacturer
            ? `${String(productRowData.name).trim()} ${manufacturer}`
            : String(productRowData.name).trim(),
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

    const parsed = parseTTNDate(rows[3]?.[0]);

    return {
      type: DocumentType.TTN,
      date: parsed?.date ?? new Date(),
      number: parseTTNNumber(rows),
      supplierId: SupplierId.MOTEX,
      totalSumWithVat: totalSumWithVat,
      items: invoiceItems,
    };
  },
};
