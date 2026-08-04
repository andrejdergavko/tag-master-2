import { useMutation, useQueryClient } from '@tanstack/react-query';
import { SupplierId } from '../../../shared/types';
import { DOCUMENTS_QUERY_KEY } from './useGetDocuments';

const fetchDocuments = async (supplierId: SupplierId) => {
  // @ts-ignore
  return window.electron.mail.fetchNewInvoicesBySupplier(supplierId);
};

export const useFetchDocuments = (supplierId: SupplierId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => fetchDocuments(supplierId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [DOCUMENTS_QUERY_KEY, supplierId],
      });
    },
  });
};
