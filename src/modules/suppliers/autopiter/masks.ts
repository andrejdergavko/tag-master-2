import { MessageStructureObject } from 'imapflow/lib/imap-flow';
import { IMask } from '../types';

const masks: IMask[] = [
  {
    isMatch: (attachment: MessageStructureObject) =>
      !!attachment.parameters?.name?.includes('ТН-2 Реализация'),
    // @ts-ignore
    extractData: (attachment: MessageStructureObject) => {
      return null;
    },
  },
];

export default masks;
