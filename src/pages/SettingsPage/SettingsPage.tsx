import { Form } from 'antd';
import { DefaultPrinterField } from './DefaultPrinterField';
import { EmailField } from './EmailField';
import { ImapPasswordField } from './ImapPasswordField';
import { DatabaseUrlField } from './DatabaseUrlField';
import { AppUpdateField } from './AppUpdateField';

export default function SettingsPage() {
  return (
    <Form layout="vertical" style={{ maxWidth: 480 }}>
      <DefaultPrinterField />
      <EmailField />
      <ImapPasswordField />
      <DatabaseUrlField />
      <AppUpdateField />
    </Form>
  );
}
