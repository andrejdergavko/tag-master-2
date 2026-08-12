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
  parsePackingListDateAndNumber,
} from './utils';
import { getRowsInJSON } from '../../../../../shared/utils/common';

set_cptable(cptable);

export const packingListMask = {
  type: DocumentType.OTHER,
  description: 'Упаковочный лист',
  isMatch: (attachment: MessageStructureObject) => {
    if (attachment.type !== MIME_TYPE_EXCEL_OLD) {
      return false;
    }

    if (!attachment.parameters?.name?.includes('НаклРк')) {
      return false;
    }

    return true;
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
          sku: String(productRowData.sku),
          name: `${String(productRowData.name)} ${String(productRowData.brand ?? '')}`,
          units: 'шт.',
          quantity: Number(productRowData.quantity),
          sumWithVat: Number(productRowData.sumWithVat),
          description: '',
        });
      }
      if (rowType === 'total') {
        const totalRowData = getTotalRowData(row);
        totalSumWithVat = Number(totalRowData.totalSumWithVat);
      }
    });

    const parsed = parsePackingListDateAndNumber(sheet.F4?.v);

    return {
      type: DocumentType.OTHER,
      date: parsed?.date ?? new Date(),
      number: parsed?.number,
      supplierId: SupplierId.MONLIBON,
      totalSumWithVat: totalSumWithVat,
      items: invoiceItems,
    };
  },
};
