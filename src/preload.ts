// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron';
import { DocumentDTO, SupplierId } from './shared/types';

const electronHandler = {
  mail: {
    fetchNewInvoicesBySupplier(supplierId: SupplierId): Promise<DocumentDTO[]> {
      return ipcRenderer.invoke(
        'mail:fetch-new-invoices-by-supplier',
        supplierId,
      );
    },
    getSupplierDocuments(supplierEmail: string): Promise<DocumentDTO[]> {
      console.log('getSupplierDocuments', supplierEmail);
      return ipcRenderer.invoke('mail:get-supplier-documents', supplierEmail);
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
