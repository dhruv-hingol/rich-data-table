// Zustand UI-only state store for search text, status quick filters, category, SKU, column presets, row selections, and refresh trigger.
import { create } from 'zustand';
import type { StockStatus } from '../types/inventory.types';

export type ColumnPreset = 'ALL' | 'ESSENTIALS' | 'INVENTORY' | 'PRICING' | 'SUPPLIER';

interface TableUIState {
  searchQuery: string;
  statusFilter: StockStatus | 'ALL';
  categoryFilter: string;
  skuFilter: string;
  selectedRowIds: string[];
  columnPreset: ColumnPreset;
  visibleColumns: string[];
  isAddDialogOpen: boolean;
  isBulkImportOpen: boolean;
  isColumnManagerOpen: boolean;
  refreshKey: number;
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: StockStatus | 'ALL') => void;
  setCategoryFilter: (category: string) => void;
  setSkuFilter: (sku: string) => void;
  resetAllFilters: () => void;
  setSelectedRowIds: (ids: string[]) => void;
  toggleRowSelection: (id: string) => void;
  clearSelection: () => void;
  setColumnPreset: (preset: ColumnPreset) => void;
  setVisibleColumns: (cols: string[]) => void;
  setIsAddDialogOpen: (open: boolean) => void;
  setIsBulkImportOpen: (open: boolean) => void;
  setIsColumnManagerOpen: (open: boolean) => void;
  triggerRefresh: () => void;
}

export const useTableUIStore = create<TableUIState>((set) => ({
  searchQuery: '',
  statusFilter: 'ALL',
  categoryFilter: 'ALL',
  skuFilter: '',
  selectedRowIds: [],
  columnPreset: 'ALL',
  visibleColumns: [],
  isAddDialogOpen: false,
  isBulkImportOpen: false,
  isColumnManagerOpen: false,
  refreshKey: 0,

  setSearchQuery: (query) => set({ searchQuery: query }),
  setStatusFilter: (status) => set({ statusFilter: status }),
  setCategoryFilter: (category) => set({ categoryFilter: category }),
  setSkuFilter: (sku) => set({ skuFilter: sku }),
  resetAllFilters: () =>
    set({
      searchQuery: '',
      statusFilter: 'ALL',
      categoryFilter: 'ALL',
      skuFilter: '',
    }),
  setSelectedRowIds: (ids) => set({ selectedRowIds: ids }),
  toggleRowSelection: (id) =>
    set((state) => ({
      selectedRowIds: state.selectedRowIds.includes(id)
        ? state.selectedRowIds.filter((item) => item !== id)
        : [...state.selectedRowIds, id],
    })),
  clearSelection: () => set({ selectedRowIds: [] }),
  setColumnPreset: (preset) => set({ columnPreset: preset }),
  setVisibleColumns: (cols) => set({ visibleColumns: cols }),
  setIsAddDialogOpen: (open) => set({ isAddDialogOpen: open }),
  setIsBulkImportOpen: (open) => set({ isBulkImportOpen: open }),
  setIsColumnManagerOpen: (open) => set({ isColumnManagerOpen: open }),
  triggerRefresh: () => set((state) => ({ refreshKey: state.refreshKey + 1 })),
}));
