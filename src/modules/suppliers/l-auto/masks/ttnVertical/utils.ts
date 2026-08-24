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

  if (product.sku === 'ИТОГО:') {
    return 'total';
  }

  return null;
};

export const getProductRowData = (row: unknown[]) => {
  return {
    sku: row[1],
    name: row[2],
    manufacturer: row[3],
    units: row[5],
    quantity: row[6],
    price: row[8],
    cost: row[9],
    sumWithVat: row[12],
  };
};

export const getTotalRowData = (row: unknown[]) => {
  return {
    totalSumWithVat: row[12],
  };
};

export const parseTTNDate = (
  rawCell: unknown,
): { date: Date | null } | null => {
  if (typeof rawCell !== 'string') return null;

  const dateMatch = rawCell.trim().match(/\d{1,2}\.\d{1,2}\.\d{2,4}/);
  if (!dateMatch) return null;

  const dateFormat = dateMatch[0].length > 8 ? 'dd.MM.yyyy' : 'dd.MM.yy';
  const date = parse(dateMatch[0], dateFormat, new Date());

  return {
    date: isValid(date) ? date : null,
  };
};

export const parseTTNNumber = (rawCell: unknown): string | null => {
  if (typeof rawCell !== 'string') return null;

  const number = rawCell.trim();
  if (!number) return null;

  return number;
};
