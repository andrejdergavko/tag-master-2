import { isValid } from 'date-fns/isValid';
import { ru } from 'date-fns/locale/ru';
import { parse } from 'date-fns/parse';
import { WorkBook } from 'xlsx';
import { getRowsInJSON } from '../../../../../shared/utils/common';

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
    product.name !== 'Итого'
  ) {
    return 'product';
  }

  if (product.name === 'Итого') {
    return 'total';
  }

  return null;
};

export const getProductRowData = (row: unknown[]) => {
  return {
    name: row[0],
    units: row[58],
    quantity: row[62],
    price: row[67],
    cost: row[79],
    vatPersent: row[97],
    vat: row[104],
    sumWithVat: row[115],
    description: row[144],
  };
};

export const getTotalRowData = (row: unknown[]) => {
  return {
    totalNumberOfProducts: row[62],
    totalCost: row[79],
    totalVat: row[104],
    totalSumWithVat: row[115],
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

export const parseTTNNumber = (workbook: WorkBook): string | null => {
  const sheet = workbook.Sheets['стр4'];
  if (!sheet) return null;

  const rows = getRowsInJSON(sheet);
  const number = rows[3]?.[3];

  if (number === null || number === undefined) return null;

  return String(number);
};
