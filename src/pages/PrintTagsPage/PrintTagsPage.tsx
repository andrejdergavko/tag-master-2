import { useEffect, useState, type Key, type MouseEvent } from 'react';
import { Button, InputNumber, Spin, Table } from 'antd';
import type { TableProps } from 'antd/es/table';
import { useParams } from 'react-router-dom';
import { SupplierId } from '../../shared/types';
import { useGetDocument } from '../../modules/documents/hooks/useGetDocument';
import { usePrintTags } from '../../modules/printer/hooks/usePrintTags';
import BackButton from '../../shared/components/BackButton';
import { TagType } from '../../services/printer/constants';
import suppliers from '../../modules/suppliers';
import { PrintRow } from './types';

export default function PrintTagsPage() {
  const { supplierId, documentId } = useParams();
  const { mutateAsync: printTags } = usePrintTags();

  const { data: document, isLoading } = useGetDocument(
    supplierId as SupplierId | undefined,
    documentId,
  );
  const supplier = suppliers.find((item) => item.id === supplierId);

  const [rows, setRows] = useState<PrintRow[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!document) return;

    const nextRows = document.items.map((item) => ({
      data: item,
      key: String(item.id),
    }));

    setRows(nextRows);
    setSelectedRowKeys(nextRows.map((row) => row.key));
    setQuantities(
      Object.fromEntries(nextRows.map((row) => [row.key, row.data.quantity])),
    );
  }, [document]);

  const rowSelection: TableProps<PrintRow>['rowSelection'] = {
    selectedRowKeys,
    onChange: (keys) => setSelectedRowKeys(keys),
  };

  const toggleRowSelection = (key: Key) => {
    setSelectedRowKeys((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key],
    );
  };

  const handleRowClick = (record: PrintRow, event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (
      target.closest('.ant-checkbox-wrapper') ||
      target.closest('.ant-input-number')
    ) {
      return;
    }
    toggleRowSelection(record.key);
  };

  const handlePrint = async () => {
    const itemsToPrint = rows
      .filter((row) => selectedRowKeys.includes(row.key) && row.data.id != null)
      .flatMap((row) => {
        const copies = quantities[row.key] ?? 1;
        return Array.from({ length: copies }, () => ({
          name: row.data.name,
          price: row.data.sumWithVat,
          supplierCode: supplier?.code ?? '',
          number: String(row.data.id),
          sku: row.data.sku,
        }));
      });

    await printTags({
      tagType: TagType.FIVE_EIGHT_X_THREE,
      data: itemsToPrint,
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
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexShrink: 0,
        }}
      >
        <BackButton />
        {!isLoading && document && (
          <Button
            type="primary"
            style={{ marginBottom: 16 }}
            disabled={selectedRowKeys.length === 0}
            onClick={handlePrint}
          >
            Распечатать
          </Button>
        )}
      </div>
      {isLoading && <Spin />}
      {!isLoading && !document && <div>Документ не найден</div>}
      {!isLoading && document && (
        <div style={{ height: '100%', overflow: 'auto' }}>
          <Table
            rowKey="key"
            size="small"
            rowSelection={rowSelection}
            onRow={(record) => ({
              onClick: (event) => handleRowClick(record, event),
              style: { cursor: 'pointer' },
            })}
            columns={[
              {
                title: 'Артикул',
                key: 'sku',
                width: 120,
                render: (_, record) => record.data.sku,
              },
              {
                title: 'Наименование',
                key: 'name',
                render: (_, record) => record.data.name,
              },
              {
                title: 'Ед.',
                key: 'units',
                width: 60,
                render: (_, record) => record.data.units,
              },
              {
                title: 'Кол-во этикеток',
                key: 'quantity',
                width: 140,
                render: (_, record) => (
                  <InputNumber
                    min={1}
                    value={quantities[record.key]}
                    onClick={(event) => event.stopPropagation()}
                    onChange={(value) => {
                      if (value == null) return;
                      setQuantities((prev) => ({
                        ...prev,
                        [record.key]: value,
                      }));
                    }}
                  />
                ),
              },
            ]}
            dataSource={rows}
            pagination={false}
          />
        </div>
      )}
    </div>
  );
}
