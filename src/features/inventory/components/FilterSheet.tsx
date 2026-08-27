// Inventory Filters slide-over sheet drawer matching Screenshot 2.
import React, { useState } from 'react';
import { Sheet } from '../../../components/ui/sheet';
import { Button } from '../../../components/ui/button';
import { Select } from '../../../components/ui/select';
import { useTableUIStore } from '../store/useTableUIStore';
import type { StockStatus } from '../types/inventory.types';

export function FilterSheet() {
  const { isColumnManagerOpen, setIsColumnManagerOpen, statusFilter, setStatusFilter } = useTableUIStore();

  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<StockStatus | 'ALL'>(statusFilter);

  const handleClear = () => {
    setSelectedWarehouse('ALL');
    setSelectedCategory('ALL');
    setSelectedStatus('ALL');
    setStatusFilter('ALL');
  };

  const handleApply = () => {
    setStatusFilter(selectedStatus);
    setIsColumnManagerOpen(false);
  };

  return (
    <Sheet
      open={isColumnManagerOpen}
      onClose={() => setIsColumnManagerOpen(false)}
      title="Inventory Filters"
    >
      <div className="flex flex-col justify-between h-full space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">Warehouse</label>
            <Select value={selectedWarehouse} onChange={(e) => setSelectedWarehouse(e.target.value)}>
              <option value="ALL">Select warehouse</option>
              <option value="WH-NORTH-01">WH-NORTH-01</option>
              <option value="WH-SOUTH-02">WH-SOUTH-02</option>
              <option value="WH-EAST-05">WH-EAST-05</option>
              <option value="WH-WEST-09">WH-WEST-09</option>
            </Select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">Location</label>
            <Select disabled className="bg-slate-100 text-slate-400">
              <option>Select warehouse first</option>
            </Select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">Category</label>
            <Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
              <option value="ALL">Select category</option>
              <option value="Electronics">Electronics</option>
              <option value="Industrial Hardware">Industrial Hardware</option>
              <option value="Safety Equipment">Safety Equipment</option>
              <option value="Packaging Materials">Packaging Materials</option>
            </Select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">Sub Category</label>
            <Select>
              <option value="ALL">Select sub category</option>
              <option value="Sensors">Sensors</option>
              <option value="Microcontrollers">Microcontrollers</option>
              <option value="Bearings">Bearings</option>
            </Select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">Stock Status</label>
            <Select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value as any)}>
              <option value="ALL">Select stock status</option>
              <option value="LOW_STOCK">Low Stock Alert</option>
              <option value="HEALTHY">Healthy Stock</option>
              <option value="OVERSTOCK">Overstock</option>
              <option value="DISCONTINUED">Discontinued</option>
            </Select>
          </div>
        </div>

        {/* Footer Buttons matching Screenshot 2 */}
        <div className="pt-6 border-t border-slate-100 grid grid-cols-2 gap-4 mt-auto">
          <Button variant="outline" size="md" onClick={handleClear} className="w-full">
            Clear
          </Button>
          <Button variant="primary" size="md" onClick={handleApply} className="w-full bg-[#ff6600]">
            Show Results
          </Button>
        </div>
      </div>
    </Sheet>
  );
}
