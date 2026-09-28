import { print } from '@maxxuxx/node-printer';
import { getPrinters } from 'pdf-to-printer';
import { getDefaultPrinter, getTagType } from '../config/configService';
import { sanitizeProductName } from './sanitizeProductName';
import { DEFAULT_PRINTER_NAME, TagType } from './constants';
import get4x25TagLayout from './tagLayouts/4x2.5tag';
import get43x25TagLayout from './tagLayouts/4.3x2.5tag';
import get58x3TagLayout from './tagLayouts/5.8x3tag';
import {
  getCustomTagZpl,
  normalizeCustomTagText,
} from './tagLayouts/customTag';
import { TagData } from './types';

export const getPrinterList = async () => {
  return await getPrinters();
};

const getTagLayout = <T extends TagType>(tagType: T, data: TagData<T>) => {
  switch (tagType) {
    case TagType.FOUR_X_TWO_FIVE:
      return get4x25TagLayout(data);
    case TagType.FOUR_THREE_X_TWO_FIVE:
      return get43x25TagLayout(data);
    case TagType.FIVE_EIGHT_X_THREE:
      return get58x3TagLayout(data);
  }
};

export const printTags = async (
  data: TagData<TagType>[],
  printerName?: string,
) => {
  const tagType = getTagType();
  const resolvedPrinterName =
    printerName ?? getDefaultPrinter() ?? DEFAULT_PRINTER_NAME;

  const tagLayouts = data
    .map((item) =>
      getTagLayout(tagType, {
        ...item,
        name: sanitizeProductName(item.name),
      }),
    )
    .join('');

  const encoded = new TextEncoder().encode(tagLayouts);

  await print(
    {
      type: 'winspool',
      printerName: resolvedPrinterName,
      documentName: 'ZPL Label',
    },
    encoded,
  );
};

const MAX_CUSTOM_COPIES = 99;

export const printCustomTags = async (
  text: string,
  copies: number,
  fontSize?: number,
  printerName?: string,
) => {
  const printable = normalizeCustomTagText(text);
  if (!printable) {
    throw new Error('Пустой текст');
  }

  const tagType = getTagType();
  const resolvedPrinterName =
    printerName ?? getDefaultPrinter() ?? DEFAULT_PRINTER_NAME;
  const count = Math.min(
    MAX_CUSTOM_COPIES,
    Math.max(1, Math.floor(Number(copies)) || 1),
  );
  const tagLayouts = Array.from(
    { length: count },
    () => getCustomTagZpl(tagType, printable, fontSize),
  ).join('');
  const encoded = new TextEncoder().encode(tagLayouts);

  await print(
    {
      type: 'winspool',
      printerName: resolvedPrinterName,
      documentName: 'ZPL Label',
    },
    encoded,
  );
};
