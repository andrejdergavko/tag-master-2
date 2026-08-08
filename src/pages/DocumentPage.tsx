import { CheckCircleOutlined, PrinterOutlined } from '@ant-design/icons';
import { Button, Spin, Table, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { DocumentItemDTO, SupplierId } from '../shared/types';
import {
  DOCUMENT_QUERY_KEY,
  useGetDocument,
} from '../modules/documents/hooks/useGetDocument';
import { Routes } from '../shared/constants/routes';
import BackButton from '../shared/components/BackButton';
import DocumentTypeTag from '../shared/components/DocumentTypeTag';
import { formatDate } from '../shared/utils/date';
import { TagType } from '../services/printer/constants';
import suppliers from '../modules/suppliers';
import './DocumentPage.scss';

const getItemColumns = (
  onPrint: (record: DocumentItemDTO) => void,
): ColumnsType<DocumentItemDTO> => [
  {
    title: 'Артикул',
    dataIndex: 'sku',
    key: 'sku',
    width: 170,
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
    title: 'Цена с НДС',
    key: 'price',
    width: 100,
    render: (_, record) =>
      record.quantity ? (record.sumWithVat / record.quantity).toFixed(2) : '—',
  },
  {
    title: 'Сумма с НДС',
    dataIndex: 'sumWithVat',
    key: 'sumWithVat',
    width: 100,
    render: (sumWithVat: number) => sumWithVat.toFixed(2),
  },
  {
    title: '',
    key: 'printed',
    width: 40,
    render: (_, record) =>
      record.printedAt ? (
        <Tooltip title={`Напечатан ${formatDate(record.printedAt)}`}>
          <CheckCircleOutlined style={{ color: '#52c41a' }} />
        </Tooltip>
      ) : null,
  },
  {
    title: '',
    key: 'actions',
    width: 60,
    render: (_, record) => (
      <Button
        type="text"
        icon={<PrinterOutlined />}
        onClick={() => onPrint(record)}
      />
    ),
  },
];

export default function DocumentPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { supplierId, documentId } = useParams<{
    supplierId: string;
    documentId: string;
  }>();

  const { data: document, isLoading } = useGetDocument(
    supplierId as SupplierId,
    documentId as string,
  );

  const supplier = suppliers.find((item) => item.id === supplierId);

  const handlePrintItem = async (record: DocumentItemDTO) => {
    await window.electron.printer.printTags(TagType.FOUR_X_TWO_FIVE, [
      {
        sku: record.sku,
        name: record.name,
        supplierCode: supplier?.code ?? '',
        price: record.sumWithVat,
        number: String(record.id),
      },
    ]);

    await queryClient.invalidateQueries({
      queryKey: [DOCUMENT_QUERY_KEY, supplierId, documentId],
    });
  };

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div>
        <BackButton />
      </div>

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
          <div style={{ height: '100%', overflow: 'auto' }}>
            <Table
              rowKey={(record) => String(record.id)}
              size="small"
              columns={getItemColumns(handlePrintItem)}
              dataSource={document.items}
              pagination={false}
              rowHoverable={false}
            />
          </div>
        </>
      )}
    </div>
  );
}
