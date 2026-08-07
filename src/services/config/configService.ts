import Store from 'electron-store';

export type AppConfig = {
  defaultPrinter: string | null;
};

const store = new Store<AppConfig>({
  name: 'config',
  defaults: {
    defaultPrinter: null,
  },
});

export const getDefaultPrinter = (): string | null => {
  return store.get('defaultPrinter');
};

export const setDefaultPrinter = (printerName: string | null): void => {
  store.set('defaultPrinter', printerName);
};
