import { PrinterOutlined } from '@ant-design/icons';
import { Button, Spin, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate, useParams } from 'react-router-dom';
import { DocumentItemDTO, SupplierId } from '../shared/types';
import { useGetDocument } from '../modules/documents/hooks/useGetDocument';
import { Routes } from '../shared/constants/routes';
import BackButton from '../shared/components/BackButton';

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

  if (isLoading) {
    return (
      <div>
        <BackButton />
        <Spin />
      </div>
    );
  }

  if (!document) {
    return (
      <div>
        <BackButton />
        <div>Документ не найден</div>
      </div>
    );
  }

  return (
    <div>
      <BackButton />

      <div style={{ marginBottom: 16 }}>
        <div>Тип: {document.type}</div>
        <div>Номер: {document.number ?? '—'}</div>
        <div>
          Дата:{' '}
          {document.date ? new Date(document.date).toLocaleDateString() : '—'}
        </div>
        <div>Сумма с НДС: {document.totalSumWithVat}</div>
      </div>
      <Button
        type="primary"
        icon={<PrinterOutlined />}
        style={{ marginBottom: 16 }}
        onClick={() =>
          navigate(
            `${Routes.documents}/${supplierId}/${documentId}/print-tags`,
          )
        }
      >
        Печать ценников
      </Button>
      <Table
        rowKey={(_, index) => String(index)}
        columns={itemColumns}
        dataSource={document.items}
        pagination={false}
      />
    </div>
  );
}
