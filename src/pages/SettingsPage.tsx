import { Form, Select, Spin } from 'antd';
import { useGetPrinterList } from '../modules/printer/hooks/useGetPrinterList';
import { useGetDefaultPrinter } from '../modules/printer/hooks/useGetDefaultPrinter';
import { useSetDefaultPrinter } from '../modules/printer/hooks/useSetDefaultPrinter';

export default function SettingsPage() {
  const { data: printers = [], isLoading: isPrintersLoading } =
    useGetPrinterList();
  const { data: defaultPrinter = null, isLoading: isDefaultPrinterLoading } =
    useGetDefaultPrinter();
  const { mutate: setDefaultPrinter } = useSetDefaultPrinter();

  if (isPrintersLoading || isDefaultPrinterLoading) {
    return <Spin />;
  }

  return (
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
  );
}
