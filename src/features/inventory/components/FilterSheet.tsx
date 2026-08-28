// Inventory Filters slide-over sheet drawer matching Screenshot 2 using exported constants.
import React, { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Select } from "../../../components/ui/select";
import { useTableUIStore } from "../store/useTableUIStore";
import type { StockStatus } from "../types/inventory.types";
import {
  WAREHOUSE_OPTIONS,
  CATEGORY_OPTIONS,
  SUBCATEGORY_OPTIONS,
  STATUS_OPTIONS,
  LOCATION_DISABLED_OPTIONS,
} from "../constants/filterOptions";
import Drawer from "../../../components/ui/drawer";

export function FilterSheet() {
  const {
    isColumnManagerOpen,
    setIsColumnManagerOpen,
    statusFilter,
    setStatusFilter,
  } = useTableUIStore();

  const [selectedWarehouse, setSelectedWarehouse] = useState<string>("ALL");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<StockStatus | "ALL">(
    statusFilter,
  );

  const handleClear = () => {
    setSelectedWarehouse("ALL");
    setSelectedCategory("ALL");
    setSelectedStatus("ALL");
    setStatusFilter("ALL");
  };

  const handleApply = () => {
    setStatusFilter(selectedStatus);
    setIsColumnManagerOpen(false);
  };

  return (
    <Drawer
      open={isColumnManagerOpen}
      onClose={() => setIsColumnManagerOpen(false)}
      title="Inventory Filters"
    >
      <div className="flex flex-col justify-between h-full space-y-6">
        <div className="space-y-4">
          <Select
            label="Warehouse"
            options={WAREHOUSE_OPTIONS}
            value={selectedWarehouse}
            onChange={(val) => setSelectedWarehouse(val)}
          />

          <Select
            label="Location"
            options={LOCATION_DISABLED_OPTIONS}
            value="NONE"
            disabled
          />

          <Select
            label="Category"
            options={CATEGORY_OPTIONS}
            value={selectedCategory}
            onChange={(val) => setSelectedCategory(val)}
          />

          <Select
            label="Sub Category"
            options={SUBCATEGORY_OPTIONS}
            value="ALL"
          />

          <Select
            label="Stock Status"
            options={STATUS_OPTIONS}
            value={selectedStatus}
            onChange={(val) => setSelectedStatus(val as any)}
          />
        </div>

        {/* Footer Buttons matching Screenshot 2 */}
        <div className="pt-6 border-t border-slate-100 grid grid-cols-2 gap-4 mt-auto">
          <Button
            variant="outline"
            size="md"
            onClick={handleClear}
            className="w-full"
          >
            Clear
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
