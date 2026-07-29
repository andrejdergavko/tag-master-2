// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron';

export type MailInboxPreview = {
  latestMessage: string | null;
  subjects: string[];
};

const electronHandler = {
  mail: {
    fetchNewInvoicesBySupplier(): Promise<MailInboxPreview> {
      return ipcRenderer.invoke('mail:fetch-new-invoices-by-supplier');
    },
    getSupplierInvoices(): Promise<MailInboxPreview> {
      return ipcRenderer.invoke('mail:get-supplier-invoices');
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
