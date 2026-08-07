import { useState } from 'react';
import { Button, Form, Input, Select, Space, Spin, Typography, message } from 'antd';
import { useGetPrinterList } from '../modules/printer/hooks/useGetPrinterList';
import { useGetDefaultPrinter } from '../modules/printer/hooks/useGetDefaultPrinter';
import { useSetDefaultPrinter } from '../modules/printer/hooks/useSetDefaultPrinter';
import { useHasImapPassword } from '../modules/config/hooks/useHasImapPassword';
import { useSetImapPassword } from '../modules/config/hooks/useSetImapPassword';

export default function SettingsPage() {
  const [imapPassword, setImapPasswordValue] = useState('');
  const { data: printers = [], isLoading: isPrintersLoading } =
    useGetPrinterList();
  const { data: defaultPrinter = null, isLoading: isDefaultPrinterLoading } =
    useGetDefaultPrinter();
  const { mutate: setDefaultPrinter } = useSetDefaultPrinter();
  const { data: hasImapPassword = false, isLoading: isImapPasswordLoading } =
    useHasImapPassword();
  const { mutate: setImapPassword, isPending: isSavingImapPassword } =
    useSetImapPassword();

  if (isPrintersLoading || isDefaultPrinterLoading || isImapPasswordLoading) {
    return <Spin />;
  }

  const handleSaveImapPassword = () => {
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
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Form layout="inline">
        <Form.Item label="Принтер по умолчанию">
          <Select
            placeholder="Выберите принтер"
            style={{ minWidth: 280, marginLeft: 10 }}
            value={defaultPrinter}
            options={printers.map((printer) => ({
              value: printer.name,
              label: printer.name,
            }))}
            onChange={(value) => setDefaultPrinter(value ?? null)}
          />
        </Form.Item>
      </Form>

      <Form layout="vertical" style={{ maxWidth: 400 }}>
        <Form.Item
          label="Пароль IMAP"
          extra={
            hasImapPassword ? (
              <Typography.Text type="success">
                Пароль сохранён в защищённом хранилище
              </Typography.Text>
            ) : (
              <Typography.Text type="secondary">
                Пароль ещё не задан
              </Typography.Text>
            )
          }
        >
          <Space.Compact style={{ width: '100%' }}>
            <Input.Password
              placeholder={
                hasImapPassword ? 'Введите новый пароль' : 'Введите пароль IMAP'
              }
              value={imapPassword}
              onChange={(e) => setImapPasswordValue(e.target.value)}
              onPressEnter={handleSaveImapPassword}
            />
            <Button
              type="primary"
              loading={isSavingImapPassword}
              onClick={handleSaveImapPassword}
            >
              Сохранить
            </Button>
          </Space.Compact>
        </Form.Item>
      </Form>
    </Space>
  );
}
