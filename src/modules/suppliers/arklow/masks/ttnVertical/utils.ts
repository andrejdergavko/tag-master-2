import { isValid } from 'date-fns/isValid';
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
    units: row[3],
    quantity: row[4],
    price: row[5],
    cost: row[6],
    vatPersent: row[7],
    vat: row[8],
    sumWithVat: row[9],
    description: row[12],
  };
};

export const getTotalRowData = (row: unknown[]) => {
  return {
    totalNumberOfProducts: row[4],
    totalCost: row[6],
    totalVat: row[8],
    totalSumWithVat: row[9],
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
