import { useMutation, useQueryClient } from '@tanstack/react-query';
import { HAS_DATABASE_URL_QUERY_KEY } from './useHasDatabaseUrl';

const setDatabaseUrl = async (databaseUrl: string) => {
  return window.electron.config.setDatabaseUrl(databaseUrl);
};

export const useSetDatabaseUrl = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: setDatabaseUrl,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [HAS_DATABASE_URL_QUERY_KEY],
      });
    },
  });
};
