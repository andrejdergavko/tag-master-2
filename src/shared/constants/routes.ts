export enum Pages {
  invoices = 'invoices',
}

export enum Routes {
  invoices = '/',
}

export const pageNames: { [key in Pages]: string } = {
  [Pages.invoices]: 'Накладные',
};
