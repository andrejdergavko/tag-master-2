import { useMutation } from '@tanstack/react-query';
import { SupplierId } from '../../../shared/types';

const downloadDocument = async (
  supplierId: SupplierId,
  documentId: string,
) => {
  return window.electron.mail.downloadDocument(supplierId, documentId);
};

export const useDownloadDocument = (
  supplierId: SupplierId,
  documentId: string,
) => {
  return useMutation({
    mutationFn: () => downloadDocument(supplierId, documentId),
  });
};
