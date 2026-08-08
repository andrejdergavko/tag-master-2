import { isValid } from 'date-fns/isValid';
import { ru } from 'date-fns/locale/ru';
import { parse } from 'date-fns/parse';

export const getRowType = (row: unknown[]): 'product' | 'total' | null => {
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

  if (product.units === 'х' && product.price === 'х') {
    return 'total';
  }

  return null;
};

export const getProductRowData = (row: unknown[]) => {
  return {
    name: row[1],
    units: row[7],
    quantity: row[9],
    price: row[11],
    cost: row[13],
    vatPersent: row[15],
    vat: row[17],
    sumWithVat: row[19],
    description: row[25],
  };
};

export const getTotalRowData = (row: unknown[]) => {
  return {
    totalNumberOfProducts: row[9],
    totalCost: row[13],
    totalVat: row[17],
    totalSumWithVat: row[19],
  };
};

export const parseTTNDate = (
  rawCell: unknown,
): { date: Date | null } | null => {
  if (typeof rawCell !== 'string') return null;

  const normalizedDate = rawCell.replace(/\s*г\.?$/, '').trim();
  const parsedDate = parse(normalizedDate, 'd MMMM yyyy', new Date(), {
    locale: ru,
  });

  return {
    date: isValid(parsedDate) ? parsedDate : null,
  };
};

export const parseTTNNumberFromAttachmentName = (
  attachmentName: unknown,
): string | null => {
  if (typeof attachmentName !== 'string') return null;

  const match = attachmentName.match(/(\d+)\.xls$/i);
  if (!match) return null;

  return String(Number(match[1]));
};
