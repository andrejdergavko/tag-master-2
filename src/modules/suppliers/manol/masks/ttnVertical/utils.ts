import { isValid } from 'date-fns/isValid';
import { ru } from 'date-fns/locale/ru';
import { parse } from 'date-fns/parse';

export const parseDecimal = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value !== 'string') return null;

  const normalized = value.trim().replace(/\s/g, '').replace(',', '.');
  if (!normalized || normalized === 'х' || normalized === 'x') return null;

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
};

export const getRowType = (row: unknown[]): 'product' | 'total' | null => {
  if (String(row[0] ?? '').trim().toLowerCase().startsWith('итого')) {
    return 'total';
  }

  const product = getProductRowData(row);
  const name = typeof product.name === 'string' ? product.name.trim() : '';
  const units = typeof product.units === 'string' ? product.units.trim() : '';

  if (
    name.length > 1 &&
    /[a-zа-яё]/i.test(units) &&
    parseDecimal(product.quantity) !== null &&
    parseDecimal(product.sumWithVat) !== null
  ) {
    return 'product';
  }

  return null;
};

export const getProductRowData = (row: unknown[]) => {
  return {
    sku: row[19],
    name: row[1],
    units: row[2],
    quantity: row[3],
    sumWithVat: row[9],
    description: row[13],
  };
};

export const getTotalRowData = (row: unknown[]) => {
  return {
    totalSumWithVat: row[9],
  };
};

export const parseTTNDate = (rawCell: unknown): Date | null => {
  if (typeof rawCell !== 'string') return null;

  const normalizedDate = rawCell.replace(/\s*г\.?$/, '').trim();
  const parsedDate = parse(normalizedDate, 'd MMMM yyyy', new Date(), {
    locale: ru,
  });

  return isValid(parsedDate) ? parsedDate : null;
};

export const parseTTNNumber = (rawCell: unknown): string | null => {
  if (typeof rawCell !== 'string') return null;

  const numberMatch = rawCell.match(/№\s*([0-9A-Za-zА-Яа-яЁё]+)/);
  if (!numberMatch?.[1]) return null;

  return numberMatch[1];
};

// В файлах этого поставщика у пустых ячеек указана неверная последняя колонка,
// из-за этого библиотека чтения таблиц не открывает лист.
export const fixMulBlankRecords = (buffer: Buffer): Buffer => {
  const copy = Buffer.from(buffer);

  for (let offset = 0; offset < copy.length - 10; offset += 1) {
    if (copy.readUInt16LE(offset) !== 0x00be) continue;

    const length = copy.readUInt16LE(offset + 2);
    if (length < 6 || length > 8224 || (length - 6) % 2 !== 0) continue;
    if (offset + 4 + length > copy.length) continue;

    const firstColumn = copy.readUInt16LE(offset + 6);
    const styleCount = (length - 6) / 2;
    const lastColumnOffset = offset + 4 + length - 2;
    const lastColumn = copy.readUInt16LE(lastColumnOffset);

    if (firstColumn > 255 || lastColumn > 255) continue;
    if (styleCount === lastColumn - firstColumn + 1) continue;

    const fixedLastColumn = firstColumn + styleCount - 1;
    if (fixedLastColumn < 0 || fixedLastColumn > 255) continue;

    copy.writeUInt16LE(fixedLastColumn, lastColumnOffset);
  }

  return copy;
};
