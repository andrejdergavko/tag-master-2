import { print } from '@maxxuxx/node-printer';
import { getPrinters } from 'pdf-to-printer';

export const getPrinterList = async () => {
  return await getPrinters();
};

export const printZpl = async (zpl: string, printerName: string) => {
  const data = new TextEncoder().encode(zpl);

  await print(
    {
      type: 'winspool',
      printerName,
      documentName: 'ZPL Label',
    },
    data,
  );
};
