import { useQuery } from '@tanstack/react-query';
import { DocumentDTO, SupplierId } from '../../../shared/types';

const getDocument = async (supplierId: SupplierId, documentId: string) => {
  // @ts-ignore
  return window.electron.mail.getDocument(supplierId, documentId);
};

export const DOCUMENT_QUERY_KEY = 'DOCUMENT';

export const useGetDocument = (
  supplierId: SupplierId | undefined,
  documentId: string | undefined,
) => {
  return useQuery<DocumentDTO | null, Error>({
    queryKey: [DOCUMENT_QUERY_KEY, supplierId, documentId],
    queryFn: () => {
      if (!supplierId || !documentId) {
        throw new Error('Supplier ID and document ID are required');
      }

      return getDocument(supplierId, documentId);
    },
    enabled: !!supplierId && !!documentId,
  });
};
