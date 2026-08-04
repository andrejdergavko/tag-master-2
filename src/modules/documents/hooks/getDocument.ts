import { useQuery } from '@tanstack/react-query';
import { SupplierId } from '../../../shared/types';

const getDocument = async (supplierId: SupplierId, documentId: string) => {
  // @ts-ignore
  return window.electron.mail.getDocument(supplierId, documentId);
};

export const DOCUMENT_QUERY_KEY = 'DOCUMENT';

export const useGetDocument = (
  supplierId: SupplierId,
  documentId: string,
) => {
  return useQuery({
    queryKey: [DOCUMENT_QUERY_KEY, supplierId, documentId],
    queryFn: () => getDocument(supplierId, documentId),
    enabled: Boolean(supplierId && documentId),
  });
};
