import { Spin, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { isToday } from 'date-fns/isToday';
import { useNavigate, useParams } from 'react-router-dom';
import { DocumentDTO, DocumentType, SupplierId } from '../shared/types';
import { useGetDocuments } from '../modules/documents/hooks/useGetDocuments';
import { Routes } from '../shared/constants/routes';
import DocumentTypeTag from '../shared/components/DocumentTypeTag';
import UpdateAllButton from '../shared/components/UpdateAllButton';
import { formatDate } from '../shared/utils/date';
import suppliers from '../modules/suppliers';

const columns: ColumnsType<DocumentDTO> = [
  {
    title: 'Дата',
    dataIndex: 'date',
    key: 'date',
    minWidth: 150,
    render: (date?: Date) => {
      if (!date) return '—';

      return (
        <span>
          {formatDate(date)}
          {isToday(new Date(date)) && (
            <Tag bordered={false} color="cyan" style={{ marginLeft: 8 }}>
              сегодня
            </Tag>
          )}
        </span>
      );
    },
  },
  {
    title: 'Поставщик',
    dataIndex: 'supplierId',
    key: 'supplierId',
    minWidth: 100,
    render: (id: SupplierId) =>
      suppliers.find((supplier) => supplier.id === id)?.name ?? id,
  },
  {
    title: 'Тип документа',
    dataIndex: 'type',
    key: 'type',
    minWidth: 100,
    render: (type: DocumentType) => <DocumentTypeTag type={type} />,
  },
  {
    title: 'Номер документа',
    dataIndex: 'number',
    key: 'number',
    minWidth: 100,
  },
  {
    title: 'Сумма с НДС',
    dataIndex: 'totalSumWithVat',
    key: 'totalSumWithVat',
    minWidth: 100,
    render: (totalSumWithVat: number) => totalSumWithVat.toFixed(2),
  },
];

export default function DocumentsPage() {
  const navigate = useNavigate();
  const { supplierId } = useParams<{ supplierId?: string }>();

  const { data: documents, isLoading } = useGetDocuments(
    supplierId as SupplierId | undefined,
  );

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Spin />
      </div>
    );
  }

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginBottom: 16,
        }}
      >
        <UpdateAllButton />
      </div>

      <div style={{ height: '100%', overflow: 'auto' }}>
        <Table
          rowKey={(record) => record.id ?? `${record.type}-${record.number}`}
          columns={columns}
          size="small"
          dataSource={documents}
          pagination={false}
          onRow={(record) => ({
            onClick: () => {
              if (!record.id) return;
              navigate(`${Routes.documents}/${record.supplierId}/${record.id}`);
            },
            style: { cursor: record.id ? 'pointer' : undefined },
          })}
        />
      </div>
    </div>
  );
}
