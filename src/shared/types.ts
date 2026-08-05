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
  number?: string;
  date?: Date;
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
};

export type SupplierDTO = {
  id: SupplierId;
  name: string;
  code: string;
  email: string;
  masks: IMask[];
};

export enum SupplierId {
  AUTOPITER = 'autopiter',
}

export type IMask = {
  type: DocumentType;
  description: string;
  isMatch: (attachment: MessageStructureObject) => boolean;
  extractData: (buffer: Buffer) => DocumentDTO;
};
