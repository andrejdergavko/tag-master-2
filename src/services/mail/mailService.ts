import {
  MailboxLockObject,
  MessageStructureObject,
} from 'imapflow/lib/imap-flow';
import { createImapClient } from './client';
import { findAttachments } from './utils';

export type MailInboxPreview = {
  latestMessage: string | null;
  subjects: string[];
};

export type MailMessage = {
  uid: number;
  subject: string | null;
  from: string[];
  date: string | null;
  flags: string[];
};

export const fetchNewInvoicesBySupplier = async (supplierEmail: string) => {
  const lastInvoiceDate = new Date('2026-07-27T14:32:49.000Z');

  const client = createImapClient();

  let lock: MailboxLockObject | undefined;

  try {
    await client.connect();
    lock = await client.getMailboxLock('INBOX');

    console.log(supplierEmail);

    const messages = await client.fetchAll(
      {
        from: supplierEmail,
        since: lastInvoiceDate,
      },
      {
        envelope: true,
        uid: true,
        bodyStructure: true,
      },
    );

    const allAttachments: MessageStructureObject[] = [];

    for (const message of messages) {
      if (!message.bodyStructure) continue;

      const attachments = findAttachments(message.bodyStructure);
      allAttachments.push(...attachments);
    }

    return allAttachments;
  } finally {
    lock?.release();
    await client.logout().catch(() => undefined);
  }
};

// export const getSupplierInvoices = async (supplierEmail: string) => {
//   return null;
// };

