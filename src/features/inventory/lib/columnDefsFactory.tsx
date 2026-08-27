// Complete ~50-column AG Grid definition factory with custom cell renderers and tabular number formatting.
import React from 'react';
import type { ColDef } from 'ag-grid-community';
import type { InventoryRecord, StockStatus } from '../types/inventory.types';

// Custom Stock Status Badge Renderer
export function StatusCellRenderer(params: { value: StockStatus }) {
  const status = params.value;
  if (!status) return null;

  const config: Record<StockStatus, { label: string; bg: string; text: string; border: string; dot: string }> = {
    LOW_STOCK: {
      label: 'Low Stock',
      bg: 'rgba(239, 68, 68, 0.15)',
      text: '#f87171',
      border: 'rgba(239, 68, 68, 0.3)',
      dot: '#ef4444',
    },
    HEALTHY: {
      label: 'Healthy',
      bg: 'rgba(16, 185, 129, 0.15)',
      text: '#34d399',
      border: 'rgba(16, 185, 129, 0.3)',
      dot: '#10b981',
    },
    OVERSTOCK: {
      label: 'Overstock',
      bg: 'rgba(59, 130, 246, 0.15)',
      text: '#60a5fa',
      border: 'rgba(59, 130, 246, 0.3)',
      dot: '#3b82f6',
    },
    DISCONTINUED: {
      label: 'Discontinued',
      bg: 'rgba(100, 116, 139, 0.15)',
      text: '#94a3b8',
      border: 'rgba(100, 116, 139, 0.3)',
      dot: '#64748b',
    },
  };

  const style = config[status] || config.HEALTHY;

  return (
    <div
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium border"
      style={{ backgroundColor: style.bg, color: style.text, borderColor: style.border }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: style.dot }} />
      <span>{style.label}</span>
    </div>
  );
}

