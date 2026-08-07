// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron';
import { DocumentDTO, SupplierId } from './shared/types';
import { TagType } from './services/printer/constants';
import { TagData } from './services/printer/types';
import { UpdateStatus } from './services/update/updateService';

const electronHandler = {
  mail: {
    fetchNewInvoicesBySupplier(supplierId: SupplierId): Promise<DocumentDTO[]> {
      return ipcRenderer.invoke(
        'mail:fetch-new-invoices-by-supplier',
        supplierId,
      );
    },
    getSupplierDocuments(supplierId: SupplierId): Promise<DocumentDTO[]> {
      return ipcRenderer.invoke('mail:get-supplier-documents', supplierId);
    },
    getDocument(
      supplierId: SupplierId,
      documentId: string,
    ): Promise<DocumentDTO | null> {
      return ipcRenderer.invoke('mail:get-document', supplierId, documentId);
    },
  },
  printer: {
    getPrinterList(): Promise<
      { deviceId: string; name: string; paperSizes: string[] }[]
    > {
      return ipcRenderer.invoke('printer:get-printer-list');
    },
    printTags<T extends TagType>(
      tagType: T,
      data: TagData<T>[],
      printerName?: string,
    ): Promise<void> {
      return ipcRenderer.invoke(
        'printer:print-tags',
        tagType,
        data,
        printerName,
      );
    },
  },
  config: {
    getDefaultPrinter(): Promise<string | null> {
      return ipcRenderer.invoke('config:get-default-printer');
    },
    setDefaultPrinter(printerName: string | null): Promise<void> {
      return ipcRenderer.invoke('config:set-default-printer', printerName);
    },
    hasImapPassword(): Promise<boolean> {
      return ipcRenderer.invoke('config:has-imap-password');
    },
    setImapPassword(password: string): Promise<void> {
      return ipcRenderer.invoke('config:set-imap-password', password);
    },
    hasEmail(): Promise<boolean> {
      return ipcRenderer.invoke('config:has-email');
    },
    setEmail(email: string): Promise<void> {
      return ipcRenderer.invoke('config:set-email', email);
    },
    hasDatabaseUrl(): Promise<boolean> {
      return ipcRenderer.invoke('config:has-database-url');
    },
    setDatabaseUrl(databaseUrl: string): Promise<void> {
      return ipcRenderer.invoke('config:set-database-url', databaseUrl);
    },
  },
  update: {
    getVersion(): Promise<string> {
      return ipcRenderer.invoke('update:get-version');
    },
    getStatus(): Promise<UpdateStatus> {
      return ipcRenderer.invoke('update:get-status');
    },
    check(): Promise<void> {
      return ipcRenderer.invoke('update:check');
    },
    quitAndInstall(): Promise<void> {
      return ipcRenderer.invoke('update:quit-and-install');
    },
    onStatus(callback: (status: UpdateStatus) => void): () => void {
      const listener = (
        _event: Electron.IpcRendererEvent,
        status: UpdateStatus,
      ) => {
        callback(status);
      };
      ipcRenderer.on('update:status', listener);
      return () => {
        ipcRenderer.removeListener('update:status', listener);
      };
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
