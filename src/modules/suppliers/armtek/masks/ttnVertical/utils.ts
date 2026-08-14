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
    product.price !== null &&
    product.cost !== null &&
    product.sumWithVat !== null &&
    product.sku !== 'ИТОГО'
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
    sku: row[0],
    name: row[3],
    units: row[6],
    quantity: row[8],
    price: row[11],
    cost: row[14],
    vatPercent: row[17],
    vat: row[19],
    sumWithVat: row[22],
    description: row[31],
  };
};

export const getTotalRowData = (row: unknown[]) => {
  return {
    totalNumberOfProducts: row[8],
    totalCost: row[14],
    totalVat: row[19],
    totalSumWithVat: row[22],
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
