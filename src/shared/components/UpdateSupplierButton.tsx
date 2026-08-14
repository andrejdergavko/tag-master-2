import { Button, message } from 'antd';
import { useFetchSupplierDocuments } from '../../modules/documents/hooks/useFetchSupplierDocuments';
import { SupplierId } from '../types';

type UpdateSupplierButtonProps = {
  supplierId: SupplierId;
};

export default function UpdateSupplierButton({
  supplierId,
}: UpdateSupplierButtonProps) {
  const { mutate, isPending } = useFetchSupplierDocuments(supplierId);

  const handleClick = () => {
    mutate(undefined, {
      onError: (error) => {
        message.error(
          error instanceof Error
            ? error.message
            : 'Не удалось обновить поставщика',
        );
      },
    });
  };

  return (
    <Button type="default" loading={isPending} onClick={handleClick}>
      Обновить
    </Button>
  );
}
