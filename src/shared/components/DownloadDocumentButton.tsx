import { DownloadOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import { useDownloadDocument } from '../../modules/documents/hooks/useDownloadDocument';
import { SupplierId } from '../types';

type DownloadDocumentButtonProps = {
  supplierId: SupplierId;
  documentId: string;
};

export default function DownloadDocumentButton({
  supplierId,
  documentId,
}: DownloadDocumentButtonProps) {
  const { mutate, isPending } = useDownloadDocument(supplierId, documentId);

  const handleClick = () => {
    mutate(undefined, {
      onError: (error) => {
        message.error(
          error instanceof Error
            ? error.message
            : 'Не удалось скачать документ',
        );
      },
    });
  };

  return (
    <Button
      icon={<DownloadOutlined />}
      loading={isPending}
      onClick={handleClick}
    >
      Скачать документ
    </Button>
  );
}
