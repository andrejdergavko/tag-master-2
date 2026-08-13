import { isValid } from 'date-fns/isValid';
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
    product.sumWithVat !== null
  ) {
    return 'product';
  }

  if (product.name === null && typeof product.sumWithVat === 'number') {
    return 'total';
  }

  return null;
};

export const getProductRowData = (row: unknown[]) => {
  return {
    sku: row[1],
    name: row[2],
    units: row[5],
    quantity: row[6],
    price: row[9],
    cost: row[10],
    vatPercent: row[11],
    vat: row[12],
    sumWithVat: row[13],
  };
};

export const getTotalRowData = (row: unknown[]) => {
  return {
    totalNumberOfProducts: row[6],
    totalVat: row[12],
    totalSumWithVat: row[13],
  };
};

export const parseTTNDateAndNumber = (
  rawCell: unknown,
): { date: Date | null; number: string | null } | null => {
  if (typeof rawCell !== 'string') return null;

  const numberMatch = rawCell.match(/\d{6,}/);
  const dateMatch = rawCell.match(/\d{1,2}\.\d{1,2}\.\d{2,4}/);
  if (!numberMatch || !dateMatch) return null;

  const number = numberMatch[0];
  const dateFormat = dateMatch[0].length > 8 ? 'dd.MM.yyyy' : 'dd.MM.yy';
  const date = parse(dateMatch[0], dateFormat, new Date());

  return {
    date: isValid(date) ? date : null,
    number,
  };
};
