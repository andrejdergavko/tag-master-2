import { useEffect, useState, type Key } from 'react';
import { Button, InputNumber, Spin, Table } from 'antd';
import type { TableProps } from 'antd/es/table';
import { useParams } from 'react-router-dom';
import { SupplierId } from '../../shared/types';
import { useGetDocument } from '../../modules/documents/hooks/useGetDocument';
import BackButton from '../../shared/components/BackButton';
import { PrintRow } from './types';

export default function PrintTagsPage() {
  const { supplierId, documentId } = useParams();

  const { data: document, isLoading } = useGetDocument(
    supplierId as SupplierId | undefined,
    documentId,
  );

  const [rows, setRows] = useState<PrintRow[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!document) return;

    const nextRows = document.items.map((item, index) => ({
      ...item,
      key: String(index),
    }));

    setRows(nextRows);
    setSelectedRowKeys(nextRows.map((row) => row.key));
    setQuantities(
      Object.fromEntries(nextRows.map((row) => [row.key, row.quantity])),
    );
  }, [document]);

  const rowSelection: TableProps<PrintRow>['rowSelection'] = {
    selectedRowKeys,
    onChange: (keys) => setSelectedRowKeys(keys),
  };

  const handlePrint = () => {
    const itemsToPrint = rows
      .filter((row) => selectedRowKeys.includes(row.key))
      .map((row) => ({
        ...row,
        quantity: quantities[row.key],
      }));

    console.log('print', itemsToPrint);
  };

  return (
    <div>
      <BackButton />
      {isLoading && <Spin />}
      {!isLoading && !document && <div>Документ не найден</div>}
      {!isLoading && document && (
        <>
          <Button
            type="primary"
            style={{ marginBottom: 16 }}
            onClick={handlePrint}
          >
            Распечатать
          </Button>

          <Table
            rowKey="key"
            rowSelection={rowSelection}
            columns={[
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
                title: 'Кол-во этикеток',
                key: 'quantity',
                render: (_, record) => (
                  <InputNumber
                    min={1}
                    value={quantities[record.key]}
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
        </>
      )}
    </div>
  );
}
