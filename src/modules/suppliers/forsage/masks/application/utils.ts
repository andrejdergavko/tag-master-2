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
    product.sumWithVat !== null &&
    product.name !== 1 &&
    product.name !== '' &&
    product.sku !== null &&
    product.name !== 'ИТОГО'
  ) {
    return 'product';
  }

  if (product.sku === 'ИТОГО:') {
    return 'total';
  }

  return null;
};

export const getProductRowData = (row: unknown[]) => {
  return {
    manufacturer: row[1],
    sku: row[2],
    name: row[3],
    units: row[6],
    quantity: row[5],
    price: row[7],
    sumWithVat: row[9],
  };
};

export const getTotalRowData = (row: unknown[]) => {
  return {
    totalSumWithVat: Number(String(row[8]).replace('р', '')),
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
