import { Button } from 'antd';
import { DocumentDTO, SupplierId } from '../shared/types';

export default function InvoicesPage() {
  const handleLoadDocuments = async () => {
    try {
      const result: DocumentDTO[] =
        // @ts-ignore
        await window.electron.mail.getSupplierDocuments(SupplierId.AUTOPITER);

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
          SupplierId.AUTOPITER,
        );
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Button type="primary" onClick={handleLoadDocuments}>
        Load Autopiter Documents
      </Button>
      <Button type="primary" onClick={handleFetchNewInvoicesBySupplier}>
        fetch documents
      </Button>
    </div>
  );
}
