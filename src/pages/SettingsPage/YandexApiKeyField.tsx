import { useState } from 'react';
import { Button, Form, Input, Space, Typography, message } from 'antd';
import { useHasYandexApiKey } from '../../modules/config/hooks/useHasYandexApiKey';
import { useSetYandexApiKey } from '../../modules/config/hooks/useSetYandexApiKey';

export function YandexApiKeyField() {
  const [apiKey, setApiKeyValue] = useState('');
  const { data: hasYandexApiKey = false, isLoading } = useHasYandexApiKey();
  const { mutate: setYandexApiKey, isPending: isSaving } = useSetYandexApiKey();

  const handleSave = () => {
    if (!apiKey.trim()) {
      message.warning('Введите API-ключ Yandex Cloud');
      return;
    }
    setYandexApiKey(apiKey.trim(), {
      onSuccess: () => {
        setApiKeyValue('');
        message.success('API-ключ Yandex Cloud сохранён');
      },
      onError: () => {
        message.error('Не удалось сохранить API-ключ Yandex Cloud');
      },
    });
  };

  return (
    <Form.Item
      label="API-ключ Yandex Cloud"
      extra={
        isLoading ? (
          <Typography.Text type="secondary">Загрузка...</Typography.Text>
        ) : hasYandexApiKey ? (
          <Typography.Text type="success">
            API-ключ сохранён в защищённом хранилище
          </Typography.Text>
        ) : (
          <Typography.Text type="secondary">
            API-ключ ещё не задан
          </Typography.Text>
        )
      }
    >
      <Space.Compact style={{ width: '100%' }}>
        <Input.Password
          placeholder={
            hasYandexApiKey ? 'Введите новый API-ключ' : 'Введите API-ключ'
          }
          value={apiKey}
          disabled={isLoading}
          onChange={(e) => setApiKeyValue(e.target.value)}
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
