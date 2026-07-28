import { createImapClient } from './client';

export type MailInboxPreview = {
  latestMessage: string | null;
  subjects: string[];
};

export const fetchInboxPreview = async () => {
  const client = createImapClient();
  let lock: { release: () => void } | undefined;

  try {
    await client.connect();
    lock = await client.getMailboxLock('INBOX');

    if (client.mailbox === false) {
      throw new Error('Mailbox is not available after locking INBOX');
    }

    const message = await client.fetchOne('*', {
      // envelope: true,
      // flags: true,
      bodyStructure: true,
    });
    return message;
  } finally {
    lock?.release();

    try {
      await client.logout();
    } catch {
      // Ignore logout errors when the connection never completed.
    }
  }
};
