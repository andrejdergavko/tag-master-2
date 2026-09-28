import { isValid } from 'date-fns/isValid';
import { ru } from 'date-fns/locale/ru';
import { parse } from 'date-fns/parse';

export const getRowType = (row: unknown[]): 'product' | 'total' | null => {
  const product = getProductRowData(row);

  if (
    typeof product.quantity === 'number' &&
    typeof product.name === 'string' &&
    product.name !== '' &&
    product.sku !== null &&
    product.sku !== '' &&
    product.units !== null &&
    product.price !== null &&
    product.sumWithVat !== null &&
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
    sku: row[21],
    name: row[2],
    brand: row[5],
    units: row[6],
    quantity: row[7],
    price: row[8],
    cost: row[10],
    sumWithVat: row[14],
  };
};

export const getTotalRowData = (row: unknown[]) => {
  return {
    totalSumWithVat: row[14],
  };
};

export const parseApplicationDateAndNumber = (
  rawCell: unknown,
): { date: Date | null; number: string | null } | null => {
  if (typeof rawCell !== 'string') return null;

  const numberMatch = rawCell.match(/№\s*(\d+)/);
  const dateMatch = rawCell.match(/(\d{1,2}\s+[а-яё]+\s+\d{4})/i);
  if (!numberMatch || !dateMatch) return null;

  const date = parse(dateMatch[1], 'd MMMM yyyy', new Date(), {
    locale: ru,
  });

  return {
    date: isValid(date) ? date : null,
    number: numberMatch[1],
  };
};
