import { Spin, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate, useParams } from 'react-router-dom';
import { DocumentDTO, SupplierId } from '../shared/types';
import { useGetDocuments } from '../modules/documents/hooks/getDocuments';
import { Routes } from '../shared/constants/routes';

const columns: ColumnsType<DocumentDTO> = [
  {
    title: 'Дата',
    dataIndex: 'date',
    key: 'date',
    render: (date?: Date) => (date ? new Date(date).toLocaleDateString() : '—'),
  },
  {
    title: 'Тип',
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: 'Номер',
    dataIndex: 'number',
    key: 'number',
  },
  {
    title: 'Сумма с НДС',
    dataIndex: 'totalSumWithVat',
    key: 'totalSumWithVat',
  },
];

export default function DocumentsPage() {
  const navigate = useNavigate();
  const { supplierId } = useParams<{ supplierId: string }>();

  const { data: documents, isLoading } = useGetDocuments(
    supplierId as SupplierId,
  );

  if (isLoading) {
    return <Spin />;
  }

  return (
    <Table
      rowKey={(record) => record.id ?? `${record.type}-${record.number}`}
      columns={columns}
      dataSource={documents}
      pagination={false}
      onRow={(record) => ({
        onClick: () => {
          if (!record.id || !supplierId) return;
          navigate(`${Routes.documents}/${supplierId}/${record.id}`);
        },
        style: { cursor: record.id ? 'pointer' : undefined },
      })}
    />
  );
}
