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
    barcode: row[1],
    name: row[7],
    units: row[8],
    quantity: row[10],
    price: row[13],
    cost: row[16],
    vatPersent: row[19],
    vat: row[21],
    sumWithVat: row[24],
    description: row[33],
  };
};

export const getTotalRowData = (row: unknown[]) => {
  return {
    totalNumberOfProducts: row[10],
    totalCost: row[16],
    totalVat: row[21],
    totalSumWithVat: row[24],
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

export const parseTTNNumber = (rows: unknown[][]): string | null => {
  for (const row of rows) {
    for (const cell of row) {
      if (typeof cell !== 'string') continue;

      const match = cell.match(/номер\s+(\d+)/i);
      if (match?.[1]) return match[1];
    }
  }

  return null;
};
