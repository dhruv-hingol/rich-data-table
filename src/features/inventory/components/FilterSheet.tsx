import React, { useState, useEffect } from "react";
import { Button } from "@/src/components/ui/button";
import { Select, type SelectOption } from "@/src/components/ui/select";
import { useTableUIStore } from "@/src/features/inventory/store/useTableUIStore";
import type { StockStatus } from "@/src/features/inventory/types/inventory.types";
import {
  CATEGORY_OPTIONS,
  STATUS_OPTIONS,
  WAREHOUSE_OPTIONS,
} from "@/src/features/inventory/constants/filterOptions";
import Drawer from "@/src/components/ui/drawer";
import { useUniqueSkusQuery } from "@/src/features/inventory/hooks/useInventoryQuery";

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
    warehouseFilter,
    setWarehouseFilter,
    resetAllFilters,
  } = useTableUIStore();

  const [localWarehouse, setLocalWarehouse] = useState<string>(warehouseFilter);
  const [localCategory, setLocalCategory] = useState<string>(categoryFilter);
  const [localStatus, setLocalStatus] = useState<StockStatus | "ALL">(
    statusFilter,
  );
  const [localSku, setLocalSku] = useState<string>(skuFilter);

  const { data: uniqueSkus = [] } = useUniqueSkusQuery();

  const dynamicSkuOptions: SelectOption[] = React.useMemo(() => {
    return [
      { label: "Select SKU", value: "ALL" },
      ...uniqueSkus.map((sku) => ({ label: sku, value: sku })),
    ];
  }, [uniqueSkus]);

  const prevOpenRef = React.useRef(isColumnManagerOpen);

  useEffect(() => {
    if (isColumnManagerOpen && !prevOpenRef.current) {
      setLocalCategory(categoryFilter);
      setLocalStatus(statusFilter);
      setLocalSku(skuFilter);
      setLocalWarehouse(warehouseFilter);
    }
    prevOpenRef.current = isColumnManagerOpen;
  }, [
    isColumnManagerOpen,
    categoryFilter,
    statusFilter,
    skuFilter,
    warehouseFilter,
  ]);

  const handleClear = () => {
    setLocalWarehouse("ALL");
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
    setWarehouseFilter(localWarehouse);
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
          <Select
            label="SKU"
            labelClassName="font-semibold text-slate-700 mb-1.5"
            options={dynamicSkuOptions}
            value={localSku || "ALL"}
            onChange={(val) => setLocalSku(val)}
          />

          <Select
            label="Category"
            labelClassName="font-semibold text-slate-700 mb-1.5"
            options={CATEGORY_OPTIONS}
            value={localCategory}
            onChange={(val) => setLocalCategory(val)}
          />

          <Select
            label="Stock Status"
            labelClassName="font-semibold text-slate-700 mb-1.5"
            options={STATUS_OPTIONS}
            value={localStatus}
            onChange={(val) => setLocalStatus(val as StockStatus | "ALL")}
          />

          <Select
            label="Warehouse"
            labelClassName="font-semibold text-slate-700 mb-1.5"
            options={WAREHOUSE_OPTIONS}
            value={localWarehouse}
            onChange={(val) => setLocalWarehouse(val)}
          />
        </div>

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
