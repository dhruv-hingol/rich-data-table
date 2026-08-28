// Inventory Filters slide-over sheet drawer powered by TanStack Query for dynamic SKU dropdown options.
import React, { useState, useEffect } from "react";
import { Button } from "../../../components/ui/button";
import { Select, type SelectOption } from "../../../components/ui/select";
import { useTableUIStore } from "../store/useTableUIStore";
import type { StockStatus } from "../types/inventory.types";
import {
  CATEGORY_OPTIONS,
  STATUS_OPTIONS,
  WAREHOUSE_OPTIONS,
} from "../constants/filterOptions";
import Drawer from "../../../components/ui/drawer";
import { useUniqueSkusQuery } from "../hooks/useInventoryQuery";

export function FilterSheet() {
  const {
    isColumnManagerOpen,
    setIsColumnManagerOpen,
    statusFilter,
    setStatusFilter,
    categoryFilter,
    setCategoryFilter,
    skuFilter,
    setSkuFilter,
    resetAllFilters,
  } = useTableUIStore();

  const [selectedWarehouse, setSelectedWarehouse] = useState<string>("ALL");
  const [localCategory, setLocalCategory] = useState<string>(categoryFilter);
  const [localStatus, setLocalStatus] = useState<StockStatus | "ALL">(statusFilter);
  const [localSku, setLocalSku] = useState<string>(skuFilter);

  // TanStack Query for unique SKUs
  const { data: uniqueSkus = [] } = useUniqueSkusQuery();

  const dynamicSkuOptions: SelectOption[] = React.useMemo(() => {
    return [
      { label: "Select SKU", value: "ALL" },
      ...uniqueSkus.map((sku) => ({ label: sku, value: sku })),
    ];
  }, [uniqueSkus]);

  // Sync local draft filter state when drawer opens
  useEffect(() => {
    if (isColumnManagerOpen) {
      setLocalCategory(categoryFilter);
      setLocalStatus(statusFilter);
      setLocalSku(skuFilter);
    }
  }, [isColumnManagerOpen, categoryFilter, statusFilter, skuFilter]);

  const handleClear = () => {
    setSelectedWarehouse("ALL");
    setLocalCategory("ALL");
    setLocalStatus("ALL");
    setLocalSku("ALL");
    resetAllFilters();
    setIsColumnManagerOpen(false);
  };

  const handleApply = () => {
    setCategoryFilter(localCategory);
    setStatusFilter(localStatus);
    setSkuFilter(localSku === "ALL" ? "" : localSku);
    setIsColumnManagerOpen(false);
  };

  return (
    <Drawer
      open={isColumnManagerOpen}
      onClose={() => setIsColumnManagerOpen(false)}
      title="Inventory Filters"
    >
      <div className="flex flex-col justify-between h-full space-y-6">
        <div className="space-y-5">
          {/* SKU Select Dropdown with Real Dynamic Dataset SKUs from TanStack Query */}
          <Select
            label="SKU"
            labelClassName="font-semibold text-slate-700 mb-1.5"
            options={dynamicSkuOptions}
            value={localSku || "ALL"}
            onChange={(val) => setLocalSku(val)}
          />

          {/* Category Select Dropdown */}
          <Select
            label="Category"
            labelClassName="font-semibold text-slate-700 mb-1.5"
            options={CATEGORY_OPTIONS}
            value={localCategory}
            onChange={(val) => setLocalCategory(val)}
          />

          {/* Stock Status Select Dropdown */}
          <Select
            label="Stock Status"
            labelClassName="font-semibold text-slate-700 mb-1.5"
            options={STATUS_OPTIONS}
            value={localStatus}
            onChange={(val) => setLocalStatus(val as any)}
          />

          {/* Warehouse Select Dropdown */}
          <Select
            label="Warehouse"
            labelClassName="font-semibold text-slate-700 mb-1.5"
            options={WAREHOUSE_OPTIONS}
            value={selectedWarehouse}
            onChange={(val) => setSelectedWarehouse(val)}
          />
        </div>

        {/* Footer Action Buttons */}
        <div className="pt-6 border-t border-slate-100 grid grid-cols-2 gap-4 mt-auto shrink-0">
          <Button
            variant="outline"
            size="md"
            onClick={handleClear}
            className="w-full"
          >
            Clear Filters
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={handleApply}
            className="w-full bg-[#ff6600]"
          >
            Show Results
          </Button>
        </div>
      </div>
    </Drawer>
  );
}
