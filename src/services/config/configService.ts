import { safeStorage } from 'electron';
import Store from 'electron-store';

export type AppConfig = {
  defaultPrinter: string | null;
  /** Base64 of safeStorage-encrypted IMAP password */
  imapPasswordEncrypted: string | null;
};

const store = new Store<AppConfig>({
  name: 'config',
  defaults: {
    defaultPrinter: null,
    imapPasswordEncrypted: null,
  },
});

export const getDefaultPrinter = (): string | null => {
  return store.get('defaultPrinter');
};

export const setDefaultPrinter = (printerName: string | null): void => {
  store.set('defaultPrinter', printerName);
};

export const hasImapPassword = (): boolean => {
  return Boolean(store.get('imapPasswordEncrypted'));
};

export const setImapPassword = (password: string): void => {
  if (!safeStorage.isEncryptionAvailable()) {
    throw new Error('Secure storage is not available on this system');
  }
  const encrypted = safeStorage.encryptString(password);
  store.set('imapPasswordEncrypted', encrypted.toString('base64'));
};

export const getImapPassword = (): string | null => {
  const encrypted = store.get('imapPasswordEncrypted');
  if (!encrypted) {
    return null;
  }
  if (!safeStorage.isEncryptionAvailable()) {
    return null;
  }
  try {
    return safeStorage.decryptString(Buffer.from(encrypted, 'base64'));
  } catch {
    return null;
  }
};
