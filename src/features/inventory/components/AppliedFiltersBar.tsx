import { useTableUIStore } from "@/src/features/inventory/store/useTableUIStore";
import {
  AppliedFiltersBar as AppliedFiltersBarUI,
  type AppliedFilterItem,
} from "@/src/components/ui/applied-filters-bar";

export function AppliedFiltersBar() {
  const {
    statusFilter,
    setStatusFilter,
    categoryFilter,
    setCategoryFilter,
    skuFilter,
    setSkuFilter,
    warehouseFilter,
    setWarehouseFilter,
    searchQuery,
    setSearchQuery,
    resetAllFilters,
  } = useTableUIStore();

  const filters: AppliedFilterItem[] = [];

  if (searchQuery && searchQuery.trim() !== "") {
    filters.push({
      key: "search",
      label: "Search",
      value: `"${searchQuery.trim()}"`,
      onRemove: () => setSearchQuery(""),
    });
  }

  if (statusFilter && statusFilter !== "ALL") {
    filters.push({
      key: "status",
      label: "Status",
      value: statusFilter.replace("_", " "),
      onRemove: () => setStatusFilter("ALL"),
    });
  }

  if (categoryFilter && categoryFilter !== "ALL") {
    filters.push({
      key: "category",
      label: "Category",
      value: categoryFilter,
      onRemove: () => setCategoryFilter("ALL"),
    });
  }

  if (skuFilter && skuFilter.trim() !== "") {
    filters.push({
      key: "sku",
      label: "SKU",
      value: skuFilter.trim(),
      onRemove: () => setSkuFilter(""),
    });
  }

  if (warehouseFilter && warehouseFilter !== "ALL") {
    filters.push({
      key: "warehouse",
      label: "Warehouse",
      value: warehouseFilter,
      onRemove: () => setWarehouseFilter("ALL"),
    });
  }

  return <AppliedFiltersBarUI filters={filters} onClearAll={resetAllFilters} />;
}
