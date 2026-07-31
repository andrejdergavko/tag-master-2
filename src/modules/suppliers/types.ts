import { MessageStructureObject } from 'imapflow/lib/imap-flow';
import { DocumentType, IDocument } from '../../shared/types';

export interface IMask {
  type: DocumentType;
  description: string;
  isMatch: (attachment: MessageStructureObject) => boolean;
  extractData: (buffer: Buffer) => IDocument;
}
