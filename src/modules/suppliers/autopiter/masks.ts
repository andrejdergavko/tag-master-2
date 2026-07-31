import { MessageStructureObject } from 'imapflow/lib/imap-flow';
import { isValid, parse } from 'date-fns';
import { ru } from 'date-fns/locale';
import { read } from 'xlsx';
import { IMask } from '../types';
import { MIME_TYPE_EXCEL } from '../../../shared/constants';
import { DocumentType, IDocumentItem, SupplierId } from '../../../shared/types';
import { getRowsInJSON } from '../../../services/mail/utils';

const masks: IMask[] = [
  {
    type: DocumentType.TN,
    description: 'ТН вертикальная',
    isMatch: (attachment: MessageStructureObject) => {
      if (attachment.type !== MIME_TYPE_EXCEL) {
        return false;
      }

      if (!attachment.parameters?.name?.includes('ТН-2 Реализация')) {
        return false;
      }

      return true;
    },

    extractData: (buffer: Buffer) => {
      const workbook = read(buffer, { type: 'buffer' });
      const sheet = workbook.Sheets[workbook.SheetNames[0] ?? ''];

      if (!sheet) throw new Error('Sheet not found');

      let totalSumWithVat = 0;
      const invoiceItems: IDocumentItem[] = [];

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
        type: DocumentType.TN,
        date: parseInvoiceDate(sheet.M23?.v) ?? new Date(),
        supplierId: SupplierId.AUTOPITER,
        totalSumWithVat: totalSumWithVat,
        items: invoiceItems,
      };
    },
  },
];

export default masks;

const getRowType = (row: unknown[]): 'product' | 'total' | null => {
  const product = getProductRowData(row);

  if (
    typeof product.quantity === 'number' &&
    product.name !== null &&
    product.quantity !== null &&
    product.price !== null &&
    product.cost !== null &&
    product.sumWithVat !== null &&
    product.name !== 1 &&
    product.name !== 'ИТОГО'
  ) {
    return 'product';
  }

  if (product.name === 'ИТОГО') {
    return 'total';
  }

  return null;
};

const getProductRowData = (row: unknown[]) => {
  return {
    name: row[1],
    units: row[10],
    quantity: row[12],
    price: row[15],
    cost: row[18],
    vatPersent: row[21],
    vat: row[23],
    sumWithVat: row[26],
    description: row[29],
  };
};

const getTotalRowData = (row: unknown[]) => {
  return {
    totalNumberOfProducts: row[12],
    totalCost: row[18],
    totalVat: row[23],
    totalSumWithVat: row[26],
  };
};

const parseInvoiceDate = (rawDate: unknown): Date | null => {
  if (typeof rawDate !== 'string') return null;

  const normalizedDate = rawDate.replace(/\s*г\.$/, '').trim();
  const parsedDate = parse(normalizedDate, 'd MMMM yyyy', new Date(), {
    locale: ru,
  });

  return isValid(parsedDate) ? parsedDate : null;
};
