import type { InventoryRecord } from "../types/inventory.types";

export interface ColumnMeta {
  field: keyof InventoryRecord;
  label: string;
  group: string;
}

const columnFields: { field: keyof InventoryRecord; label: string }[] = [
  { field: "sku", label: "SKU" },
  { field: "name", label: "Product Name" },
  { field: "barcode", label: "Barcode" },
  { field: "category", label: "Category" },
  { field: "subcategory", label: "Subcategory" },
  { field: "brand", label: "Brand" },
  { field: "status", label: "Stock Status" },
  { field: "warehouse", label: "Warehouse" },
  { field: "qtyOnHand", label: "Qty On Hand" },
  { field: "qtyReserved", label: "Qty Reserved" },
  { field: "qtyAvailable", label: "Qty Available" },
  { field: "reorderPoint", label: "Reorder Pt" },
  { field: "reorderQty", label: "Reorder Qty" },
  { field: "binLocation", label: "Bin Location" },
  { field: "bayNumber", label: "Bay #" },
  { field: "shelfNumber", label: "Shelf #" },
  { field: "totalStockValue", label: "Stock Value" },
  { field: "unitCost", label: "Unit Cost" },
  { field: "listPrice", label: "List Price" },
  { field: "salePrice", label: "Sale Price" },
  { field: "marginPercent", label: "Margin %" },
  { field: "priceTier", label: "Price Tier" },
  { field: "discountPercent", label: "Discount %" },
  { field: "taxRate", label: "Tax Rate %" },
  { field: "supplierName", label: "Supplier Name" },
  { field: "supplierSku", label: "Supplier SKU" },
  { field: "supplierId", label: "Supplier ID" },
  { field: "leadTimeDays", label: "Lead Time" },
  { field: "minOrderQty", label: "Min Order Qty" },
  { field: "lastPurchaseDate", label: "Last Purchase" },
  { field: "unit", label: "Unit" },
  { field: "weightKg", label: "Weight (kg)" },
  { field: "dimensionsCm", label: "Dimensions (cm)" },
  { field: "isPerishable", label: "Perishable" },
  { field: "expiryDate", label: "Expiry Date" },
  { field: "isFragile", label: "Fragile" },
  { field: "hazardClass", label: "Hazard Class" },
  { field: "packageType", label: "Package Type" },
  { field: "countryOfOrigin", label: "Origin" },
  { field: "hsCode", label: "HS Code" },
  { field: "warrantyMonths", label: "Warranty (Mo)" },
  { field: "daysOfSupply", label: "Days of Supply" },
  { field: "isReturnable", label: "Returnable" },
  { field: "handlingInstructions", label: "Handling" },
  { field: "minStorageTempC", label: "Min Temp (°C)" },
  { field: "maxStorageTempC", label: "Max Temp (°C)" },
  { field: "createdAt", label: "Created At" },
  { field: "updatedAt", label: "Updated At" },
  { field: "syncStatus", label: "Sync Status" },
];

export const ALL_COLUMNS_METADATA: ColumnMeta[] = columnFields.map((cfg) => ({
  field: cfg.field,
  label: cfg.label,
  group: [
    "sku",
    "name",
    "barcode",
    "category",
    "subcategory",
    "brand",
  ].includes(cfg.field)
    ? "Identity"
    : [
        "warehouse",
        "qtyOnHand",
        "qtyReserved",
        "qtyAvailable",
        "reorderPoint",
        "reorderQty",
        "binLocation",
        "bayNumber",
        "shelfNumber",
      ].includes(cfg.field)
    ? "Inventory"
    : [
        "totalStockValue",
        "unitCost",
        "listPrice",
        "salePrice",
        "marginPercent",
        "priceTier",
        "discountPercent",
        "taxRate",
      ].includes(cfg.field)
    ? "Pricing"
    : [
        "supplierName",
        "supplierSku",
        "supplierId",
        "leadTimeDays",
        "minOrderQty",
        "lastPurchaseDate",
      ].includes(cfg.field)
    ? "Supplier"
    : "Lifecycle & Audit",
}));

export const ALL_COLUMN_FIELDS = columnFields.map((cfg) => cfg.field);

export const PRESET_FIELDS: Record<string, string[]> = {
  ALL: ALL_COLUMN_FIELDS,
  ESSENTIALS: [
    "sku",
    "name",
    "barcode",
    "category",
    "status",
    "warehouse",
    "qtyOnHand",
    "totalStockValue",
    "unitCost",
    "listPrice",
    "supplierName",
  ],
  INVENTORY: [
    "sku",
    "name",
    "status",
    "warehouse",
    "qtyOnHand",
    "qtyAvailable",
    "qtyReserved",
    "reorderPoint",
    "reorderQty",
    "binLocation",
    "bayNumber",
    "shelfNumber",
  ],
  PRICING: [
    "sku",
    "name",
    "unitCost",
    "listPrice",
    "salePrice",
    "totalStockValue",
    "marginPercent",
    "priceTier",
    "discountPercent",
    "taxRate",
  ],
  SUPPLIER: [
    "sku",
    "name",
    "supplierName",
    "supplierSku",
    "supplierId",
    "leadTimeDays",
    "minOrderQty",
    "lastPurchaseDate",
  ],
};
