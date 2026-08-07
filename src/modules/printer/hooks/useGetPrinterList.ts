import { useQuery } from '@tanstack/react-query';

const getPrinterList = async () => {
  return window.electron.printer.getPrinterList();
};

export const PRINTER_LIST_QUERY_KEY = 'PRINTER_LIST';

export const useGetPrinterList = () => {
  return useQuery({
    queryKey: [PRINTER_LIST_QUERY_KEY],
    queryFn: getPrinterList,
  });
};
