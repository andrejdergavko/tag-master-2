import { useQuery } from '@tanstack/react-query';

const getHasEmail = async () => {
  return window.electron.config.hasEmail();
};

export const HAS_EMAIL_QUERY_KEY = 'HAS_EMAIL';

export const useHasEmail = () => {
  return useQuery({
    queryKey: [HAS_EMAIL_QUERY_KEY],
    queryFn: getHasEmail,
  });
};
