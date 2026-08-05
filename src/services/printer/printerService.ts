import { print } from '@maxxuxx/node-printer';
import { getPrinters } from 'pdf-to-printer';
import { DEFAULT_PRINTER_NAME, TagType } from './constants';
import get4x25TagLayout from './tagLayouts/4x2.5tag';
import { TagData } from './types';

export const getPrinterList = async () => {
  return await getPrinters();
};

const getTagLayout = <T extends TagType>(tagType: T, data: TagData<T>) => {
  switch (tagType) {
    case TagType.FOUR_X_TWO_FIVE:
      return get4x25TagLayout(data);
  }
};

export const printTag = async <T extends TagType>(
  tagType: T,
  data: TagData<T>,
  printerName: string = DEFAULT_PRINTER_NAME,
) => {
  const tagLayout = getTagLayout(tagType, data);

  const encoded = new TextEncoder().encode(tagLayout);

  await print(
    {
      type: 'winspool',
      printerName,
      documentName: 'ZPL Label',
    },
    encoded,
  );
};
