import { useQuery } from '@tanstack/react-query';

const getDefaultPrinter = async () => {
  return window.electron.config.getDefaultPrinter();
};

export const DEFAULT_PRINTER_QUERY_KEY = 'DEFAULT_PRINTER';

export const useGetDefaultPrinter = () => {
  return useQuery({
    queryKey: [DEFAULT_PRINTER_QUERY_KEY],
    queryFn: getDefaultPrinter,
  });
};
