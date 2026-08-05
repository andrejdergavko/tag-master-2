import { PrinterOutlined } from '@ant-design/icons';
import { Button, Spin, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate, useParams } from 'react-router-dom';
import { DocumentItemDTO, SupplierId } from '../shared/types';
import { useGetDocument } from '../modules/documents/hooks/useGetDocument';
import { Routes } from '../shared/constants/routes';
import BackButton from '../shared/components/BackButton';
import DocumentTypeTag from '../shared/components/DocumentTypeTag';
import { TagType } from '../services/printer/constants';
import suppliers from '../modules/suppliers';

const getItemColumns = (supplierCode: string): ColumnsType<DocumentItemDTO> => [
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
    title: '',
    key: 'actions',
    render: (_, record) => (
      <Button
        type="text"
        icon={<PrinterOutlined />}
        onClick={() => {
          window.electron.printer.printTags(TagType.FOUR_X_TWO_FIVE, [
            {
              sku: record.sku,
              name: record.name,
              supplierCode,
              price: record.sumWithVat,
              number: String(record.id),
            },
          ]);
        }}
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

  const supplier = suppliers.find((item) => item.id === supplierId);

  return (
    <div>
      <BackButton />
      {isLoading && <Spin />}
      {!isLoading && !document && <div>Документ не найден</div>}
      {!isLoading && document && (
        <>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: 16,
            }}
          >
            <div>
              <div>
                Тип: <DocumentTypeTag type={document.type} />
              </div>
              <div>Номер: {document.number ?? '—'}</div>
              <div>
                Дата:
                {document.date
                  ? new Date(document.date).toLocaleDateString()
                  : '—'}
              </div>
              <div>Сумма с НДС: {document.totalSumWithVat}</div>
            </div>
            <Button
              type="primary"
              icon={<PrinterOutlined />}
              onClick={() =>
                navigate(
                  `${Routes.documents}/${supplierId}/${documentId}/print-tags`,
                )
              }
            >
              Печать ценников
            </Button>
          </div>
          <Table
            rowKey={(record) => String(record.id)}
            size="small"
            columns={getItemColumns(supplier?.code ?? '')}
            dataSource={document.items}
            pagination={false}
            rowHoverable={false}
          />
        </>
      )}
    </div>
  );
}
