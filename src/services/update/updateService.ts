import { app, autoUpdater, BrowserWindow } from 'electron';

export type UpdateStatus =
  | { type: 'idle' }
  | { type: 'checking' }
  | { type: 'available' }
  | { type: 'not-available' }
  | { type: 'downloaded' }
  | { type: 'error'; message: string };

const REPO = 'andrejdergavko/tag-master-2';

let currentStatus: UpdateStatus = { type: 'idle' };
let listenersAttached = false;

const broadcastStatus = (status: UpdateStatus) => {
  currentStatus = status;
  for (const window of BrowserWindow.getAllWindows()) {
    window.webContents.send('update:status', status);
  }
};

export const getAppVersion = (): string => app.getVersion();

export const getUpdateStatus = (): UpdateStatus => currentStatus;

export const initAutoUpdater = (): void => {
  if (!app.isPackaged || process.platform !== 'win32' || listenersAttached) {
    return;
  }

  listenersAttached = true;

  const feedUrl = `https://update.electronjs.org/${REPO}/${process.platform}-${process.arch}/${app.getVersion()}`;
  autoUpdater.setFeedURL({ url: feedUrl });

  autoUpdater.on('checking-for-update', () => {
    broadcastStatus({ type: 'checking' });
  });
  autoUpdater.on('update-available', () => {
    broadcastStatus({ type: 'available' });
  });
  autoUpdater.on('update-not-available', () => {
    broadcastStatus({ type: 'not-available' });
  });
  autoUpdater.on('update-downloaded', () => {
    broadcastStatus({ type: 'downloaded' });
  });
  autoUpdater.on('error', (error) => {
    broadcastStatus({ type: 'error', message: error.message });
  });
};

export const checkForUpdates = (): void => {
  if (!app.isPackaged) {
    broadcastStatus({
      type: 'error',
      message: 'Обновления работают только в установленном приложении',
    });
    return;
  }

  if (process.platform !== 'win32') {
    broadcastStatus({
      type: 'error',
      message: 'Автообновление пока настроено только для Windows',
    });
    return;
  }

  autoUpdater.checkForUpdates();
};

export const quitAndInstall = (): void => {
  autoUpdater.quitAndInstall();
};
