import { Tag } from 'antd';
import { DocumentType } from '../types';
import { DOCUMENT_TYPE_CONFIG } from '../constants/documentType';

type DocumentTypeTagProps = {
  type: DocumentType;
};

export default function DocumentTypeTag({ type }: DocumentTypeTagProps) {
  const { label, color } = DOCUMENT_TYPE_CONFIG[type];

  return (
    <Tag bordered={false} color={color}>
      {label}
    </Tag>
  );
}
