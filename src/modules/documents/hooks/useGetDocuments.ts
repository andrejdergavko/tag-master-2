import { useQuery } from '@tanstack/react-query';
import { SupplierId } from '../../../shared/types';

const getDocuments = async (supplierId: SupplierId) => {
  // @ts-ignore
  const documents = await window.electron.mail.getSupplierDocuments(supplierId);
  return documents;
};

export const DOCUMENTS_QUERY_KEY = 'DOCUMENTS';

export const useGetDocuments = (supplierId: SupplierId) => {
  return useQuery({
    queryKey: [DOCUMENTS_QUERY_KEY, supplierId],
    queryFn: () => getDocuments(supplierId),
  });
};
