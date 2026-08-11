import { useQuery } from '@tanstack/react-query';
import { SupplierId } from '../../../shared/types';

const getDocuments = async (supplierIds?: SupplierId | SupplierId[]) => {
  // @ts-ignore
  return window.electron.mail.getDocuments(supplierIds);
};

export const DOCUMENTS_QUERY_KEY = 'DOCUMENTS';

export const useGetDocuments = (supplierIds?: SupplierId | SupplierId[]) => {
  return useQuery({
    queryKey: [DOCUMENTS_QUERY_KEY, supplierIds ?? null],
    queryFn: () => getDocuments(supplierIds),
  });
};
