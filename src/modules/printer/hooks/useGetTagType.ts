import { useQuery } from '@tanstack/react-query';

const getTagType = async () => {
  return window.electron.config.getTagType();
};

export const TAG_TYPE_QUERY_KEY = 'TAG_TYPE';

export const useGetTagType = () => {
  return useQuery({
    queryKey: [TAG_TYPE_QUERY_KEY],
    queryFn: getTagType,
  });
};
