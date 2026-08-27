// TypeScript domain type definitions for the inventory record schema and mock API contracts.

export type StockStatus = 'LOW_STOCK' | 'HEALTHY' | 'OVERSTOCK' | 'DISCONTINUED';

export interface InventoryRecord {
  // Identity (4)
  id: string;
  sku: string;
  name: string;
  barcode: string;
  category: string;

  // Classification (5)
  subcategory: string;
  brand: string;
  tags: string[];
  variant: string;
  unit: string;

  // Inventory & Stock (5)
  warehouse: string;
  qtyOnHand: number;
  qtyReserved: number;
  qtyAvailable: number; // Derived: qtyOnHand - qtyReserved
  reorderPoint: number;
  reorderQty: number;
  binLocation: string;

  // Pricing & Value (7)
  unitCost: number;
  listPrice: number;
  salePrice: number;
  marginPercent: number; // Derived: ((listPrice - unitCost) / listPrice) * 100
  taxRate: number;
  discountPercent: number;
  priceTier: 'Standard' | 'Wholesale' | 'VIP' | 'Clearance';

  // Supplier Details (6)
  supplierId: string;
  supplierName: string;
  supplierSku: string;
  leadTimeDays: number;
  minOrderQty: number;
  lastPurchaseDate: string;

  // Lifecycle & Physical (7)
  status: StockStatus; // Driven by stock rules or manual setting
  isPerishable: boolean;
  expiryDate: string | null;
  weightKg: number;
  dimensionsCm: string; // e.g. "20x15x10"
  isFragile: boolean;
  hazardClass: string;

  // Audit (6)
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  lastSoldAt: string;
  syncStatus: 'Synced' | 'Pending' | 'Conflict';

  // Extra Granular Attributes to reach ~50 fields (10)
  bayNumber: string;
  shelfNumber: string;
  countryOfOrigin: string;
  hsCode: string;
  warrantyMonths: number;
  packageType: string;
  handlingInstructions: string;
  isReturnable: boolean;
  minStorageTempC: number;
  maxStorageTempC: number;

  // Derived / Computed properties (calculated client/server side)
  totalStockValue: number; // qtyOnHand * unitCost
  daysOfSupply: number;    // qtyOnHand / average daily burn rate estimate
  isLowStock: boolean;     // qtyOnHand <= reorderPoint
}

export interface ColumnFilterValue {
  field: keyof InventoryRecord;
  operator: 'equals' | 'contains' | 'gt' | 'gte' | 'lt' | 'lte' | 'in';
  value: any;
}

export interface GetRecordsParams {
  page: number;
  pageSize: number;
  sortBy?: keyof InventoryRecord;
  sortDir?: 'asc' | 'desc';
  search?: string;
  filters?: ColumnFilterValue[];
  statusFilter?: StockStatus | 'ALL';
}

export interface PaginatedResponse<T> {
  rows: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  statusCounts: {
    LOW_STOCK: number;
    HEALTHY: number;
    OVERSTOCK: number;
    DISCONTINUED: number;
    ALL: number;
  };
}

export type CreateInventoryRecordPayload = Omit<
  InventoryRecord,
  'id' | 'createdAt' | 'updatedAt' | 'qtyAvailable' | 'marginPercent' | 'totalStockValue' | 'daysOfSupply' | 'isLowStock'
>;

export type UpdateInventoryRecordPayload = Partial<CreateInventoryRecordPayload>;
