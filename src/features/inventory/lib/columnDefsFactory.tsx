/* eslint-disable react-refresh/only-export-components */
import type { ColDef, CellClassParams, ValueFormatterParams } from "ag-grid-community";
import { useNavigate } from "react-router-dom";
import type { InventoryRecord, StockStatus } from "../types/inventory.types";

export function SkuCellRenderer(params: {
  value: string;
  data?: InventoryRecord;
}) {
  const navigate = useNavigate();
  const sku = params.value;
  const id = params.data?.id;

  if (!id) return <span className="font-semibold text-[#ff6600]">{sku}</span>;

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        navigate(`/inventory/${id}`);
      }}
      className="font-semibold text-[#ff6600] hover:underline hover:text-[#e55c00] cursor-pointer inline-flex items-center gap-1 group text-left whitespace-nowrap"
      title={`Click to edit SKU ${sku}`}
    >
      <span>{sku}</span>
    </button>
  );
}

export function StatusCellRenderer(params: { value: StockStatus }) {
  const status = params.value;
  if (!status) return null;

  const config: Record<
    StockStatus,
    { label: string; bg: string; text: string; border: string; dot: string }
  > = {
    LOW_STOCK: {
      label: "Low Stock",
      bg: "rgba(239, 68, 68, 0.12)",
      text: "#dc2626",
      border: "rgba(239, 68, 68, 0.25)",
      dot: "#ef4444",
    },
    HEALTHY: {
      label: "Healthy",
      bg: "rgba(16, 185, 129, 0.12)",
      text: "#059669",
      border: "rgba(16, 185, 129, 0.25)",
      dot: "#10b981",
    },
    OVERSTOCK: {
      label: "Overstock",
      bg: "rgba(59, 130, 246, 0.12)",
      text: "#2563eb",
      border: "rgba(59, 130, 246, 0.25)",
      dot: "#3b82f6",
    },
    DISCONTINUED: {
      label: "Discontinued",
      bg: "rgba(100, 116, 139, 0.12)",
      text: "#475569",
      border: "rgba(100, 116, 139, 0.25)",
      dot: "#64748b",
    },
  };

  const style = config[status] || config.HEALTHY;

  return (
    <div
      className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-semibold border whitespace-nowrap shrink-0"
      style={{
        backgroundColor: style.bg,
        color: style.text,
        borderColor: style.border,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ backgroundColor: style.dot }}
      />
      <span className="whitespace-nowrap">{style.label}</span>
    </div>
  );
}

// Custom Returnable Status Badge Renderer (No truncation)
export function ReturnableCellRenderer(params: { value?: boolean }) {
  const isReturnable = Boolean(params.value);
  return (
    <div
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold border whitespace-nowrap shrink-0 ${
        isReturnable
          ? "bg-emerald-50 text-emerald-700 border-emerald-200/80"
          : "bg-slate-100 text-slate-600 border-slate-200/80 font-medium"
      }`}
    >
      <span className="whitespace-nowrap">
        {isReturnable ? "✓ Returnable" : "✕ Non-Returnable"}
      </span>
    </div>
  );
}

// Custom Fragile Status Badge Renderer (No truncation)
export function FragileCellRenderer(params: { value?: boolean }) {
  const isFragile = Boolean(params.value);
  return (
    <div
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold border whitespace-nowrap shrink-0 ${
        isFragile
          ? "bg-amber-50 text-amber-700 border-amber-200/80"
          : "bg-slate-100 text-slate-600 border-slate-200/80 font-medium"
      }`}
    >
      <span className="whitespace-nowrap">
        {isFragile ? "⚠️ Fragile" : "🛡️ Standard"}
      </span>
    </div>
  );
}

