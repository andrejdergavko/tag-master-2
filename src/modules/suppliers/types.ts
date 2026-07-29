import { MessageStructureObject } from 'imapflow/lib/imap-flow';
import { IInvoice } from '../../shared/types';

export interface IMask {
  isMatch: (attachment: MessageStructureObject) => boolean;
  extractData: (attachment: MessageStructureObject) => IInvoice;
}
