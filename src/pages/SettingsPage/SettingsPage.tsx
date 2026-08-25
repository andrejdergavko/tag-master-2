import { Form } from 'antd';
import { DefaultPrinterField } from './DefaultPrinterField';
import { TagTypeField } from './TagTypeField';
import { EmailField } from './EmailField';
import { ImapPasswordField } from './ImapPasswordField';
import { DatabaseUrlField } from './DatabaseUrlField';
import { YandexFolderIdField } from './YandexFolderIdField';
import { YandexApiKeyField } from './YandexApiKeyField';
import { AppUpdateField } from './AppUpdateField';

export default function SettingsPage() {
  return (
    <Form layout="vertical" style={{ maxWidth: 480 }}>
      <DefaultPrinterField />
      <TagTypeField />
      <EmailField />
      <ImapPasswordField />
      <DatabaseUrlField />
      <YandexFolderIdField />
      <YandexApiKeyField />
      <AppUpdateField />
    </Form>
  );
}
