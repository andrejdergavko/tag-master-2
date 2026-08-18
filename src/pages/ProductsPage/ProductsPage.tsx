import { useEffect } from 'react';
import { Checkbox, DatePicker, Input, Pagination, Segmented, Select, Table } from 'antd';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { DocumentItemRowDTO, SupplierId } from '../../shared/types';
import { useGetDocumentItems } from '../../modules/documents/hooks/useGetDocumentItems';
import { usePrintTags } from '../../modules/printer/hooks/usePrintTags';
import suppliers from '../../modules/suppliers';
import { Routes } from '../../shared/constants/routes';
import { TagType } from '../../services/printer/constants';
import { useProductsFiltersStore } from './filtersStore';
import { DatePreset } from './types';
import {
  PAGE_SIZE,
  datePresetOptions,
  getColumns,
  getRangeForPreset,
} from './utils';
import './ProductsPage.scss';

const toDateRange = (
  dateFrom: string | null,
  dateTo: string | null,
): [Dayjs, Dayjs] | null => {
  if (!dateFrom || !dateTo) return null;
  return [dayjs(dateFrom), dayjs(dateTo)];
};

export default function ProductsPage() {
  const navigate = useNavigate();
  const { mutateAsync: printTags } = usePrintTags();
  const searchInput = useProductsFiltersStore((state) => state.searchInput);
  const search = useProductsFiltersStore((state) => state.search);
  const semanticSearch = useProductsFiltersStore((state) => state.semanticSearch);
  const supplierIds = useProductsFiltersStore((state) => state.supplierIds);
  const datePreset = useProductsFiltersStore((state) => state.datePreset);
  const dateFrom = useProductsFiltersStore((state) => state.dateFrom);
  const dateTo = useProductsFiltersStore((state) => state.dateTo);
  const page = useProductsFiltersStore((state) => state.page);
  const setSearchInput = useProductsFiltersStore((state) => state.setSearchInput);
  const setSearch = useProductsFiltersStore((state) => state.setSearch);
  const setSemanticSearch = useProductsFiltersStore(
    (state) => state.setSemanticSearch,
  );
  const setSupplierIds = useProductsFiltersStore((state) => state.setSupplierIds);
  const setDatePreset = useProductsFiltersStore((state) => state.setDatePreset);
  const setDateRange = useProductsFiltersStore((state) => state.setDateRange);
  const setPage = useProductsFiltersStore((state) => state.setPage);

  const dateRange = toDateRange(dateFrom, dateTo);

  useEffect(() => {
    const next = searchInput.trim();
    if (next === search) return;

    const timer = setTimeout(() => {
      setSearch(next);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput, search, setSearch, setPage]);

  const { data, isLoading, isFetching } = useGetDocumentItems({
    search: search || undefined,
    semanticSearch,
    supplierIds: supplierIds.length ? supplierIds : undefined,
    dateFrom,
    dateTo,
    page,
    pageSize: PAGE_SIZE,
  });

  const handlePresetChange = (preset: DatePreset) => {
    const range = getRangeForPreset(preset);
    setDatePreset(preset);
    setDateRange(
      range?.[0]?.startOf('day').toISOString() ?? null,
      range?.[1]?.endOf('day').toISOString() ?? null,
    );
    setPage(1);
  };

  const handleOpenDocument = (record: DocumentItemRowDTO) => {
    navigate(`${Routes.documents}/${record.supplierId}/${record.documentId}`);
  };

  const handlePrint = async (record: DocumentItemRowDTO) => {
    const supplier = suppliers.find((item) => item.id === record.supplierId);

    await printTags({
      tagType: TagType.FIVE_EIGHT_X_THREE,
      data: [
        {
          sku: record.sku,
          name: record.name,
          supplierCode: supplier?.code ?? '',
          price: record.sumWithVat / record.quantity,
          number: String(record.id),
        },
      ],
    });
  };

  return (
    <div
      style={{
        flex: 1,
        minHeight: 0,
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
          flexShrink: 0,
        }}
      >
        <Input.Search
          allowClear
          placeholder="Поиск по названию или артикулу"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          style={{ width: 280 }}
        />
        <Checkbox
          checked={semanticSearch}
          onChange={(event) => setSemanticSearch(event.target.checked)}
        >
          Поиск по смыслу
        </Checkbox>
        <Select
          allowClear
          mode="multiple"
          maxTagCount="responsive"
          placeholder="Поставщики"
          value={supplierIds}
          onChange={(value: SupplierId[]) => setSupplierIds(value)}
          options={suppliers.map((supplier) => ({
            value: supplier.id,
            label: (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <img
                  src={supplier.icon.src}
                  style={{ width: 12, height: 12 }}
                />
                {supplier.name}
              </span>
            ),
          }))}
          style={{ minWidth: 240 }}
        />
        <Segmented
          shape="round"
          className="products-page-presets"
          value={datePreset ?? undefined}
          options={datePresetOptions}
          onChange={(value) => handlePresetChange(value as DatePreset)}
        />
        <DatePicker.RangePicker
          value={dateRange}
          onChange={(dates) => {
            if (!dates || !dates[0] || !dates[1]) {
              setDateRange(null, null);
              setDatePreset('all');
            } else {
              setDateRange(
                dates[0].startOf('day').toISOString(),
                dates[1].endOf('day').toISOString(),
              );
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
          columns={getColumns(handleOpenDocument, handlePrint)}
          size="small"
          dataSource={data?.items}
          loading={isLoading || isFetching}
          pagination={false}
        />
      </div>

      <div
        style={{
          flexShrink: 0,
          display: 'flex',
          justifyContent: 'flex-end',
          paddingTop: 4,
        }}
      >
        <Pagination
          current={page}
          pageSize={PAGE_SIZE}
          total={data?.total ?? 0}
          showSizeChanger={false}
          showTotal={(total) => `Всего: ${total}`}
          onChange={(nextPage) => setPage(nextPage)}
        />
      </div>
    </div>
  );
}
