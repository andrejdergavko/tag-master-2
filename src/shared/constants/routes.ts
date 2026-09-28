export enum Pages {
  documents = 'documents',
  products = 'products',
  customPrint = 'custom-print',
  settings = 'settings',
}

export enum Routes {
  root = '/',
  documents = '/documents',
  products = '/products',
  customPrint = '/custom-print',
  settings = '/settings',
}

export const pageNames: { [key in Pages]: string } = {
  [Pages.documents]: 'Документы',
  [Pages.products]: 'Товары',
  [Pages.customPrint]: 'Произвольная печать',
  [Pages.settings]: 'Настройки',
};
