import { Spin, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useParams } from 'react-router-dom';
import { DocumentItemDTO, SupplierId } from '../shared/types';
import { useGetDocument } from '../modules/documents/hooks/getDocument';

const itemColumns: ColumnsType<DocumentItemDTO> = [
  {
    title: 'Артикул',
    dataIndex: 'sku',
    key: 'sku',
  },
  {
    title: 'Наименование',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Ед.',
    dataIndex: 'units',
    key: 'units',
  },
  {
    title: 'Кол-во',
    dataIndex: 'quantity',
    key: 'quantity',
  },
  {
    title: 'Сумма с НДС',
    dataIndex: 'sumWithVat',
    key: 'sumWithVat',
  },
];

export default function DocumentPage() {
  const { supplierId, documentId } = useParams<{
    supplierId: string;
    documentId: string;
  }>();

  const { data: document, isLoading } = useGetDocument(
    supplierId as SupplierId,
    documentId as string,
  );

  if (isLoading) {
    return <Spin />;
  }

  if (!document) {
    return <div>Документ не найден</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <div>Тип: {document.type}</div>
        <div>Номер: {document.number ?? '—'}</div>
        <div>
          Дата:{' '}
          {document.date
            ? new Date(document.date).toLocaleDateString()
            : '—'}
        </div>
        <div>Сумма с НДС: {document.totalSumWithVat}</div>
      </div>
      <Table
        rowKey={(_, index) => String(index)}
        columns={itemColumns}
        dataSource={document.items}
        pagination={false}
      />
    </div>
  );
}
