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
  parseDocumentNumberFromAttachmentName,
} from './utils';
import { getRowsInJSON } from '../../../../../shared/utils/common';

set_cptable(cptable);

export const attachmentMask = {
  type: DocumentType.OTHER,
  description: 'Приложение',
  isMatch: (attachment: MessageStructureObject) => {
    if (attachment.type !== MIME_TYPE_EXCEL_OLD) {
      return false;
    }

    const name = attachment.parameters?.name?.toLowerCase() ?? '';

    return name.endsWith('.xls');
  },

  extractData: (buffer: Buffer, attachmentName?: string) => {
    const workbook = read(buffer, { type: 'buffer', codepage: 1251 });
    const sheet = workbook.Sheets[workbook.SheetNames[0] ?? ''];

    if (!sheet) throw new Error('Sheet not found');

    let totalSumWithVat = 0;
    const invoiceItems: DocumentItemDTO[] = [];

    getRowsInJSON(sheet).forEach((row) => {
      const rowType = getRowType(row);

      if (rowType === 'product') {
        const productRowData = getProductRowData(row);
        const barcode =
          productRowData.barcode != null ? String(productRowData.barcode) : '';

        invoiceItems.push({
          sku: String(productRowData.sku),
          name: barcode
            ? `${String(productRowData.name)} ${barcode}`
            : String(productRowData.name),
          units: String(productRowData.units),
          quantity: Number(productRowData.quantity),
          sumWithVat: Number(productRowData.sumWithVat),
          description: '',
        });
      }
      if (rowType === 'total') {
        const totalRowData = getTotalRowData(row);
        totalSumWithVat = Math.round(Number(totalRowData.totalSumWithVat) * 100) / 100;
      }
    });

    return {
      type: DocumentType.OTHER,
      date: new Date(),
      number: parseDocumentNumberFromAttachmentName(attachmentName),
      supplierId: SupplierId.PILOT,
      totalSumWithVat,
      items: invoiceItems,
    };
  },
};
