import { ImapFlow } from 'imapflow';
import { getRequiredEnv, getRequiredNumberEnv } from '../../env';

export function createImapClient() {
  // return new ImapFlow({
  //   host: getRequiredEnv('HOST') || '',
  //   port: getRequiredNumberEnv('PORT') || 0,
  //   secure: true,
  //   auth: {
  //     user: getRequiredEnv('EMAIL') || '',
  //     pass: getRequiredEnv('PASSWORD') || '',
  //   },
  // });

  return new ImapFlow({
    host: 'imap.mail.ru' || '',
    port: 993 || 0,
    secure: true,
    auth: {
      user: 'andrej94@list.ru' || '',
      pass: 'HNxPeNX3en6QXjfYxp6A' || '',
    },
  });
}
