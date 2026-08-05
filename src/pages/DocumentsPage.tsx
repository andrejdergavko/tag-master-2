import { Button, Spin, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate, useParams } from 'react-router-dom';
import { DocumentDTO, DocumentType, SupplierId } from '../shared/types';
import { useGetDocuments } from '../modules/documents/hooks/useGetDocuments';
import { useFetchDocuments } from '../modules/documents/hooks/useАetchDocuments';
import { Routes } from '../shared/constants/routes';
import DocumentTypeTag from '../shared/components/DocumentTypeTag';
import { formatDate } from '../shared/utils/date';

const columns: ColumnsType<DocumentDTO> = [
  {
    title: 'Дата',
    dataIndex: 'date',
    key: 'date',
    render: (date?: Date) => (date ? formatDate(date) : '—'),
  },
  {
    title: 'Тип',
    dataIndex: 'type',
    key: 'type',
    render: (type: DocumentType) => <DocumentTypeTag type={type} />,
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
  const { mutate: fetchDocuments, isPending: isFetching } = useFetchDocuments(
    supplierId as SupplierId,
  );

  if (isLoading) {
    return <Spin />;
  }

  return (
    <div>
      <Button
        type="primary"
        loading={isFetching}
        onClick={() => fetchDocuments()}
        style={{ marginBottom: 16 }}
      >
        Загрузить с почты
      </Button>
      <Table
        rowKey={(record) => record.id ?? `${record.type}-${record.number}`}
        columns={columns}
        size="small"
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
    </div>
  );
}
