import { MessageStructureObject } from 'imapflow/lib/imap-flow';
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
import { read, set_cptable } from 'xlsx';
// @ts-expect-error SheetJS codepage tables ship without typings
import * as cptable from 'xlsx/dist/cpexcel.full.mjs';
import {
  getProductRowData,
  getRowType,
  getTotalRowData,
  parseBarcode,
  parseSkuAndName,
  parseTTNDateAndNumber,
} from './utils';
import { getRowsInJSON } from '../../../../../shared/utils/common';

set_cptable(cptable);

export const applicationMask = {
  type: DocumentType.TTN,
  description: 'Приложение к ТТН',
  isMatch: (attachment: MessageStructureObject) => {
    if (
      attachment.type !== MIME_TYPE_EXCEL_OLD &&
      attachment.type !== MIME_TYPE_EXCEL_MSEXCEL &&
      attachment.type !== MIME_TYPE_EXCEL
    ) {
      return false;
    }

    const name = attachment.parameters?.name?.toLowerCase() ?? '';

    return name.includes('приложен');
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
        const { sku, name } = parseSkuAndName(productRowData.name);
        const barcode = parseBarcode(productRowData.description);

        invoiceItems.push({
          sku: sku || undefined,
          name: barcode ? `${name} ${barcode}` : name,
          units: String(productRowData.units).trim(),
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

    const parsed = parseTTNDateAndNumber(sheet.O2?.v);

    return {
      type: DocumentType.TTN,
      date: parsed?.date ?? new Date(),
      number: parsed?.number,
      supplierId: SupplierId.STAB,
      totalSumWithVat,
      items: invoiceItems,
    };
  },
};
