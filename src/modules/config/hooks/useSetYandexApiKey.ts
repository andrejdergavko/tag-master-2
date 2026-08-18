import { useMutation, useQueryClient } from '@tanstack/react-query';
import { HAS_YANDEX_API_KEY_QUERY_KEY } from './useHasYandexApiKey';

const setYandexApiKey = async (apiKey: string) => {
  return window.electron.config.setYandexApiKey(apiKey);
};

export const useSetYandexApiKey = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: setYandexApiKey,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [HAS_YANDEX_API_KEY_QUERY_KEY],
      });
    },
  });
};