// Currency Formatter
const formatCurrency = (val: number) => {
  if (val === undefined || val === null) return '-';
  return `$${Number(val).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export function createColumnDefinitions(): ColDef<InventoryRecord>[] {
  return [
    // IDENTITY (4)
    {
      field: 'sku',
      headerName: 'SKU',
      pinned: 'left',
      width: 150,
      cellClass: 'font-mono font-semibold text-amber-400',
    },
    {
      field: 'name',
      headerName: 'Product Name',
      width: 240,
      tooltipField: 'name',
      cellClass: 'font-medium text-slate-100',
    },
    {
      field: 'barcode',
      headerName: 'Barcode',
      width: 140,
      cellClass: 'font-mono text-slate-400 text-xs',
    },
    {
      field: 'category',
      headerName: 'Category',
      width: 160,
    },
    {
      field: 'subcategory',
      headerName: 'Subcategory',
      width: 160,
    },
    {
      field: 'brand',
      headerName: 'Brand',
      width: 150,
    },
    {
      field: 'status',
      headerName: 'Stock Status',
      width: 150,
      cellRenderer: StatusCellRenderer,
    },

    // INVENTORY & LOCATION (8)
    {
      field: 'warehouse',
      headerName: 'Warehouse',
      width: 160,
      cellClass: 'font-semibold text-slate-300',
    },
    {
      field: 'qtyOnHand',
      headerName: 'Qty On Hand',
      width: 130,
      type: 'numericColumn',
      cellClass: 'font-mono tabular-nums text-slate-100 font-bold',
      valueFormatter: (p) => (p.value !== undefined ? p.value.toLocaleString() : '-'),
    },
    {
      field: 'qtyReserved',
      headerName: 'Qty Reserved',
      width: 130,
      type: 'numericColumn',
      cellClass: 'font-mono tabular-nums text-slate-400',
      valueFormatter: (p) => (p.value !== undefined ? p.value.toLocaleString() : '-'),
    },
    {
      field: 'qtyAvailable',
      headerName: 'Qty Available',
      width: 130,
      type: 'numericColumn',
      cellClass: 'font-mono tabular-nums text-emerald-400 font-semibold',
      valueFormatter: (p) => (p.value !== undefined ? p.value.toLocaleString() : '-'),
    },
    {
      field: 'reorderPoint',
      headerName: 'Reorder Pt',
      width: 120,
      type: 'numericColumn',
      cellClass: 'font-mono tabular-nums text-rose-300',
    },
    {
      field: 'reorderQty',
      headerName: 'Reorder Qty',
      width: 120,
      type: 'numericColumn',
      cellClass: 'font-mono tabular-nums',
    },
    {
      field: 'binLocation',
      headerName: 'Bin Location',
      width: 130,
      cellClass: 'font-mono text-xs bg-slate-800/50 text-slate-300 px-2 py-0.5 rounded',
    },
    {
      field: 'bayNumber',
      headerName: 'Bay #',
      width: 100,
      cellClass: 'font-mono text-xs text-slate-400',
    },
    {
      field: 'shelfNumber',
      headerName: 'Shelf #',
      width: 100,
      cellClass: 'font-mono text-xs text-slate-400',
    },

    // PRICING & FINANCIAL (8)
    {
      field: 'totalStockValue',
      headerName: 'Stock Value',
      width: 140,
      type: 'numericColumn',
      cellClass: 'font-mono tabular-nums font-bold text-amber-400',
      valueFormatter: (p) => formatCurrency(p.value),
    },
    {
      field: 'unitCost',
      headerName: 'Unit Cost',
      width: 120,
      type: 'numericColumn',
      cellClass: 'font-mono tabular-nums text-slate-300',
      valueFormatter: (p) => formatCurrency(p.value),
    },
    {
      field: 'listPrice',
      headerName: 'List Price',
      width: 120,
      type: 'numericColumn',
      cellClass: 'font-mono tabular-nums text-slate-300',
      valueFormatter: (p) => formatCurrency(p.value),
    },
    {
      field: 'salePrice',
      headerName: 'Sale Price',
      width: 120,
      type: 'numericColumn',
      cellClass: 'font-mono tabular-nums text-slate-200',
      valueFormatter: (p) => formatCurrency(p.value),
    },
    {
      field: 'marginPercent',
      headerName: 'Margin %',
      width: 110,
      type: 'numericColumn',
      cellClass: 'font-mono tabular-nums text-slate-300',
      valueFormatter: (p) => (p.value !== undefined ? `${p.value}%` : '-'),
    },
    {
      field: 'priceTier',
      headerName: 'Price Tier',
      width: 130,
    },
    {
      field: 'discountPercent',
      headerName: 'Discount %',
      width: 120,
      type: 'numericColumn',
      cellClass: 'font-mono tabular-nums text-slate-400',
      valueFormatter: (p) => (p.value ? `${p.value}%` : '0%'),
    },
    {
      field: 'taxRate',
      headerName: 'Tax Rate %',
      width: 110,
      type: 'numericColumn',
      cellClass: 'font-mono tabular-nums text-slate-400',
      valueFormatter: (p) => (p.value !== undefined ? `${p.value}%` : '0%'),
    },

    // SUPPLIER DETAILS (6)
    {
      field: 'supplierName',
      headerName: 'Supplier Name',
      width: 180,
    },
    {
      field: 'supplierSku',
      headerName: 'Supplier SKU',
      width: 150,
      cellClass: 'font-mono text-slate-400 text-xs',
    },
    {
      field: 'supplierId',
      headerName: 'Supplier ID',
      width: 130,
      cellClass: 'font-mono text-slate-400 text-xs',
    },
    {
      field: 'leadTimeDays',
      headerName: 'Lead Time',
      width: 110,
      type: 'numericColumn',
      cellClass: 'font-mono tabular-nums text-slate-300',
      valueFormatter: (p) => (p.value !== undefined ? `${p.value} d` : '-'),
    },
    {
      field: 'minOrderQty',
      headerName: 'Min Order Qty',
      width: 130,
      type: 'numericColumn',
      cellClass: 'font-mono tabular-nums text-slate-400',
    },
    {
      field: 'lastPurchaseDate',
      headerName: 'Last Purchase',
      width: 140,
      cellClass: 'font-mono text-xs text-slate-400',
    },

    // PHYSICAL & LIFECYCLE (8)
    {
      field: 'unit',
      headerName: 'Unit',
      width: 90,
      cellClass: 'text-xs uppercase text-slate-400 font-semibold',
    },
    {
      field: 'weightKg',
      headerName: 'Weight (kg)',
      width: 120,
      type: 'numericColumn',
      cellClass: 'font-mono tabular-nums text-slate-300',
      valueFormatter: (p) => (p.value !== undefined ? `${p.value} kg` : '-'),
    },
    {
      field: 'dimensionsCm',
      headerName: 'Dimensions (cm)',
      width: 140,
      cellClass: 'font-mono text-xs text-slate-400',
    },
    {
      field: 'isPerishable',
      headerName: 'Perishable',
      width: 110,
      valueFormatter: (p) => (p.value ? 'Yes' : 'No'),
      cellClass: (p) => (p.value ? 'text-rose-400 font-semibold' : 'text-slate-500'),
    },
    {
      field: 'expiryDate',
      headerName: 'Expiry Date',
      width: 130,
      cellClass: 'font-mono text-xs text-slate-400',
      valueFormatter: (p) => p.value || 'N/A',
    },
    {
      field: 'isFragile',
      headerName: 'Fragile',
      width: 100,
      valueFormatter: (p) => (p.value ? 'Yes' : 'No'),
      cellClass: (p) => (p.value ? 'text-amber-400 font-semibold' : 'text-slate-500'),
    },
    {
      field: 'hazardClass',
      headerName: 'Hazard Class',
      width: 140,
      cellClass: 'text-xs text-slate-400',
    },
    {
      field: 'packageType',
      headerName: 'Package Type',
      width: 130,
    },

    // EXTRA ATTRIBUTES & AUDIT (10)
    {
      field: 'countryOfOrigin',
      headerName: 'Origin',
      width: 120,
    },
    {
      field: 'hsCode',
      headerName: 'HS Code',
      width: 120,
      cellClass: 'font-mono text-xs text-slate-400',
    },
    {
      field: 'warrantyMonths',
      headerName: 'Warranty (Mo)',
      width: 130,
      type: 'numericColumn',
      cellClass: 'font-mono tabular-nums text-slate-400',
      valueFormatter: (p) => (p.value ? `${p.value} mo` : 'None'),
    },
    {
      field: 'daysOfSupply',
      headerName: 'Days of Supply',
      width: 140,
      type: 'numericColumn',
      cellClass: 'font-mono tabular-nums text-slate-300 font-medium',
      valueFormatter: (p) => (p.value ? `${p.value} days` : '-'),
    },
    {
      field: 'isReturnable',
      headerName: 'Returnable',
      width: 110,
      valueFormatter: (p) => (p.value ? 'Yes' : 'No'),
    },
    {
      field: 'handlingInstructions',
      headerName: 'Handling',
      width: 160,
      cellClass: 'text-xs text-slate-400',
    },
    {
      field: 'minStorageTempC',
      headerName: 'Min Temp (°C)',
      width: 130,
      type: 'numericColumn',
      cellClass: 'font-mono tabular-nums text-slate-400',
      valueFormatter: (p) => (p.value !== undefined ? `${p.value}°C` : '-'),
    },
    {
      field: 'maxStorageTempC',
      headerName: 'Max Temp (°C)',
      width: 130,
      type: 'numericColumn',
      cellClass: 'font-mono tabular-nums text-slate-400',
      valueFormatter: (p) => (p.value !== undefined ? `${p.value}°C` : '-'),
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      width: 150,
      cellClass: 'font-mono text-xs text-slate-500',
      valueFormatter: (p) => (p.value ? p.value.split('T')[0] : '-'),
    },
    {
      field: 'updatedAt',
      headerName: 'Updated At',
      width: 150,
      cellClass: 'font-mono text-xs text-slate-500',
      valueFormatter: (p) => (p.value ? p.value.split('T')[0] : '-'),
    },
    {
      field: 'syncStatus',
      headerName: 'Sync Status',
      width: 120,
      cellClass: (p) => (p.value === 'Synced' ? 'text-emerald-400 text-xs font-semibold' : 'text-amber-400 text-xs font-semibold'),
    },
  ];
}
