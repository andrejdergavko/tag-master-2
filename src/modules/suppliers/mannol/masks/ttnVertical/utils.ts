import { isValid } from 'date-fns/isValid';
import { ru } from 'date-fns/locale/ru';
import { parse } from 'date-fns/parse';

const parseAmount = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value !== 'string') {
    return null;
  }

  const normalized = value.replace(/\s/g, '').replace(',', '.');
  const parsed = Number(normalized);

  return Number.isFinite(parsed) ? parsed : null;
};

export const getRowType = (row: unknown[]): 'product' | 'total' | null => {
  const product = getProductRowData(row);

  if (
    typeof parseAmount(row[0]) === 'number' &&
    typeof product.quantity === 'number' &&
    typeof product.name === 'string' &&
    product.name !== '' &&
    product.sku != null &&
    product.sku !== '' &&
    product.units != null &&
    product.units !== 'х' &&
    product.sumWithVat != null
  ) {
    return 'product';
  }

  if (row[0] === 'ИТОГО:' || (product.units === 'х' && product.price === 'х')) {
    return 'total';
  }

  return null;
};

export const getProductRowData = (row: unknown[]) => {
  return {
    sku: row[19],
    name: row[1],
    units: row[2],
    quantity: parseAmount(row[3]),
    price: row[4],
    cost: row[5],
    vatPercent: row[7],
    vat: row[8],
    sumWithVat: parseAmount(row[9]),
    description: row[24],
  };
};

export const getTotalRowData = (row: unknown[]) => {
  return {
    totalSumWithVat: parseAmount(row[9]),
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

export const parseTTNNumber = (rawCell: unknown): string | null => {
  if (typeof rawCell !== 'string') return null;

  const match = rawCell.match(/№\s*(\S+)/);
  if (!match?.[1]) return null;

  return match[1];
};
