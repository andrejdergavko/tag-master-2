import { Form, Select, Typography } from 'antd';
import {
  DEFAULT_TAG_TYPE,
  TAG_TYPE_LABELS,
  TagType,
} from '../../services/printer/constants';
import { useGetTagType } from '../../modules/printer/hooks/useGetTagType';
import { useSetTagType } from '../../modules/printer/hooks/useSetTagType';

export function TagTypeField() {
  const { data: tagType = DEFAULT_TAG_TYPE, isLoading } = useGetTagType();
  const { mutate: setTagType, isPending: isSaving } = useSetTagType();

  return (
    <Form.Item
      label="Формат этикетки"
      extra={
        isLoading ? (
          <Typography.Text type="secondary">Загрузка...</Typography.Text>
        ) : (
          <Typography.Text type="success">
            Выбран формат {TAG_TYPE_LABELS[tagType]}
          </Typography.Text>
        )
      }
    >
      <Select
        placeholder="Выберите формат этикетки"
        style={{ width: '100%' }}
        value={tagType}
        disabled={isLoading}
        loading={isSaving}
        options={Object.values(TagType).map((value) => ({
          value,
          label: TAG_TYPE_LABELS[value],
        }))}
        onChange={(value) => setTagType(value)}
      />
    </Form.Item>
  );
}
