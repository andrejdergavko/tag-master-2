import { ipcMain } from 'electron';
import { fetchInboxPreview } from './mail/mailService';

export function setIpcHandlers() {
  ipcMain.handle('mail:fetch-inbox-preview', async () => {
    return fetchInboxPreview();
  });
}
