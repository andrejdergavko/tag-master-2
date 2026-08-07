import { ImapFlow } from 'imapflow';
import { getImapPassword } from '../config/configService';

export function createImapClient(): ImapFlow {
  return new ImapFlow({
    host: process.env.HOST || '',
    port: Number(process.env.PORT) || 993,
    secure: true,
    auth: {
      user: process.env.EMAIL || '',
      pass: getImapPassword() || '',
    },
    logger: false,
  });
}
