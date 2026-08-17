import { create } from 'zustand';
import { SupplierId } from '../../shared/types';
import { DatePreset, ProductsFiltersState } from './types';

type ProductsFiltersStore = ProductsFiltersState & {
  setSearchInput: (searchInput: string) => void;
  setSearch: (search: string) => void;
  setSemanticSearch: (semanticSearch: boolean) => void;
  setSupplierIds: (supplierIds: SupplierId[]) => void;
  setDatePreset: (datePreset: DatePreset | null) => void;
  setDateRange: (dateFrom: string | null, dateTo: string | null) => void;
  setPage: (page: number) => void;
};

export const useProductsFiltersStore = create<ProductsFiltersStore>((set) => ({
  searchInput: '',
  search: '',
  semanticSearch: false,
  supplierIds: [],
  datePreset: 'all',
  dateFrom: null,
  dateTo: null,
  page: 1,
  setSearchInput: (searchInput) => set({ searchInput }),
  setSearch: (search) => set({ search }),
  setSemanticSearch: (semanticSearch) => set({ semanticSearch, page: 1 }),
  setSupplierIds: (supplierIds) => set({ supplierIds, page: 1 }),
  setDatePreset: (datePreset) => set({ datePreset }),
  setDateRange: (dateFrom, dateTo) => set({ dateFrom, dateTo }),
  setPage: (page) => set({ page }),
}));
