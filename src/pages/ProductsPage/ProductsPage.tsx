import { useEffect, useState } from 'react';
import { DatePicker, Input, Segmented, Select, Table } from 'antd';
import type { Dayjs } from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { SupplierId } from '../../shared/types';
import { useGetDocumentItems } from '../../modules/documents/hooks/useGetDocumentItems';
import suppliers from '../../modules/suppliers';
import { Routes } from '../../shared/constants/routes';
import { DatePreset } from './types';
import {
  PAGE_SIZE,
  columns,
  datePresetOptions,
  getRangeForPreset,
} from './utils';

export default function ProductsPage() {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [supplierId, setSupplierId] = useState<SupplierId | undefined>();
  const [datePreset, setDatePreset] = useState<DatePreset | null>('all');
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data, isLoading, isFetching } = useGetDocumentItems({
    search: search || undefined,
    supplierId,
    dateFrom: dateRange?.[0]?.startOf('day').toISOString() ?? null,
    dateTo: dateRange?.[1]?.endOf('day').toISOString() ?? null,
    page,
    pageSize: PAGE_SIZE,
  });

  const handlePresetChange = (preset: DatePreset) => {
    setDatePreset(preset);
    setDateRange(getRangeForPreset(preset));
    setPage(1);
  };

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 12,
          alignItems: 'center',
        }}
      >
        <Input.Search
          allowClear
          placeholder="Поиск по названию или артикулу"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          style={{ width: 280 }}
        />
        <Select
          allowClear
          placeholder="Поставщик"
          value={supplierId}
          onChange={(value: SupplierId | undefined) => {
            setSupplierId(value);
            setPage(1);
          }}
          options={suppliers.map((supplier) => ({
            value: supplier.id,
            label: supplier.name,
          }))}
          style={{ width: 180 }}
        />
        <Segmented
          value={datePreset ?? undefined}
          options={datePresetOptions}
          onChange={(value) => handlePresetChange(value as DatePreset)}
        />
        <DatePicker.RangePicker
          value={dateRange}
          onChange={(dates) => {
            if (!dates || !dates[0] || !dates[1]) {
              setDateRange(null);
              setDatePreset('all');
            } else {
              setDateRange([dates[0], dates[1]]);
              setDatePreset(null);
            }
            setPage(1);
          }}
          format="DD.MM.YYYY"
        />
      </div>

      <div style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
        <Table
          rowKey="id"
          columns={columns}
          size="small"
          dataSource={data?.items}
          loading={isLoading || isFetching}
          pagination={{
            current: page,
            pageSize: PAGE_SIZE,
            total: data?.total ?? 0,
            showSizeChanger: false,
            showTotal: (total) => `Всего: ${total}`,
            onChange: (nextPage) => setPage(nextPage),
          }}
          onRow={(record) => ({
            onClick: () => {
              navigate(
                `${Routes.documents}/${record.supplierId}/${record.documentId}`,
              );
            },
            style: { cursor: 'pointer' },
          })}
        />
      </div>
    </div>
  );
}