const test = [
  {
    seq: 14192,
    uid: 34694,
    bodyStructure: {
      childNodes: [
        {
          part: '1',
          childNodes: [
            {
              part: '1.1',
              type: 'text/plain',
              parameters: {
                charset: 'utf-8',
              },
              encoding: 'base64',
              size: 922,
              lineCount: 0,
            },
            {
              part: '1.2',
              type: 'text/html',
              parameters: {
                charset: 'utf-8',
              },
              encoding: 'base64',
              size: 1662,
              lineCount: 0,
            },
          ],
          type: 'multipart/alternative',
        },
        {
          part: '2',
          type: 'application/pdf',
          parameters: {
            name: 'ТН-2 Реализация (вертикальная без приложения).pdf',
          },
          encoding: 'base64',
          size: 94912,
          disposition: 'attachment',
          dispositionParameters: {
            filename: 'ТН-2 Реализация (вертикальная без приложения).pdf',
          },
        },
        {
          part: '3',
          type: 'application/octet-stream',
          parameters: {
            name: 'Внешняя печатная форма для РМК (Автопитер)№УТ-РН109629   1290123 .ods',
          },
          encoding: 'base64',
          size: 8148,
          disposition: 'attachment',
          dispositionParameters: {
            filename:
              'Внешняя печатная форма для РМК (Автопитер)№УТ-РН109629   1290123 .ods',
          },
        },
        {
          part: '4',
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          parameters: {
            name: 'ТН-2 Реализация (вертикальная без приложения).xlsx',
          },
          encoding: 'base64',
          size: 15122,
          disposition: 'attachment',
          dispositionParameters: {
            filename: 'ТН-2 Реализация (вертикальная без приложения).xlsx',
          },
        },
        {
          part: '5',
          type: 'application/vnd.ms-excel',
          parameters: {
            name: 'ТН-2 Реализация (вертикальная без приложения).xls',
          },
          encoding: 'base64',
          size: 37544,
          disposition: 'attachment',
          dispositionParameters: {
            filename: 'ТН-2 Реализация (вертикальная без приложения).xls',
          },
        },
        {
          part: '6',
          type: 'application/octet-stream',
          parameters: {
            name: 'ТН-2 Реализация (вертикальная без приложения).ods',
          },
          encoding: 'base64',
          size: 15718,
          disposition: 'attachment',
          dispositionParameters: {
            filename: 'ТН-2 Реализация (вертикальная без приложения).ods',
          },
        },
        {
          part: '7',
          type: 'application/pdf',
          parameters: {
            name: 'Внешняя печатная форма для РМК (Автопитер)№УТ-РН109629   1290123 .pdf',
          },
          encoding: 'base64',
          size: 100008,
          disposition: 'attachment',
          dispositionParameters: {
            filename:
              'Внешняя печатная форма для РМК (Автопитер)№УТ-РН109629   1290123 .pdf',
          },
        },
        {
          part: '8',
          type: 'application/octet-stream',
          parameters: {
            name: 'ТН-2 Реализация (вертикальная без приложения).mxl',
          },
          encoding: 'base64',
          size: 47078,
          disposition: 'attachment',
          dispositionParameters: {
            filename: 'ТН-2 Реализация (вертикальная без приложения).mxl',
          },
        },
        {
          part: '9',
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          parameters: {
            name: 'Внешняя печатная форма для РМК (Автопитер)№УТ-РН109629   1290123 .xlsx',
          },
          encoding: 'base64',
          size: 8456,
          disposition: 'attachment',
          dispositionParameters: {
            filename:
              'Внешняя печатная форма для РМК (Автопитер)№УТ-РН109629   1290123 .xlsx',
          },
        },
        {
          part: '10',
          type: 'application/vnd.ms-excel',
          parameters: {
            name: 'Внешняя печатная форма для РМК (Автопитер)№УТ-РН109629   1290123 .xls',
          },
          encoding: 'base64',
          size: 13308,
          disposition: 'attachment',
          dispositionParameters: {
            filename:
              'Внешняя печатная форма для РМК (Автопитер)№УТ-РН109629   1290123 .xls',
          },
        },
        {
          part: '11',
          type: 'application/octet-stream',
          parameters: {
            name: 'Внешняя печатная форма для РМК (Автопитер)№УТ-РН109629   1290123 .mxl',
          },
          encoding: 'base64',
          size: 13440,
          disposition: 'attachment',
          dispositionParameters: {
            filename:
              'Внешняя печатная форма для РМК (Автопитер)№УТ-РН109629   1290123 .mxl',
          },
        },
        {
          part: '12',
          type: 'application/pdf',
          parameters: {
            name: 'ТТН-1 (вертикальная с приложением).pdf',
          },
          encoding: 'base64',
          size: 144176,
          disposition: 'attachment',
          dispositionParameters: {
            filename: 'ТТН-1 (вертикальная с приложением).pdf',
          },
        },
        {
          part: '13',
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          parameters: {
            name: 'ТТН-1 (вертикальная с приложением).xlsx',
          },
          encoding: 'base64',
          size: 26042,
          disposition: 'attachment',
          dispositionParameters: {
            filename: 'ТТН-1 (вертикальная с приложением).xlsx',
          },
        },
        {
          part: '14',
          type: 'application/vnd.ms-excel',
          parameters: {
            name: 'ТТН-1 (вертикальная с приложением).xls',
          },
          encoding: 'base64',
          size: 76366,
          disposition: 'attachment',
          dispositionParameters: {
            filename: 'ТТН-1 (вертикальная с приложением).xls',
          },
        },
        {
          part: '15',
          type: 'application/octet-stream',
          parameters: {
            name: 'ТТН-1 (вертикальная с приложением).ods',
          },
          encoding: 'base64',
          size: 31884,
          disposition: 'attachment',
          dispositionParameters: {
            filename: 'ТТН-1 (вертикальная с приложением).ods',
          },
        },
        {
          part: '16',
          type: 'application/octet-stream',
          parameters: {
            name: 'ТТН-1 (вертикальная с приложением).mxl',
          },
          encoding: 'base64',
          size: 92208,
          disposition: 'attachment',
          dispositionParameters: {
            filename: 'ТТН-1 (вертикальная с приложением).mxl',
          },
        },
      ],
      type: 'multipart/mixed',
    },
    envelope: {
      date: '2026-07-28T14:32:49.000Z',
      subject: 'Fwd: Документы',
      from: [
        {
          name: 'Роман Дергавко',
          address: 'dergavko@mail.ru',
        },
      ],
      replyTo: [
        {
          name: 'Роман Дергавко',
          address: 'dergavko@mail.ru',
        },
      ],
      to: [
        {
          name: '',
          address: 'andrej94@list.ru',
        },
      ],
      messageId: '<1785249166.853391625@f748.i.mail.ru>',
    },
    id: '2b4c3a8998ef6a0a5171a046aa0f1fc8',
  },
];
