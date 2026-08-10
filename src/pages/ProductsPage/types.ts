import { SupplierId } from '../../shared/types';

export type DatePreset = '1w' | '2w' | '3w' | '1m' | '3m' | '1y' | 'all';

export type ProductsFiltersState = {
  searchInput: string;
  search: string;
  supplierIds: SupplierId[];
  datePreset: DatePreset | null;
  dateFrom: string | null;
  dateTo: string | null;
  page: number;
};
