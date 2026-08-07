import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DEFAULT_PRINTER_QUERY_KEY } from './useGetDefaultPrinter';

const setDefaultPrinter = async (printerName: string | null) => {
  return window.electron.config.setDefaultPrinter(printerName);
};

export const useSetDefaultPrinter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: setDefaultPrinter,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [DEFAULT_PRINTER_QUERY_KEY],
      });
    },
  });
};
