export enum Pages {
  documents = 'documents',
  settings = 'settings',
}

export enum Routes {
  root = '/',
  documents = '/documents',
  settings = '/settings',
}

export const pageNames: { [key in Pages]: string } = {
  [Pages.documents]: 'Документы',
  [Pages.settings]: 'Настройки',
};
