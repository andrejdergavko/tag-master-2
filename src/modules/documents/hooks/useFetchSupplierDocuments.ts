import { useMutation, useQueryClient } from '@tanstack/react-query';
import { SupplierId } from '../../../shared/types';
import { DOCUMENTS_QUERY_KEY } from './useGetDocuments';

const fetchNewInvoicesBySupplier = async (supplierId: SupplierId) => {
  return window.electron.mail.fetchNewInvoicesBySupplier(supplierId);
};

export const useFetchSupplierDocuments = (supplierId: SupplierId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => fetchNewInvoicesBySupplier(supplierId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [DOCUMENTS_QUERY_KEY],
      });
    },
  });
};
