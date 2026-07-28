// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron';

export type MailInboxPreview = {
  latestMessage: string | null;
  subjects: string[];
};

const electronHandler = {
  mail: {
    fetchInboxPreview(): Promise<MailInboxPreview> {
      return ipcRenderer.invoke('mail:fetch-inbox-preview');
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
