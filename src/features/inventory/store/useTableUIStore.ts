import { create } from 'zustand';
import type { StockStatus } from '../types/inventory.types';
import { ALL_COLUMN_FIELDS, PRESET_FIELDS } from '../lib/columnMetadata';

export type ColumnPreset = 'ALL' | 'ESSENTIALS' | 'INVENTORY' | 'PRICING' | 'SUPPLIER';

const STORAGE_VISIBLE_COLS_KEY = 'apex_visible_columns_v1';
const STORAGE_PRESET_KEY = 'apex_column_preset_v1';

function getInitialVisibleColumns(): string[] {
  try {
    const saved = localStorage.getItem(STORAGE_VISIBLE_COLS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // Ignore localStorage errors
  }
  return ALL_COLUMN_FIELDS;
}

function getInitialPreset(): ColumnPreset {
  try {
    const saved = localStorage.getItem(STORAGE_PRESET_KEY);
    if (saved && ['ALL', 'ESSENTIALS', 'INVENTORY', 'PRICING', 'SUPPLIER'].includes(saved)) {
      return saved as ColumnPreset;
    }
  } catch {
    // Ignore localStorage errors
  }
  return 'ALL';
}

function saveToLocalStorage(visibleCols: string[], preset: ColumnPreset) {
  try {
    localStorage.setItem(STORAGE_VISIBLE_COLS_KEY, JSON.stringify(visibleCols));
    localStorage.setItem(STORAGE_PRESET_KEY, preset);
  } catch {
    // Ignore localStorage errors
  }
}

interface TableUIState {
  searchQuery: string;
  statusFilter: StockStatus | 'ALL';
  categoryFilter: string;
  skuFilter: string;
  warehouseFilter: string;
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
  setWarehouseFilter: (warehouse: string) => void;
  resetAllFilters: () => void;
  setSelectedRowIds: (ids: string[]) => void;
  toggleRowSelection: (id: string) => void;
  clearSelection: () => void;
  setColumnPreset: (preset: ColumnPreset) => void;
  setVisibleColumns: (cols: string[]) => void;
  toggleColumnVisibility: (field: string) => void;
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
  warehouseFilter: 'ALL',
  selectedRowIds: [],
  columnPreset: getInitialPreset(),
  visibleColumns: getInitialVisibleColumns(),
  isAddDialogOpen: false,
  isBulkImportOpen: false,
  isColumnManagerOpen: false,
  refreshKey: 0,

  setSearchQuery: (query) => set({ searchQuery: query }),
  setStatusFilter: (status) => set({ statusFilter: status }),
  setCategoryFilter: (category) => set({ categoryFilter: category }),
  setSkuFilter: (sku) => set({ skuFilter: sku }),
  setWarehouseFilter: (warehouse) => set({ warehouseFilter: warehouse }),
  resetAllFilters: () =>
    set({
      searchQuery: '',
      statusFilter: 'ALL',
      categoryFilter: 'ALL',
      skuFilter: '',
      warehouseFilter: 'ALL',
    }),
  setSelectedRowIds: (ids) => set({ selectedRowIds: ids }),
  toggleRowSelection: (id) =>
    set((state) => ({
      selectedRowIds: state.selectedRowIds.includes(id)
        ? state.selectedRowIds.filter((item) => item !== id)
        : [...state.selectedRowIds, id],
    })),
  clearSelection: () => set({ selectedRowIds: [] }),
  setColumnPreset: (preset) => {
    const fields = PRESET_FIELDS[preset] || ALL_COLUMN_FIELDS;
    saveToLocalStorage(fields, preset);
    set({ columnPreset: preset, visibleColumns: fields });
  },
  setVisibleColumns: (cols) => {
    saveToLocalStorage(cols, 'ALL');
    set({ visibleColumns: cols, columnPreset: 'ALL' });
  },
  toggleColumnVisibility: (field) =>
    set((state) => {
      const isCurrentlyVisible = state.visibleColumns.includes(field);
      const updated = isCurrentlyVisible
        ? state.visibleColumns.filter((c) => c !== field)
        : [...state.visibleColumns, field];
      saveToLocalStorage(updated, 'ALL');
      return { visibleColumns: updated, columnPreset: 'ALL' };
    }),
  setIsAddDialogOpen: (open) => set({ isAddDialogOpen: open }),
  setIsBulkImportOpen: (open) => set({ isBulkImportOpen: open }),
  setIsColumnManagerOpen: (open) => set({ isColumnManagerOpen: open }),
  triggerRefresh: () => set((state) => ({ refreshKey: state.refreshKey + 1 })),
}));

