import { useMutation, useQueryClient } from '@tanstack/react-query';
import { HAS_EMAIL_QUERY_KEY } from './useHasEmail';

const setEmail = async (email: string) => {
  return window.electron.config.setEmail(email);
};

export const useSetEmail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: setEmail,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [HAS_EMAIL_QUERY_KEY],
      });
    },
  });
};
