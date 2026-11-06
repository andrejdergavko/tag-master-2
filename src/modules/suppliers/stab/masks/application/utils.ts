import { isValid } from 'date-fns/isValid';
import { parse } from 'date-fns/parse';

export const getRowType = (row: unknown[]): 'product' | 'total' | null => {
  const product = getProductRowData(row);
  const units =
    typeof product.units === 'string' ? product.units.trim().toLowerCase() : '';
  const price =
    typeof product.price === 'string' ? product.price.trim().toLowerCase() : '';

  if (units === 'х' && price === 'х') {
    return 'total';
  }

  if (
    typeof product.quantity === 'number' &&
    typeof product.name === 'string' &&
    product.name.trim() !== '' &&
    typeof product.units === 'string' &&
    product.units.trim() !== '' &&
    typeof product.sumWithVat === 'number'
  ) {
    return 'product';
  }

  return null;
};

export const getProductRowData = (row: unknown[]) => {
  return {
    name: row[0],
    units: row[14],
    quantity: row[17],
    price: row[20],
    sumWithVat: row[37],
    description: row[48],
  };
};

export const getTotalRowData = (row: unknown[]) => {
  return {
    totalSumWithVat: row[37],
  };
};

export const parseSkuAndName = (
  rawName: unknown,
): { sku: string; name: string } => {
  const text = String(rawName ?? '')
    .trim()
    .replace(/,?\s*Страна происх\.:.*$/i, '')
    .replace(/,\s*$/, '')
    .trim();
  const match = text.match(/^(.*),\s*([A-Za-z0-9][A-Za-z0-9-]*)\s*$/);

  if (!match?.[1] || !match[2]) {
    return { sku: '', name: text };
  }

  return {
    sku: match[2],
    name: match[1].trim(),
  };
};

export const parseBarcode = (rawNote: unknown): string => {
  const note = String(rawNote ?? '');
  const match = note.match(/штрихкод:\s*(\d+)/i);

  return match?.[1] ?? '';
};

export const parseTTNDateAndNumber = (
  rawCell: unknown,
): { date: Date | null; number: string | null } | null => {
  if (typeof rawCell !== 'string') return null;

  const numberMatch = rawCell.match(/№\s*(\d+)/);
  const dateMatch = rawCell.match(/\d{1,2}\.\d{1,2}\.\d{4}/);
  if (!numberMatch?.[1] || !dateMatch) return null;

  const date = parse(dateMatch[0], 'dd.MM.yyyy', new Date());

  return {
    date: isValid(date) ? date : null,
    number: numberMatch[1],
  };
};