// Custom Perishable Status Badge Renderer (No truncation)
export function PerishableCellRenderer(params: { value?: boolean }) {
  const isPerishable = Boolean(params.value);
  return (
    <div
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold border whitespace-nowrap shrink-0 ${
        isPerishable
          ? "bg-rose-50 text-rose-700 border-rose-200/80"
          : "bg-slate-100 text-slate-600 border-slate-200/80 font-medium"
      }`}
    >
      <span className="whitespace-nowrap">
        {isPerishable ? "❄️ Perishable" : "📦 Non-Perishable"}
      </span>
    </div>
  );
}

// Indian Rupee Currency Formatter (₹ INR)
const formatCurrency = (val: number) => {
  if (val === undefined || val === null) return "-";
  return `₹${Number(val).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

interface ColumnConfig {
  field: keyof InventoryRecord;
  headerName?: string;
  width?: number;
  minWidth?: number;
  pinned?: "left" | "right";
  type?: string;
  cellClass?: string | ((params: CellClassParams<InventoryRecord>) => string);
  cellRenderer?: unknown;
  valueFormatter?: (params: ValueFormatterParams<InventoryRecord>) => string;
  tooltipField?: keyof InventoryRecord;
}

const columnConfigs: ColumnConfig[] = [
  // IDENTITY (7)
  {
    field: "sku",
    headerName: "SKU",
    pinned: "left",
    width: 160,
    minWidth: 140,
    cellRenderer: SkuCellRenderer,
  },
  {
    field: "name",
    headerName: "Product Name",
    width: 240,
    minWidth: 180,
    tooltipField: "name",
    cellClass: "font-medium text-slate-900",
  },
  {
    field: "barcode",
    headerName: "Barcode",
    width: 140,
    cellClass: "text-slate-600 text-xs",
  },
  { field: "category", headerName: "Category", width: 160 },
  { field: "subcategory", headerName: "Subcategory", width: 160 },
  { field: "brand", headerName: "Brand", width: 150 },
  {
    field: "status",
    headerName: "Stock Status",
    width: 160,
    minWidth: 140,
    cellRenderer: StatusCellRenderer,
  },

  // INVENTORY & LOCATION (9)
  {
    field: "warehouse",
    headerName: "Warehouse",
    width: 160,
    cellClass: "font-semibold text-slate-800",
  },
  {
    field: "qtyOnHand",
    headerName: "Qty On Hand",
    width: 130,
    type: "numericColumn",
    cellClass: "tabular-nums text-slate-900 font-bold",
    valueFormatter: (p) =>
      p.value !== undefined ? p.value.toLocaleString() : "-",
  },
  {
    field: "qtyReserved",
    headerName: "Qty Reserved",
    width: 130,
    type: "numericColumn",
    cellClass: "tabular-nums text-slate-600",
    valueFormatter: (p) =>
      p.value !== undefined ? p.value.toLocaleString() : "-",
  },
  {
    field: "qtyAvailable",
    headerName: "Qty Available",
    width: 130,
    type: "numericColumn",
    cellClass: "tabular-nums text-emerald-700 font-semibold",
    valueFormatter: (p) =>
      p.value !== undefined ? p.value.toLocaleString() : "-",
  },
  {
    field: "reorderPoint",
    headerName: "Reorder Pt",
    width: 120,
    type: "numericColumn",
    cellClass: "tabular-nums text-rose-600",
  },
  {
    field: "reorderQty",
    headerName: "Reorder Qty",
    width: 120,
    type: "numericColumn",
    cellClass: "tabular-nums text-slate-700",
  },
  {
    field: "binLocation",
    headerName: "Bin Location",
    width: 130,
    cellClass: "text-xs text-slate-700 bg-white font-medium",
  },
  {
    field: "bayNumber",
    headerName: "Bay #",
    width: 100,
    cellClass: "text-xs text-slate-600",
  },
  {
    field: "shelfNumber",
    headerName: "Shelf #",
    width: 100,
    cellClass: "text-xs text-slate-600",
  },

  // PRICING & FINANCIAL (8)
  {
    field: "totalStockValue",
    headerName: "Stock Value",
    width: 140,
    type: "numericColumn",
    cellClass: "tabular-nums font-bold text-[#ff6600]",
    valueFormatter: (p) => formatCurrency(p.value),
  },
  {
    field: "unitCost",
    headerName: "Unit Cost",
    width: 120,
    type: "numericColumn",
    cellClass: "tabular-nums text-slate-700",
    valueFormatter: (p) => formatCurrency(p.value),
  },
  {
    field: "listPrice",
    headerName: "List Price",
    width: 120,
    type: "numericColumn",
    cellClass: "tabular-nums text-slate-700",
    valueFormatter: (p) => formatCurrency(p.value),
  },
  {
    field: "salePrice",
    headerName: "Sale Price",
    width: 120,
    type: "numericColumn",
    cellClass: "tabular-nums text-slate-800",
    valueFormatter: (p) => formatCurrency(p.value),
  },
  {
    field: "marginPercent",
    headerName: "Margin %",
    width: 110,
    type: "numericColumn",
    cellClass: "tabular-nums text-slate-700",
    valueFormatter: (p) => (p.value !== undefined ? `${p.value}%` : "-"),
  },
  { field: "priceTier", headerName: "Price Tier", width: 130 },
  {
    field: "discountPercent",
    headerName: "Discount %",
    width: 120,
    type: "numericColumn",
    cellClass: "tabular-nums text-slate-600",
    valueFormatter: (p) => (p.value ? `${p.value}%` : "0%"),
  },
  {
    field: "taxRate",
    headerName: "Tax Rate %",
    width: 110,
    type: "numericColumn",
    cellClass: "tabular-nums text-slate-600",
    valueFormatter: (p) => (p.value !== undefined ? `${p.value}%` : "0%"),
  },

  // SUPPLIER DETAILS (6)
  { field: "supplierName", headerName: "Supplier Name", width: 180 },
  {
    field: "supplierSku",
    headerName: "Supplier SKU",
    width: 150,
    cellClass: "text-slate-600 text-xs",
  },
  {
    field: "supplierId",
    headerName: "Supplier ID",
    width: 130,
    cellClass: "text-slate-600 text-xs",
  },
  {
    field: "leadTimeDays",
    headerName: "Lead Time",
    width: 110,
    type: "numericColumn",
    cellClass: "tabular-nums text-slate-700",
    valueFormatter: (p) => (p.value !== undefined ? `${p.value} d` : "-"),
  },
  {
    field: "minOrderQty",
    headerName: "Min Order Qty",
    width: 130,
    type: "numericColumn",
    cellClass: "tabular-nums text-slate-600",
  },
  {
    field: "lastPurchaseDate",
    headerName: "Last Purchase",
    width: 140,
    cellClass: "text-xs text-slate-600",
  },

  // PHYSICAL & LIFECYCLE (8)
  {
    field: "unit",
    headerName: "Unit",
    width: 90,
    cellClass: "text-xs uppercase text-slate-600 font-semibold",
  },
  {
    field: "weightKg",
    headerName: "Weight (kg)",
    width: 120,
    type: "numericColumn",
    cellClass: "tabular-nums text-slate-700",
    valueFormatter: (p) => (p.value !== undefined ? `${p.value} kg` : "-"),
  },
  {
    field: "dimensionsCm",
    headerName: "Dimensions (cm)",
    width: 140,
    cellClass: "text-xs text-slate-600",
  },
  {
    field: "isPerishable",
    headerName: "Perishable",
    width: 160,
    minWidth: 140,
    cellRenderer: PerishableCellRenderer,
  },
  {
    field: "expiryDate",
    headerName: "Expiry Date",
    width: 130,
    cellClass: "text-xs text-slate-600",
    valueFormatter: (p) => p.value || "N/A",
  },
  {
    field: "isFragile",
    headerName: "Fragile",
    width: 150,
    minWidth: 130,
    cellRenderer: FragileCellRenderer,
  },
  {
    field: "hazardClass",
    headerName: "Hazard Class",
    width: 140,
    cellClass: "text-xs text-slate-600",
  },
  { field: "packageType", headerName: "Package Type", width: 130 },

  // EXTRA ATTRIBUTES & AUDIT (11)
  { field: "countryOfOrigin", headerName: "Origin", width: 120 },
  {
    field: "hsCode",
    headerName: "HS Code",
    width: 120,
    cellClass: "text-xs text-slate-600",
  },
  {
    field: "warrantyMonths",
    headerName: "Warranty (Mo)",
    width: 130,
    type: "numericColumn",
    cellClass: "tabular-nums text-slate-600",
    valueFormatter: (p) => (p.value ? `${p.value} mo` : "None"),
  },
  {
    field: "daysOfSupply",
    headerName: "Days of Supply",
    width: 140,
    type: "numericColumn",
    cellClass: "tabular-nums text-slate-700 font-medium",
    valueFormatter: (p) => (p.value ? `${p.value} days` : "-"),
  },
  {
    field: "isReturnable",
    headerName: "Returnable",
    width: 160,
    minWidth: 140,
    cellRenderer: ReturnableCellRenderer,
  },
  {
    field: "handlingInstructions",
    headerName: "Handling",
    width: 160,
    cellClass: "text-xs text-slate-600",
  },
  {
    field: "minStorageTempC",
    headerName: "Min Temp (°C)",
    width: 130,
    type: "numericColumn",
    cellClass: "tabular-nums text-slate-600",
    valueFormatter: (p) => (p.value !== undefined ? `${p.value}°C` : "-"),
  },
  {
    field: "maxStorageTempC",
    headerName: "Max Temp (°C)",
    width: 130,
    type: "numericColumn",
    cellClass: "tabular-nums text-slate-600",
    valueFormatter: (p) => (p.value !== undefined ? `${p.value}°C` : "-"),
  },
  {
    field: "createdAt",
    headerName: "Created At",
    width: 150,
    cellClass: "text-xs text-slate-600",
    valueFormatter: (p) => (p.value ? p.value.split("T")[0] : "-"),
  },
  {
    field: "updatedAt",
    headerName: "Updated At",
    width: 150,
    cellClass: "text-xs text-slate-600",
    valueFormatter: (p) => (p.value ? p.value.split("T")[0] : "-"),
  },
  {
    field: "syncStatus",
    headerName: "Sync Status",
    width: 120,
    cellClass: (p) =>
      p.value === "Synced"
        ? "text-emerald-700 text-xs font-semibold"
        : "text-amber-700 text-xs font-semibold",
  },
];

export interface ColumnMeta {
  field: keyof InventoryRecord;
  label: string;
  group: string;
}

export const ALL_COLUMNS_METADATA: ColumnMeta[] = columnConfigs.map((cfg) => ({
  field: cfg.field,
  label: cfg.headerName || String(cfg.field),
  group:
    ["sku", "name", "barcode", "category", "subcategory", "brand"].includes(cfg.field)
      ? "Identity"
      : ["warehouse", "qtyOnHand", "qtyReserved", "qtyAvailable", "reorderPoint", "reorderQty", "binLocation", "bayNumber", "shelfNumber"].includes(cfg.field)
      ? "Inventory"
      : ["totalStockValue", "unitCost", "listPrice", "salePrice", "marginPercent", "priceTier", "discountPercent", "taxRate"].includes(cfg.field)
      ? "Pricing"
      : ["supplierName", "supplierSku", "supplierId", "leadTimeDays", "minOrderQty", "lastPurchaseDate"].includes(cfg.field)
      ? "Supplier"
      : "Lifecycle & Audit",
}));

export const ALL_COLUMN_FIELDS = columnConfigs.map((cfg) => cfg.field);

export const PRESET_FIELDS: Record<string, string[]> = {
  ALL: ALL_COLUMN_FIELDS,
  ESSENTIALS: ["sku", "name", "barcode", "category", "status", "warehouse", "qtyOnHand", "totalStockValue", "unitCost", "listPrice", "supplierName"],
  INVENTORY: ["sku", "name", "status", "warehouse", "qtyOnHand", "qtyAvailable", "qtyReserved", "reorderPoint", "reorderQty", "binLocation", "bayNumber", "shelfNumber"],
  PRICING: ["sku", "name", "unitCost", "listPrice", "salePrice", "totalStockValue", "marginPercent", "priceTier", "discountPercent", "taxRate"],
  SUPPLIER: ["sku", "name", "supplierName", "supplierSku", "supplierId", "leadTimeDays", "minOrderQty", "lastPurchaseDate"],
};

export function createColumnDefinitions(visibleColumns?: string[]): ColDef<InventoryRecord>[] {
  return columnConfigs.map((cfg) => {
    const colDef: ColDef<InventoryRecord> = {
      field: cfg.field,
      headerName: cfg.headerName || String(cfg.field),
      width: cfg.width || 400,
    };

    if (visibleColumns && visibleColumns.length > 0) {
      colDef.hide = !visibleColumns.includes(cfg.field);
    }

    if (cfg.minWidth !== undefined) colDef.minWidth = cfg.minWidth;
    if (cfg.pinned !== undefined) colDef.pinned = cfg.pinned;
    if (cfg.type !== undefined) colDef.type = cfg.type;
    if (cfg.cellClass !== undefined) colDef.cellClass = cfg.cellClass;
    if (cfg.cellRenderer !== undefined) colDef.cellRenderer = cfg.cellRenderer;
    if (cfg.valueFormatter !== undefined)
      colDef.valueFormatter = cfg.valueFormatter;
    if (cfg.tooltipField !== undefined) colDef.tooltipField = cfg.tooltipField;

    return colDef;
  });
}
