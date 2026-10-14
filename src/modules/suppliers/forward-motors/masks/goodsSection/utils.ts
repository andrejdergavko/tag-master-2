import { isValid } from 'date-fns/isValid';
import { parse } from 'date-fns/parse';

export const getRowType = (row: unknown[]): 'product' | 'total' | null => {
  if (String(row[0] ?? '').trim().toLowerCase() === 'итого') {
    return 'total';
  }

  const product = getProductRowData(row);

  if (
    typeof product.quantity === 'number' &&
    typeof product.name === 'string' &&
    product.name.trim() !== '' &&
    typeof product.sku === 'string' &&
    product.sku.trim() !== '' &&
    product.units != null &&
    product.units !== '' &&
    typeof product.sumWithVat === 'number'
  ) {
    return 'product';
  }

  return null;
};

export const getProductRowData = (row: unknown[]) => {
  return {
    sku: row[1],
    name: row[2],
    units: row[5],
    quantity: row[6],
    sumWithVat: row[13],
    note: row[25],
  };
};

export const getTotalRowData = (row: unknown[]) => {
  return {
    totalSumWithVat: row[13],
  };
};

export const parseDocumentDate = (rawCell: unknown): Date | null => {
  if (rawCell instanceof Date) {
    return isValid(rawCell) ? rawCell : null;
  }

  if (typeof rawCell !== 'string') return null;

  const dateMatch = rawCell.trim().match(/^(\d{1,2}\.\d{1,2}\.\d{2,4})$/);
  if (!dateMatch?.[1]) return null;

  const dateFormat = dateMatch[1].length > 8 ? 'dd.MM.yyyy' : 'dd.MM.yy';
  const date = parse(dateMatch[1], dateFormat, new Date());

  return isValid(date) ? date : null;
};

export const parseDocumentNumber = (rawCell: unknown): string | null => {
  if (typeof rawCell !== 'string') return null;

  const number = rawCell.trim();
  if (!number) return null;

  return number;
};

// Файлы из 1С помечают архив флагом, из-за которого библиотека чтения таблиц не открывает лист.
export const clearUtf8ZipFlag = (buffer: Buffer): Buffer => {
  const copy = Buffer.from(buffer);
  let offset = 0;

  while (offset < copy.length - 4) {
    const signature = copy.readUInt32LE(offset);

    if (signature === 0x04034b50) {
      const flags = copy.readUInt16LE(offset + 6);
      copy.writeUInt16LE(flags & ~0x800, offset + 6);
      const compressedSize = copy.readUInt32LE(offset + 18);
      const nameLength = copy.readUInt16LE(offset + 26);
      const extraLength = copy.readUInt16LE(offset + 28);
      offset += 30 + nameLength + extraLength + compressedSize;
      continue;
    }

    if (signature === 0x02014b50) {
      const flags = copy.readUInt16LE(offset + 8);
      copy.writeUInt16LE(flags & ~0x800, offset + 8);
      const nameLength = copy.readUInt16LE(offset + 28);
      const extraLength = copy.readUInt16LE(offset + 30);
      const commentLength = copy.readUInt16LE(offset + 32);
      offset += 46 + nameLength + extraLength + commentLength;
      continue;
    }

    if (signature === 0x06054b50) break;

    offset += 1;
  }

  return copy;
};
