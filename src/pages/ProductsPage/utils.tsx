import type { ColumnsType } from 'antd/es/table';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { endOfDay, startOfDay, subMonths, subWeeks, subYears } from 'date-fns';
import { CheckCircleOutlined, FileTextOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { DocumentItemRowDTO } from '../../shared/types';
import { formatDate } from '../../shared/utils/date';
import { DatePreset } from './types';

export const PAGE_SIZE = 100;

export const datePresetOptions: { label: string; value: DatePreset }[] = [
  { label: 'Неделя', value: '1w' },
  { label: '2 недели', value: '2w' },
  { label: '3 недели', value: '3w' },
  { label: 'Месяц', value: '1m' },
  { label: '3 месяца', value: '3m' },
  { label: 'Год', value: '1y' },
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
    case '3m':
      return [dayjs(startOfDay(subMonths(now, 3))), to];
    case '1y':
      return [dayjs(startOfDay(subYears(now, 1))), to];
    case 'all':
      return null;
  }
};

export const getColumns = (
  onOpenDocument: (record: DocumentItemRowDTO) => void,
): ColumnsType<DocumentItemRowDTO> => [
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
    width: 100,
  },
  {
    title: 'Кол-во',
    dataIndex: 'quantity',
    key: 'quantity',
    width: 70,
  },
  {
    title: 'Ед.',
    dataIndex: 'units',
    key: 'units',
    width: 60,
  },
  {
    title: 'Дата документа',
    dataIndex: 'documentDate',
    key: 'documentDate',
    width: 130,
    render: (date?: string | null) => (date ? formatDate(date) : '—'),
  },
  {
    title: '№ документа',
    dataIndex: 'documentNumber',
    key: 'documentNumber',
    width: 110,
    render: (number?: string | null) => number || '—',
  },
  {
    title: 'Цена с НДС',
    key: 'price',
    width: 95,
    render: (_, record) =>
      record.quantity ? (record.sumWithVat / record.quantity).toFixed(2) : '—',
  },
  {
    title: 'Сумма с НДС',
    dataIndex: 'sumWithVat',
    key: 'sumWithVat',
    width: 95,
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
    key: 'document',
    width: 48,
    render: (_, record) => (
      <FileTextOutlined
        style={{ color: '#4374e6', cursor: 'pointer' }}
        onClick={(event) => {
          event.stopPropagation();
          onOpenDocument(record);
        }}
      />
    ),
  },
];
