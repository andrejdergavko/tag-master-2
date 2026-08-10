import type { ColumnsType } from 'antd/es/table';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { endOfDay, startOfDay, subMonths, subWeeks } from 'date-fns';
import { DocumentItemRowDTO } from '../../shared/types';
import { formatDate } from '../../shared/utils/date';
import { DatePreset } from './types';

export const PAGE_SIZE = 100;

export const datePresetOptions: { label: string; value: DatePreset }[] = [
  { label: 'Неделя', value: '1w' },
  { label: '2 недели', value: '2w' },
  { label: '3 недели', value: '3w' },
  { label: 'Месяц', value: '1m' },
  { label: 'Всё время', value: 'all' },
];

export const getRangeForPreset = (
  preset: DatePreset,
): [Dayjs, Dayjs] | null => {
  const now = new Date();
  const to = dayjs(endOfDay(now));

  switch (preset) {
    case '1w':
      return [dayjs(startOfDay(subWeeks(now, 1))), to];
    case '2w':
      return [dayjs(startOfDay(subWeeks(now, 2))), to];
    case '3w':
      return [dayjs(startOfDay(subWeeks(now, 3))), to];
    case '1m':
      return [dayjs(startOfDay(subMonths(now, 1))), to];
    case 'all':
      return null;
  }
};

export const columns: ColumnsType<DocumentItemRowDTO> = [
  {
    title: 'Артикул',
    dataIndex: 'sku',
    key: 'sku',
    width: 140,
    render: (sku?: string) => sku || '—',
  },
  {
    title: 'Наименование',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Поставщик',
    dataIndex: 'supplierName',
    key: 'supplierName',
    width: 140,
  },
  {
    title: 'Кол-во',
    dataIndex: 'quantity',
    key: 'quantity',
    width: 80,
  },
  {
    title: 'Ед.',
    dataIndex: 'units',
    key: 'units',
    width: 60,
  },
  {
    title: 'Дата накладной',
    dataIndex: 'documentDate',
    key: 'documentDate',
    width: 130,
    render: (date?: string | null) => (date ? formatDate(date) : '—'),
  },
  {
    title: '№ документа',
    dataIndex: 'documentNumber',
    key: 'documentNumber',
    width: 130,
    render: (number?: string | null) => number || '—',
  },
  {
    title: 'Цена с НДС',
    key: 'price',
    width: 100,
    render: (_, record) =>
      record.quantity ? (record.sumWithVat / record.quantity).toFixed(2) : '—',
  },
];
