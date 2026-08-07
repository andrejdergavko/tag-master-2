import { safeStorage } from 'electron';
import Store from 'electron-store';

type EncryptedKey =
  | 'imapPasswordEncrypted'
  | 'emailEncrypted'
  | 'databaseUrlEncrypted';

export type AppConfig = {
  defaultPrinter: string | null;
  imapPasswordEncrypted: string | null;
  emailEncrypted: string | null;
  databaseUrlEncrypted: string | null;
};

const store = new Store<AppConfig>({
  name: 'config',
  defaults: {
    defaultPrinter: null,
    imapPasswordEncrypted: null,
    emailEncrypted: null,
    databaseUrlEncrypted: null,
  },
});

const hasEncrypted = (key: EncryptedKey): boolean => {
  return Boolean(store.get(key));
};

const setEncrypted = (key: EncryptedKey, value: string): void => {
  if (!safeStorage.isEncryptionAvailable()) {
    throw new Error('Secure storage is not available on this system');
  }
  const encrypted = safeStorage.encryptString(value);
  store.set(key, encrypted.toString('base64'));
};

const getEncrypted = (key: EncryptedKey): string | null => {
  const encrypted = store.get(key);
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

export const getDefaultPrinter = (): string | null => {
  return store.get('defaultPrinter');
};

export const setDefaultPrinter = (printerName: string | null): void => {
  store.set('defaultPrinter', printerName);
};

export const hasImapPassword = (): boolean =>
  hasEncrypted('imapPasswordEncrypted');
export const setImapPassword = (password: string): void =>
  setEncrypted('imapPasswordEncrypted', password);
export const getImapPassword = (): string | null =>
  getEncrypted('imapPasswordEncrypted');

export const hasEmail = (): boolean => hasEncrypted('emailEncrypted');
export const setEmail = (email: string): void =>
  setEncrypted('emailEncrypted', email);
export const getEmail = (): string | null => getEncrypted('emailEncrypted');

export const hasDatabaseUrl = (): boolean =>
  hasEncrypted('databaseUrlEncrypted');
export const setDatabaseUrl = (databaseUrl: string): void =>
  setEncrypted('databaseUrlEncrypted', databaseUrl);
export const getDatabaseUrl = (): string | null =>
  getEncrypted('databaseUrlEncrypted');
