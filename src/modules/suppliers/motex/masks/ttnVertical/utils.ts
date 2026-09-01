import { isValid } from 'date-fns/isValid';
import { SSF } from 'xlsx';

export const getRowType = (row: unknown[]): 'product' | 'total' | null => {
  const product = getProductRowData(row);

  if (
    typeof product.quantity === 'number' &&
    typeof product.name === 'string' &&
    product.name !== '' &&
    product.sku != null &&
    product.sku !== '' &&
    product.units != null &&
    product.sumWithVat != null
  ) {
    return 'product';
  }

  if (
    product.name == null &&
    product.sku == null &&
    typeof product.sumWithVat === 'number'
  ) {
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
    sumWithVat: row[13],
    description: row[26],
  };
};

export const getTotalRowData = (row: unknown[]) => {
  return {
    totalSumWithVat: row[13],
  };
};

export const parseTTNDate = (
  rawCell: unknown,
): { date: Date | null } | null => {
  if (typeof rawCell !== 'number') return null;

  const parsed = SSF.parse_date_code(rawCell);
  if (!parsed) return null;

  const date = new Date(parsed.y, parsed.m - 1, parsed.d);

  return {
    date: isValid(date) ? date : null,
  };
};

export const parseTTNNumber = (rows: unknown[][]): string | null => {
  const number = rows[3]?.[3];

  if (number === null || number === undefined) return null;

  return String(number);
};
