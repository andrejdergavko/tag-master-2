import { SupplierId } from '../../shared/types';

export type DatePreset = '1d' | '2d' | '1w' | '2w' | '1m' | '3m' | 'all';

export type ProductsFiltersState = {
  searchInput: string;
  search: string;
  supplierIds: SupplierId[];
  datePreset: DatePreset | null;
  dateFrom: string | null;
  dateTo: string | null;
  page: number;
};
