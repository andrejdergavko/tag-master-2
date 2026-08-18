import { useMutation, useQueryClient } from '@tanstack/react-query';
import { HAS_YANDEX_FOLDER_ID_QUERY_KEY } from './useHasYandexFolderId';

const setYandexFolderId = async (folderId: string) => {
  return window.electron.config.setYandexFolderId(folderId);
};

export const useSetYandexFolderId = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: setYandexFolderId,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [HAS_YANDEX_FOLDER_ID_QUERY_KEY],
      });
    },
  });
};
