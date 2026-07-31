import { MessageStructureObject } from 'imapflow/lib/imap-flow';

export enum DocumentType {
  TN = 'tn',
  TTN = 'ttn',
  OTHER = 'other',
}

export type IDocument = {
  type: DocumentType;
  supplierId: SupplierId;
  number?: string;
  date?: Date;
  totalSumWithVat: number;
  items: IDocumentItem[];
  source?: string;
};

export type IDocumentItem = {
  sku?: string;
  name: string;
  units: string;
  quantity: number;
  sumWithVat: number;
  description: string;
};

export type ISupplier = {
  id: SupplierId;
  name: string;
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
  extractData: (buffer: Buffer) => IDocument;
};
