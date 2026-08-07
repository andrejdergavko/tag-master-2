import { useState } from 'react';
import { Button, Form, Input, Space, Typography, message } from 'antd';
import { useHasDatabaseUrl } from '../../modules/config/hooks/useHasDatabaseUrl';
import { useSetDatabaseUrl } from '../../modules/config/hooks/useSetDatabaseUrl';

export function DatabaseUrlField() {
  const [databaseUrl, setDatabaseUrlValue] = useState('');
  const { data: hasDatabaseUrl = false, isLoading } = useHasDatabaseUrl();
  const { mutate: setDatabaseUrl, isPending: isSaving } = useSetDatabaseUrl();

  const handleSave = () => {
    if (!databaseUrl.trim()) {
      message.warning('Введите Database URL');
      return;
    }
    setDatabaseUrl(databaseUrl.trim(), {
      onSuccess: () => {
        setDatabaseUrlValue('');
        message.success('Database URL сохранён');
      },
      onError: () => {
        message.error('Не удалось сохранить Database URL');
      },
    });
  };

  return (
    <Form.Item
      label="Database URL"
      extra={
        isLoading ? (
          <Typography.Text type="secondary">Загрузка...</Typography.Text>
        ) : hasDatabaseUrl ? (
          <Typography.Text type="success">
            Database URL сохранён в защищённом хранилище
          </Typography.Text>
        ) : (
          <Typography.Text type="secondary">
            Database URL ещё не задан
          </Typography.Text>
        )
      }
    >
      <Space.Compact style={{ width: '100%' }}>
        <Input.Password
          placeholder={
            hasDatabaseUrl ? 'Введите новый Database URL' : 'postgresql://...'
          }
          value={databaseUrl}
          disabled={isLoading}
          onChange={(e) => setDatabaseUrlValue(e.target.value)}
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
