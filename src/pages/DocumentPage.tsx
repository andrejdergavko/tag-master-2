import { PrinterOutlined } from '@ant-design/icons';
import { Button, Spin, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate, useParams } from 'react-router-dom';
import { DocumentItemDTO, SupplierId } from '../shared/types';
import { useGetDocument } from '../modules/documents/hooks/useGetDocument';
import { Routes } from '../shared/constants/routes';
import BackButton from '../shared/components/BackButton';
import DocumentTypeTag from '../shared/components/DocumentTypeTag';
import { formatDate } from '../shared/utils/date';
import { TagType } from '../services/printer/constants';
import suppliers from '../modules/suppliers';
import './DocumentPage.scss';

const getItemColumns = (supplierCode: string): ColumnsType<DocumentItemDTO> => [
  {
    title: 'Артикул',
    dataIndex: 'sku',
    key: 'sku',
    width: 100,
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
    width: 60,
  },
  {
    title: 'Кол-во',
    dataIndex: 'quantity',
    key: 'quantity',
    width: 80,
  },
  {
    title: 'Цена',
    key: 'price',
    width: 100,
    render: (_, record) =>
      record.quantity ? record.sumWithVat / record.quantity : '—',
  },
  {
    title: 'Сумма с НДС',
    dataIndex: 'sumWithVat',
    key: 'sumWithVat',
    width: 100,
  },
  {
    title: '',
    key: 'actions',
    width: 60,
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
                Тип:
                <span className="document-page-field-value">
                  <DocumentTypeTag type={document.type} />
                </span>
              </div>
              <div>
                Номер:
                <span className="document-page-field-value">
                  {document.number ?? '—'}
                </span>
              </div>
              <div>
                Дата:
                <span className="document-page-field-value">
                  {document.date ? formatDate(document.date) : '—'}
                </span>
              </div>
              <div>
                Сумма с НДС:
                <span className="document-page-field-value">
                  {document.totalSumWithVat}
                </span>
              </div>
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
            scroll={{ y: 'calc(100vh - 360px)' }}
          />
        </>
      )}
    </div>
  );
}
