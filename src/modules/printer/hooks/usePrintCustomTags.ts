import { useMutation } from '@tanstack/react-query';

type PrintCustomTagsParams = {
  text: string;
  copies: number;
  fontSize?: number;
};

const printCustomTags = ({
  text,
  copies,
  fontSize,
}: PrintCustomTagsParams) => {
  return window.electron.printer.printCustomTags(text, copies, fontSize);
};

export const usePrintCustomTags = () => {
  return useMutation({
    mutationFn: printCustomTags,
  });
};
