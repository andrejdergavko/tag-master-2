import { PrinterOutlined } from '@ant-design/icons';
import { Button, Spin, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate, useParams } from 'react-router-dom';
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
  {
    title: 'Действия',
    key: 'actions',
    render: (_, record) => (
      <Button
        type="text"
        icon={<PrinterOutlined />}
        onClick={() => console.log('print', record)}
      />
    ),
  },
];

export default function DocumentPage() {
  const navigate = useNavigate();
  const { supplierId, documentId } = useParams<{
    supplierId: string;
    documentId: string;
  }>();

  const { data: document, isLoading } = useGetDocument(
    supplierId as SupplierId,
    documentId as string,
  );

  const backButton = (
    <Button
      type="link"
      onClick={() => navigate(-1)}
      style={{ paddingInline: 0, marginBottom: 16 }}
    >
      Назад
    </Button>
  );

  if (isLoading) {
    return (
      <div>
        {backButton}
        <Spin />
      </div>
    );
  }

  if (!document) {
    return (
      <div>
        {backButton}
        <div>Документ не найден</div>
      </div>
    );
  }

  return (
    <div>
      {backButton}
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
