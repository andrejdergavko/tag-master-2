import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DOCUMENT_QUERY_KEY } from '../../documents/hooks/useGetDocument';
import { DOCUMENT_ITEMS_QUERY_KEY } from '../../documents/hooks/useGetDocumentItems';
import { TagType } from '../../../services/printer/constants';
import { TagData } from '../../../services/printer/types';

type PrintTagsParams = {
  data: TagData<TagType>[];
  printerName?: string;
};

const printTags = ({ data, printerName }: PrintTagsParams) => {
  return window.electron.printer.printTags(data, printerName);
};

export const usePrintTags = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: printTags,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [DOCUMENT_QUERY_KEY],
      });
      queryClient.invalidateQueries({
        queryKey: [DOCUMENT_ITEMS_QUERY_KEY],
      });
    },
  });
};
