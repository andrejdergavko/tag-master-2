import { useQuery } from '@tanstack/react-query';
import { GetDocumentItemsParams } from '../../../shared/types';

export const DOCUMENT_ITEMS_QUERY_KEY = 'DOCUMENT_ITEMS';

export const useGetDocumentItems = (params: GetDocumentItemsParams) => {
  return useQuery({
    queryKey: [DOCUMENT_ITEMS_QUERY_KEY, params],
    queryFn: () => window.electron.documentItems.getDocumentItems(params),
  });
};
