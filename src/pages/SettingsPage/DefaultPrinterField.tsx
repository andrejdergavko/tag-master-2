import { Form, Select, Typography } from 'antd';
import { useGetPrinterList } from '../../modules/printer/hooks/useGetPrinterList';
import { useGetDefaultPrinter } from '../../modules/printer/hooks/useGetDefaultPrinter';
import { useSetDefaultPrinter } from '../../modules/printer/hooks/useSetDefaultPrinter';

export function DefaultPrinterField() {
  const { data: printers = [], isLoading: isPrintersLoading } =
    useGetPrinterList();
  const { data: defaultPrinter = null, isLoading: isDefaultPrinterLoading } =
    useGetDefaultPrinter();
  const { mutate: setDefaultPrinter, isPending: isSaving } =
    useSetDefaultPrinter();

  const isLoading = isPrintersLoading || isDefaultPrinterLoading;

  return (
    <Form.Item
      label="Принтер по умолчанию"
      extra={
        isLoading ? (
          <Typography.Text type="secondary">Загрузка...</Typography.Text>
        ) : defaultPrinter ? (
          <Typography.Text type="success">
            Принтер по умолчанию выбран
          </Typography.Text>
        ) : (
          <Typography.Text type="secondary">
            Принтер ещё не выбран
          </Typography.Text>
        )
      }
    >
      <Select
        placeholder="Выберите принтер"
        style={{ width: '100%' }}
        value={defaultPrinter}
        disabled={isLoading}
        loading={isSaving}
        options={printers.map((printer) => ({
          value: printer.name,
          label: printer.name,
        }))}
        onChange={(value) => setDefaultPrinter(value ?? null)}
        allowClear
      />
    </Form.Item>
  );
}
