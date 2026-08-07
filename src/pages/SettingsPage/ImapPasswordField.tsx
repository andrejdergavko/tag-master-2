import { useState } from 'react';
import { Button, Form, Input, Space, Typography, message } from 'antd';
import { useHasImapPassword } from '../../modules/config/hooks/useHasImapPassword';
import { useSetImapPassword } from '../../modules/config/hooks/useSetImapPassword';

export function ImapPasswordField() {
  const [imapPassword, setImapPasswordValue] = useState('');
  const { data: hasImapPassword = false, isLoading } = useHasImapPassword();
  const { mutate: setImapPassword, isPending: isSaving } = useSetImapPassword();

  const handleSave = () => {
    if (!imapPassword.trim()) {
      message.warning('Введите пароль');
      return;
    }
    setImapPassword(imapPassword, {
      onSuccess: () => {
        setImapPasswordValue('');
        message.success('Пароль IMAP сохранён');
      },
      onError: () => {
        message.error('Не удалось сохранить пароль');
      },
    });
  };

  return (
    <Form.Item
      label="Пароль IMAP"
      extra={
        isLoading ? (
          <Typography.Text type="secondary">Загрузка...</Typography.Text>
        ) : hasImapPassword ? (
          <Typography.Text type="success">
            Пароль сохранён в защищённом хранилище
          </Typography.Text>
        ) : (
          <Typography.Text type="secondary">Пароль ещё не задан</Typography.Text>
        )
      }
    >
      <Space.Compact style={{ width: '100%' }}>
        <Input.Password
          placeholder={
            hasImapPassword ? 'Введите новый пароль' : 'Введите пароль IMAP'
          }
          value={imapPassword}
          disabled={isLoading}
          onChange={(e) => setImapPasswordValue(e.target.value)}
          onPressEnter={handleSave}
        />
        <Button
          type="primary"
          loading={isSaving}
          disabled={isLoading}
          onClick={handleSave}
        >
          Сохранить
        </Button>
      </Space.Compact>
    </Form.Item>
  );
}
