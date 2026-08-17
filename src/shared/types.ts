import { MessageStructureObject } from 'imapflow/lib/imap-flow';

export enum DocumentType {
  TN = 'tn',
  TTN = 'ttn',
  OTHER = 'other',
}

export type DocumentDTO = {
  id?: string;
  type: DocumentType;
  supplierId: SupplierId;
  number?: string | null;
  date?: Date | null;
  totalSumWithVat: number;
  items: DocumentItemDTO[];
  source?: string;
};

export type DocumentItemDTO = {
  id?: number;
  sku?: string;
  name: string;
  units: string;
  quantity: number;
  sumWithVat: number;
  description: string;
  printedAt?: Date | null;
};

export type GetDocumentItemsParams = {
  search?: string;
  supplierIds?: SupplierId[];
  dateFrom?: string | null;
  dateTo?: string | null;
  page: number;
  pageSize: number;
};

export type DocumentItemRowDTO = {
  id: number;
  sku?: string;
  name: string;
  units: string;
  quantity: number;
  sumWithVat: number;
  printedAt?: string | null;
  documentId: string;
  documentNumber?: string | null;
  documentDate?: string | null;
  supplierId: SupplierId;
  supplierName: string;
};

export type GetDocumentItemsResult = {
  items: DocumentItemRowDTO[];
  total: number;
};

export type SupplierDTO = {
  id: SupplierId;
  name: string;
  code: string;
  emails: string[];
  masks: IMask[];
  icon: {
    src: string;
    style?: React.CSSProperties;
  };
};

export enum SupplierId {
  AMAZIS = 'amazis',
  SHATE_M = 'shate-m',
  MOTEX = 'motex',
  ALMIK = 'almik',
  AUTOPITER = 'autopiter',
  ARKLOW = 'arklow',
  FORSAGE = 'forsage',
  MONLIBON = 'monlibon',
  DIAS = 'dias',
  ARMTEK = 'armtek',
}

export type IMask = {
  type: DocumentType;
  description: string;
  isMatch: (attachment: MessageStructureObject) => boolean;
  extractData: (buffer: Buffer, attachmentName?: string) => DocumentDTO;
};
