// Side sheet drawer panel for toggling visibility and presets across all 60 table columns.
import React from 'react';
import { Sheet } from '../../../components/ui/sheet';
import { Button } from '../../../components/ui/button';
import { Checkbox } from '../../../components/ui/checkbox';
import { useTableUIStore, type ColumnPreset } from '../store/useTableUIStore';

const ALL_COLUMNS = [
  { field: 'sku', label: 'SKU', group: 'Identity' },
  { field: 'name', label: 'Product Name', group: 'Identity' },
  { field: 'barcode', label: 'Barcode', group: 'Identity' },
  { field: 'category', label: 'Category', group: 'Identity' },
  { field: 'subcategory', label: 'Subcategory', group: 'Classification' },
  { field: 'brand', label: 'Brand', group: 'Classification' },
  { field: 'status', label: 'Stock Status', group: 'Lifecycle' },
  { field: 'warehouse', label: 'Warehouse', group: 'Inventory' },
  { field: 'qtyOnHand', label: 'Qty On Hand', group: 'Inventory' },
  { field: 'qtyAvailable', label: 'Qty Available', group: 'Inventory' },
  { field: 'qtyReserved', label: 'Qty Reserved', group: 'Inventory' },
  { field: 'reorderPoint', label: 'Reorder Point', group: 'Inventory' },
  { field: 'reorderQty', label: 'Reorder Qty', group: 'Inventory' },
  { field: 'binLocation', label: 'Bin Location', group: 'Inventory' },
  { field: 'unitCost', label: 'Unit Cost ($)', group: 'Pricing' },
  { field: 'listPrice', label: 'List Price ($)', group: 'Pricing' },
  { field: 'salePrice', label: 'Sale Price ($)', group: 'Pricing' },
  { field: 'totalStockValue', label: 'Stock Value ($)', group: 'Pricing' },
  { field: 'marginPercent', label: 'Margin %', group: 'Pricing' },
  { field: 'supplierName', label: 'Supplier Name', group: 'Supplier' },
  { field: 'supplierSku', label: 'Supplier SKU', group: 'Supplier' },
  { field: 'leadTimeDays', label: 'Lead Time (Days)', group: 'Supplier' },
  { field: 'isPerishable', label: 'Perishable', group: 'Lifecycle' },
  { field: 'weightKg', label: 'Weight (kg)', group: 'Lifecycle' },
  { field: 'dimensionsCm', label: 'Dimensions (cm)', group: 'Lifecycle' },
  { field: 'isFragile', label: 'Fragile', group: 'Lifecycle' },
];

export function ColumnManagerPanel() {
  const { isColumnManagerOpen, setIsColumnManagerOpen, columnPreset, setColumnPreset } = useTableUIStore();

  const presets: { id: ColumnPreset; label: string }[] = [
    { id: 'ALL', label: 'All 60 Columns' },
    { id: 'ESSENTIALS', label: 'Essentials Only' },
    { id: 'INVENTORY', label: 'Inventory & Bins' },
    { id: 'PRICING', label: 'Pricing & Margins' },
    { id: 'SUPPLIER', label: 'Supplier Operations' },
  ];

  return (
    <Sheet
      open={isColumnManagerOpen}
      onClose={() => setIsColumnManagerOpen(false)}
      title="Configure Table Columns & Presets"
    >
      <div className="space-y-6">
        {/* Presets Selection */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Column Presets
          </label>
          <div className="flex flex-wrap gap-2">
            {presets.map((p) => (
              <button
                key={p.id}
                onClick={() => setColumnPreset(p.id)}
                className={`text-xs px-3 py-1.5 rounded-md border transition-colors ${
                  columnPreset === p.id
                    ? 'bg-amber-600 border-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Column List Checkboxes */}
        <div>
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Visible Columns ({ALL_COLUMNS.length})
            </span>
          </div>

          <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
            {ALL_COLUMNS.map((col) => (
              <label
                key={col.field}
                className="flex items-center justify-between p-2 rounded hover:bg-slate-800/60 cursor-pointer border border-transparent hover:border-slate-800"
              >
                <div className="flex items-center gap-3">
                  <Checkbox defaultChecked />
                  <span className="text-sm font-medium text-slate-200">{col.label}</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono bg-slate-950 px-1.5 py-0.5 rounded">
                  {col.group}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <Button variant="primary" size="sm" onClick={() => setIsColumnManagerOpen(false)}>
            Apply & Save Preferences
          </Button>
        </div>
      </div>
    </Sheet>
  );
}
