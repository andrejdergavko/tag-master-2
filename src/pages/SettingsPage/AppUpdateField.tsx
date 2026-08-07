import { useEffect, useState } from 'react';
import { Button, Form, Space, Typography, message } from 'antd';
import type { UpdateStatus } from '../../services/update/updateService';

export function AppUpdateField() {
  const [version, setVersion] = useState<string>('');
  const [status, setStatus] = useState<UpdateStatus>({ type: 'idle' });

  useEffect(() => {
    void window.electron.update.getVersion().then(setVersion);
    void window.electron.update.getStatus().then(setStatus);
    return window.electron.update.onStatus(setStatus);
  }, []);

  useEffect(() => {
    if (status.type === 'not-available') {
      message.info('Установлена актуальная версия');
    }
    if (status.type === 'downloaded') {
      message.success('Обновление скачано. Можно перезапустить приложение');
    }
    if (status.type === 'error') {
      message.error(status.message);
    }
  }, [status]);

  const isChecking = status.type === 'checking' || status.type === 'available';
  const canInstall = status.type === 'downloaded';

  return (
    <Form.Item
      label="Обновление"
      extra={
        <Typography.Text type="secondary">
          Текущая версия: {version || '…'}
        </Typography.Text>
      }
    >
      <Space>
        <Button
          type="primary"
          loading={isChecking}
          disabled={canInstall}
          onClick={() => {
            void window.electron.update.check();
          }}
        >
          Проверить обновления
        </Button>
        {canInstall ? (
          <Button
            type="default"
            onClick={() => {
              void window.electron.update.quitAndInstall();
            }}
          >
            Перезапустить и обновить
          </Button>
        ) : null}
      </Space>
    </Form.Item>
  );
}
