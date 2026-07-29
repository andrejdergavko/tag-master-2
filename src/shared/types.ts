export type IInvoice = {
  number: string;
  date: string;
  total: number;
  items: IInvoiceItem[];
};

export type IInvoiceItem = {
  name: string;
  quantity: number;
  price: number;
  total: number;
};
