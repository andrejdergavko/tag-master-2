import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TagType } from '../../../services/printer/constants';
import { TAG_TYPE_QUERY_KEY } from './useGetTagType';

const setTagType = async (tagType: TagType) => {
  return window.electron.config.setTagType(tagType);
};

export const useSetTagType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: setTagType,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [TAG_TYPE_QUERY_KEY],
      });
    },
  });
};
