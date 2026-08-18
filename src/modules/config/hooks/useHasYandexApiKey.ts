import { useQuery } from '@tanstack/react-query';

const getHasYandexApiKey = async () => {
  return window.electron.config.hasYandexApiKey();
};

export const HAS_YANDEX_API_KEY_QUERY_KEY = 'HAS_YANDEX_API_KEY';

export const useHasYandexApiKey = () => {
  return useQuery({
    queryKey: [HAS_YANDEX_API_KEY_QUERY_KEY],
    queryFn: getHasYandexApiKey,
  });
};
