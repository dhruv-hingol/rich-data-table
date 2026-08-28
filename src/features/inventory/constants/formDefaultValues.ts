// Default empty form state constant and section tabs configuration for Inventory Record creation/editing.
import type { RecordSchemaInput } from '../lib/recordSchema';

export interface FormTabItem {
  id: string;
  label: string;
}

export const RECORD_FORM_TABS: FormTabItem[] = [
  { id: 'sec-details', label: 'Product Details' },
  { id: 'sec-inventory', label: 'Stock & Location' },
  { id: 'sec-pricing', label: 'Pricing & Financial' },
  { id: 'sec-supplier', label: 'Supplier Info' },
  { id: 'sec-physical', label: 'Physical Specs' },
];

export const DEFAULT_RECORD_FORM_VALUES: RecordSchemaInput = {
  sku: '',
  name: '',
  barcode: '',
  category: 'Electronics',
  subcategory: 'Sensors',
  brand: '',
  tags: [],
  variant: 'Standard',
  unit: 'pcs',
  warehouse: 'WH-NORTH-01',
  qtyOnHand: 0,
  qtyReserved: 0,
  reorderPoint: 0,
  reorderQty: 10,
  binLocation: '',
  unitCost: 0,
  listPrice: 0,
  salePrice: 0,
  taxRate: 0,
  discountPercent: 0,
  priceTier: 'Standard',
  supplierId: '',
  supplierName: '',
  supplierSku: '',
  leadTimeDays: 7,
  minOrderQty: 1,
  lastPurchaseDate: new Date().toISOString().split('T')[0],
  status: 'HEALTHY',
  isPerishable: false,
  expiryDate: null,
  weightKg: 0,
  dimensionsCm: '',
  isFragile: false,
  hazardClass: 'None',
  bayNumber: '',
  shelfNumber: '',
  countryOfOrigin: '',
  hsCode: '',
  warrantyMonths: 0,
  packageType: '',
  handlingInstructions: '',
  isReturnable: true,
  minStorageTempC: 0,
  maxStorageTempC: 0,
  createdBy: 'User',
  updatedBy: 'User',
  syncStatus: 'Synced',
};
