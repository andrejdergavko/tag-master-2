import { ImapFlow } from 'imapflow';

export function createImapClient() {
  return new ImapFlow({
    host: process.env.HOST || '',
    port: Number(process.env.PORT) || 993,
    secure: true,
    auth: {
      user: process.env.EMAIL || '',
      pass: process.env.PASSWORD || '',
    },
  });
}
