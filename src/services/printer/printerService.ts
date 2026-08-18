import { print } from '@maxxuxx/node-printer';
import { getPrinters } from 'pdf-to-printer';
import { getDefaultPrinter } from '../config/configService';
import { sanitizeProductName } from './sanitizeProductName';
import { DEFAULT_PRINTER_NAME, TagType } from './constants';
import get4x25TagLayout from './tagLayouts/4x2.5tag';
import get58x3TagLayout from './tagLayouts/5.8x3tag';
import { TagData } from './types';

export const getPrinterList = async () => {
  return await getPrinters();
};

const getTagLayout = <T extends TagType>(tagType: T, data: TagData<T>) => {
  switch (tagType) {
    case TagType.FOUR_X_TWO_FIVE:
      return get4x25TagLayout(data);
    case TagType.FIVE_EIGHT_X_THREE:
      return get58x3TagLayout(data);
  }
};

export const printTags = async <T extends TagType>(
  tagType: T,
  data: TagData<T>[],
  printerName?: string,
) => {
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
