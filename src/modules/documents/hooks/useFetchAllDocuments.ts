import { useCallback, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import suppliers from '../../suppliers';
import { SupplierId } from '../../../shared/types';
import { DOCUMENTS_QUERY_KEY } from './useGetDocuments';

export type SupplierFetchStatus = 'idle' | 'pending' | 'success' | 'error';

export type SupplierFetchState = {
  status: SupplierFetchStatus;
  errorMessage?: string;
};

const initialStatuses = (): Record<SupplierId, SupplierFetchState> =>
  Object.fromEntries(
    suppliers.map((supplier) => [supplier.id, { status: 'idle' as const }]),
  ) as Record<SupplierId, SupplierFetchState>;

export const useFetchAllDocuments = () => {
  const queryClient = useQueryClient();
  const isRunningRef = useRef(false);
  const [statuses, setStatuses] =
    useState<Record<SupplierId, SupplierFetchState>>(initialStatuses);
  const [isRunning, setIsRunning] = useState(false);

  const start = useCallback(async () => {
    if (isRunningRef.current) return;

    isRunningRef.current = true;
    setIsRunning(true);
    setStatuses(initialStatuses());

    for (const supplier of suppliers) {
      setStatuses((prev) => ({
        ...prev,
        [supplier.id]: { status: 'pending' },
      }));

      try {
        // @ts-ignore
        await window.electron.mail.fetchNewInvoicesBySupplier(supplier.id);
        setStatuses((prev) => ({
          ...prev,
          [supplier.id]: { status: 'success' },
        }));
      } catch (error) {
        setStatuses((prev) => ({
          ...prev,
          [supplier.id]: {
            status: 'error',
            errorMessage:
              error instanceof Error ? error.message : String(error),
          },
        }));
      }
    }

    await queryClient.invalidateQueries({
      queryKey: [DOCUMENTS_QUERY_KEY],
    });

    isRunningRef.current = false;
    setIsRunning(false);
  }, [queryClient]);

  const reset = useCallback(() => {
    setStatuses(initialStatuses());
  }, []);

  return { statuses, isRunning, start, reset, suppliers };
};
