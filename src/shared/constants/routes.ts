export enum Pages {
  documents = 'documents',
}

export enum Routes {
  root = '/',
  documents = '/documents',
}

export const pageNames: { [key in Pages]: string } = {
  [Pages.documents]: 'Документы',
};
