import { isValid } from 'date-fns/isValid';
import { ru } from 'date-fns/locale/ru';
import { parse } from 'date-fns/parse';

export const getRowType = (row: unknown[]): 'product' | 'total' | null => {
  const product = getProductRowData(row);

  if (product.name === 'ИТОГО' || (product.units === 'х' && product.price === 'х')) {
    return 'total';
  }

  if (
    typeof product.quantity === 'number' &&
    typeof product.name === 'string' &&
    product.name !== '' &&
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
    name: row[0],
    units: row[6],
    quantity: row[8],
    price: row[13],
    cost: row[18],
    vatPercent: row[22],
    vat: row[26],
    sumWithVat: row[32],
    description: row[50],
  };
};

export const getTotalRowData = (row: unknown[]) => {
  return {
    totalNumberOfProducts: row[8],
    totalCost: row[18],
    totalVat: row[26],
    totalSumWithVat: row[32],
  };
};

export const parseSkuAndName = (
  rawName: unknown,
): { sku: string; name: string } => {
  const fullName = String(rawName ?? '').trim();
  const articleMatch = fullName.match(/\(арт\.\s*([^)]+)\)/i);
  const leadingMatch = fullName.match(/^(\S+)\s+(.+)$/);
  const sku = (articleMatch?.[1] ?? leadingMatch?.[1] ?? '').trim();
  const name =
    sku && leadingMatch?.[1] === sku ? leadingMatch[2].trim() : fullName;

  return { sku, name };
};

export const parseTTNDate = (rawCell: unknown): Date | null => {
  if (typeof rawCell !== 'string') return null;

  const dateMatch = rawCell.match(/(\d{1,2})\s+([а-яё]+)\s+(\d{4})/i);
  if (!dateMatch) return null;

  const date = parse(
    `${dateMatch[1]} ${dateMatch[2]} ${dateMatch[3]}`,
    'd MMMM yyyy',
    new Date(),
    { locale: ru },
  );

  return isValid(date) ? date : null;
};

export const parseTTNNumber = (rawCell: unknown): string | null => {
  if (typeof rawCell !== 'string') return null;

  const numberMatch = rawCell.match(/№\s*([0-9A-Za-zА-Яа-яЁё-]+)/);
  if (!numberMatch?.[1]) return null;

  return numberMatch[1];
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
