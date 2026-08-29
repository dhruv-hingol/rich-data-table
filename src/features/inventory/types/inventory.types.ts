export type StockStatus = 'LOW_STOCK' | 'HEALTHY' | 'OVERSTOCK' | 'DISCONTINUED';

export interface InventoryRecord {
  id: string;
  sku: string;
  name: string;
  barcode: string;
  category: string;

  subcategory: string;
  brand: string;
  tags: string[];
  variant: string;
  unit: string;

  warehouse: string;
  qtyOnHand: number;
  qtyReserved: number;
  qtyAvailable: number; 
  reorderPoint: number;
  reorderQty: number;
  binLocation: string;

  unitCost: number;
  listPrice: number;
  salePrice: number;
  marginPercent: number; 
  taxRate: number;
  discountPercent: number;
  priceTier: 'Standard' | 'Wholesale' | 'VIP' | 'Clearance';

  supplierId: string;
  supplierName: string;
  supplierSku: string;
  leadTimeDays: number;
  minOrderQty: number;
  lastPurchaseDate: string;

  status: StockStatus; 
  isPerishable: boolean;
  expiryDate: string | null;
  weightKg: number;
  dimensionsCm: string; 
  isFragile: boolean;
  hazardClass: string;

  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  lastSoldAt: string;
  syncStatus: 'Synced' | 'Pending' | 'Conflict';

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
  value: unknown;
}

export interface GetRecordsParams {
  page: number;
  pageSize: number;
  sortBy?: keyof InventoryRecord;
  sortDir?: 'asc' | 'desc';
  search?: string;
  filters?: ColumnFilterValue[];
  statusFilter?: StockStatus | 'ALL';
  warehouseFilter?: string;
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
