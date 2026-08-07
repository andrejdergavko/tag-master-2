import { useState } from 'react';
import { Button, Form, Input, Space, Typography, message } from 'antd';
import { useHasEmail } from '../../modules/config/hooks/useHasEmail';
import { useSetEmail } from '../../modules/config/hooks/useSetEmail';

export function EmailField() {
  const [email, setEmailValue] = useState('');
  const { data: hasEmail = false, isLoading } = useHasEmail();
  const { mutate: setEmail, isPending: isSaving } = useSetEmail();

  const handleSave = () => {
    if (!email.trim()) {
      message.warning('Введите email');
      return;
    }
    setEmail(email.trim(), {
      onSuccess: () => {
        setEmailValue('');
        message.success('Email сохранён');
      },
      onError: () => {
        message.error('Не удалось сохранить email');
      },
    });
  };

  return (
    <Form.Item
      label="Email"
      extra={
        isLoading ? (
          <Typography.Text type="secondary">Загрузка...</Typography.Text>
        ) : hasEmail ? (
          <Typography.Text type="success">
            Email сохранён в защищённом хранилище
          </Typography.Text>
        ) : (
          <Typography.Text type="secondary">Email ещё не задан</Typography.Text>
        )
      }
    >
      <Space.Compact style={{ width: '100%' }}>
        <Input
          placeholder={hasEmail ? 'Введите новый email' : 'Введите email'}
          value={email}
          disabled={isLoading}
          onChange={(e) => setEmailValue(e.target.value)}
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
