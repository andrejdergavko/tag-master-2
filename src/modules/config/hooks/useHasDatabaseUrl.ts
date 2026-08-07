import { useQuery } from '@tanstack/react-query';

const getHasDatabaseUrl = async () => {
  return window.electron.config.hasDatabaseUrl();
};

export const HAS_DATABASE_URL_QUERY_KEY = 'HAS_DATABASE_URL';

export const useHasDatabaseUrl = () => {
  return useQuery({
    queryKey: [HAS_DATABASE_URL_QUERY_KEY],
    queryFn: getHasDatabaseUrl,
  });
};
