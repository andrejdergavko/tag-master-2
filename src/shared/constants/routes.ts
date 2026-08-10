export enum Pages {
  documents = 'documents',
  products = 'products',
  settings = 'settings',
}

export enum Routes {
  root = '/',
  documents = '/documents',
  products = '/products',
  settings = '/settings',
}

export const pageNames: { [key in Pages]: string } = {
  [Pages.documents]: 'Документы',
  [Pages.products]: 'Товары',
  [Pages.settings]: 'Настройки',
};
