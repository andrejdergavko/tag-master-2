import { useMutation, useQueryClient } from '@tanstack/react-query';
import { HAS_IMAP_PASSWORD_QUERY_KEY } from './useHasImapPassword';

const setImapPassword = async (password: string) => {
  return window.electron.config.setImapPassword(password);
};

export const useSetImapPassword = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: setImapPassword,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [HAS_IMAP_PASSWORD_QUERY_KEY],
      });
    },
  });
};
