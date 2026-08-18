import { useQuery } from '@tanstack/react-query';

const getHasYandexFolderId = async () => {
  return window.electron.config.hasYandexFolderId();
};

export const HAS_YANDEX_FOLDER_ID_QUERY_KEY = 'HAS_YANDEX_FOLDER_ID';

export const useHasYandexFolderId = () => {
  return useQuery({
    queryKey: [HAS_YANDEX_FOLDER_ID_QUERY_KEY],
    queryFn: getHasYandexFolderId,
  });
};
