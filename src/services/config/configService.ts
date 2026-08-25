import { safeStorage } from 'electron';
import Store from 'electron-store';
import { DEFAULT_TAG_TYPE, TagType } from '../printer/constants';

type EncryptedKey =
  | 'imapPasswordEncrypted'
  | 'emailEncrypted'
  | 'databaseUrlEncrypted'
  | 'yandexFolderIdEncrypted'
  | 'yandexApiKeyEncrypted';

export type AppConfig = {
  defaultPrinter: string | null;
  tagType: TagType;
  imapPasswordEncrypted: string | null;
  emailEncrypted: string | null;
  databaseUrlEncrypted: string | null;
  yandexFolderIdEncrypted: string | null;
  yandexApiKeyEncrypted: string | null;
};

const store = new Store<AppConfig>({
  name: 'config',
  defaults: {
    defaultPrinter: null,
    tagType: DEFAULT_TAG_TYPE,
    imapPasswordEncrypted: null,
    emailEncrypted: null,
    databaseUrlEncrypted: null,
    yandexFolderIdEncrypted: null,
    yandexApiKeyEncrypted: null,
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

const isTagType = (value: unknown): value is TagType => {
  return Object.values(TagType).includes(value as TagType);
};

export const getTagType = (): TagType => {
  const value = store.get('tagType');
  return isTagType(value) ? value : DEFAULT_TAG_TYPE;
};

export const setTagType = (tagType: TagType): void => {
  store.set('tagType', tagType);
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

export const hasYandexFolderId = (): boolean =>
  hasEncrypted('yandexFolderIdEncrypted');
export const setYandexFolderId = (folderId: string): void =>
  setEncrypted('yandexFolderIdEncrypted', folderId);
export const getYandexFolderId = (): string | null =>
  getEncrypted('yandexFolderIdEncrypted');

export const hasYandexApiKey = (): boolean =>
  hasEncrypted('yandexApiKeyEncrypted');
export const setYandexApiKey = (apiKey: string): void =>
  setEncrypted('yandexApiKeyEncrypted', apiKey);
export const getYandexApiKey = (): string | null =>
  getEncrypted('yandexApiKeyEncrypted');
