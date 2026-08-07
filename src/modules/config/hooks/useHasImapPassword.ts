import { useQuery } from '@tanstack/react-query';

const getHasImapPassword = async () => {
  return window.electron.config.hasImapPassword();
};

export const HAS_IMAP_PASSWORD_QUERY_KEY = 'HAS_IMAP_PASSWORD';

export const useHasImapPassword = () => {
  return useQuery({
    queryKey: [HAS_IMAP_PASSWORD_QUERY_KEY],
    queryFn: getHasImapPassword,
  });
};
