import { Button } from 'antd';
import { useParams } from 'react-router-dom';
import { DocumentDTO, SupplierId } from '../shared/types';

export default function DocumentsPage() {
  const { supplierId } = useParams<{ supplierId: string }>();

  const handleLoadDocuments = async () => {
    try {
      const result: DocumentDTO[] =
        // @ts-ignore
        await window.electron.mail.getSupplierDocuments(
          supplierId as SupplierId,
        );

      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFetchNewInvoicesBySupplier = async () => {
    try {
      const result: DocumentDTO[] =
        // @ts-ignore
        await window.electron.mail.fetchNewInvoicesBySupplier(
          supplierId as SupplierId,
        );
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Button type="primary" onClick={handleLoadDocuments}>
        Load Documents
      </Button>
      <Button type="primary" onClick={handleFetchNewInvoicesBySupplier}>
        fetch documents
      </Button>
    </div>
  );
}
