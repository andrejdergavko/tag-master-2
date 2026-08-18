import { useState } from 'react';
import { Button, Form, Input, Space, Typography, message } from 'antd';
import { useHasYandexFolderId } from '../../modules/config/hooks/useHasYandexFolderId';
import { useSetYandexFolderId } from '../../modules/config/hooks/useSetYandexFolderId';

export function YandexFolderIdField() {
  const [folderId, setFolderIdValue] = useState('');
  const { data: hasYandexFolderId = false, isLoading } = useHasYandexFolderId();
  const { mutate: setYandexFolderId, isPending: isSaving } =
    useSetYandexFolderId();

  const handleSave = () => {
    if (!folderId.trim()) {
      message.warning('Введите ID каталога Yandex Cloud');
      return;
    }
    setYandexFolderId(folderId.trim(), {
      onSuccess: () => {
        setFolderIdValue('');
        message.success('ID каталога Yandex Cloud сохранён');
      },
      onError: () => {
        message.error('Не удалось сохранить ID каталога Yandex Cloud');
      },
    });
  };

  return (
    <Form.Item
      label="ID каталога Yandex Cloud"
      extra={
        isLoading ? (
          <Typography.Text type="secondary">Загрузка...</Typography.Text>
        ) : hasYandexFolderId ? (
          <Typography.Text type="success">
            ID каталога сохранён в защищённом хранилище
          </Typography.Text>
        ) : (
          <Typography.Text type="secondary">
            ID каталога ещё не задан
          </Typography.Text>
        )
      }
    >
      <Space.Compact style={{ width: '100%' }}>
        <Input
          placeholder={
            hasYandexFolderId
              ? 'Введите новый ID каталога'
              : 'Введите ID каталога'
          }
          value={folderId}
          disabled={isLoading}
          onChange={(e) => setFolderIdValue(e.target.value)}
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
