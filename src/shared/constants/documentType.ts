import { DocumentType } from '../types';

export const DOCUMENT_TYPE_CONFIG: Record<
  DocumentType,
  { label: string; color: string }
> = {
  [DocumentType.TN]: { label: 'ТН', color: 'blue' },
  [DocumentType.TTN]: { label: 'ТТН', color: 'green' },
  [DocumentType.OTHER]: { label: 'Другое', color: 'default' },
};
