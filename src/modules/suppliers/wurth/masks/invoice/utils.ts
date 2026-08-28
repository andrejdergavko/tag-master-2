import { isValid } from 'date-fns/isValid';
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
    typeof product.quantity === 'number' &&
    typeof product.sumWithVat === 'number' &&
    typeof product.name === 'string' &&
    product.name !== '' &&
    product.name !== 'Итого:' &&
    product.sku != null &&
    product.sku !== '' &&
    product.sku !== 'Артикул' &&
    typeof product.units === 'string' &&
    product.units !== 'х'
  ) {
    return 'product';
  }

  if (product.name === 'Итого:') {
    return 'total';
  }

  return null;
};

export const getProductRowData = (row: unknown[]) => {
  return {
    sku: row[4],
    name: row[5],
    units: row[29],
    quantity: parseAmount(row[33]),
    price: row[37],
    cost: row[43],
    sumWithVat: parseAmount(row[61]),
    barcode: row[68],
  };
};

export const getTotalRowData = (row: unknown[]) => {
  return {
    totalSumWithVat: parseAmount(row[61]),
  };
};

export const parseInvoiceDateAndNumber = (
  rows: unknown[][],
): { date: Date | null; number: string | null } | null => {
  for (const row of rows) {
    for (const cell of row) {
      if (typeof cell !== 'string') continue;

      const match = cell.match(/№\s*(.+?)\s+от\s+(\d{1,2}\.\d{1,2}\.\d{2,4})/);
      if (!match?.[1] || !match[2]) continue;

      const dateFormat = match[2].length > 8 ? 'dd.MM.yyyy' : 'dd.MM.yy';
      const date = parse(match[2], dateFormat, new Date());

      return {
        date: isValid(date) ? date : null,
        number: match[1].trim(),
      };
    }
  }

  return null;
};
