// Zod validation schema for single InventoryRecord creation and CSV row validation.
import { z } from 'zod';

export const stockStatusSchema = z.enum(['LOW_STOCK', 'HEALTHY', 'OVERSTOCK', 'DISCONTINUED']);

export const recordSchema = z.object({
  sku: z
    .string()
    .min(3, 'SKU must be at least 3 characters')
    .max(30, 'SKU cannot exceed 30 characters')
    .regex(/^[A-Z0-9_-]+$/, 'SKU must contain uppercase letters, numbers, hyphens, or underscores'),
  name: z.string().min(2, 'Product name is required').max(120, 'Product name is too long'),
  barcode: z.string().min(8, 'Barcode must be at least 8 digits'),
  category: z.string().min(2, 'Category is required'),
  subcategory: z.string().min(2, 'Subcategory is required'),
  brand: z.string().min(1, 'Brand is required'),
  tags: z.array(z.string()).or(z.string().transform((val) => val.split(',').map((t) => t.trim()).filter(Boolean))),
  variant: z.string().default('Default'),
  unit: z.string().default('pcs'),

  warehouse: z.string().min(2, 'Warehouse location is required'),
  qtyOnHand: z.coerce.number().int('Qty on hand must be an integer').min(0, 'Qty on hand cannot be negative'),
  qtyReserved: z.coerce.number().int('Qty reserved must be an integer').min(0, 'Qty reserved cannot be negative'),
  reorderPoint: z.coerce.number().int('Reorder point must be an integer').min(0, 'Reorder point cannot be negative'),
  reorderQty: z.coerce.number().int('Reorder qty must be an integer').min(1, 'Reorder qty must be at least 1'),
  binLocation: z.string().min(1, 'Bin location is required'),

  unitCost: z.coerce.number().min(0, 'Unit cost cannot be negative'),
  listPrice: z.coerce.number().min(0, 'List price cannot be negative'),
  salePrice: z.coerce.number().min(0, 'Sale price cannot be negative'),
  taxRate: z.coerce.number().min(0).max(100).default(0),
  discountPercent: z.coerce.number().min(0).max(100).default(0),
  priceTier: z.enum(['Standard', 'Wholesale', 'VIP', 'Clearance']).default('Standard'),

  supplierId: z.string().min(1, 'Supplier ID is required'),
  supplierName: z.string().min(1, 'Supplier name is required'),
  supplierSku: z.string().min(1, 'Supplier SKU is required'),
  leadTimeDays: z.coerce.number().int().min(0).default(7),
  minOrderQty: z.coerce.number().int().min(1).default(1),
  lastPurchaseDate: z.string().default(() => new Date().toISOString().split('T')[0]),

  status: stockStatusSchema.default('HEALTHY'),
  isPerishable: z.coerce.boolean().default(false),
  expiryDate: z.string().nullable().optional().default(null),
  weightKg: z.coerce.number().min(0).default(1.0),
  dimensionsCm: z.string().default('10x10x10'),
  isFragile: z.coerce.boolean().default(false),
  hazardClass: z.string().default('None'),

  bayNumber: z.string().default('A1'),
  shelfNumber: z.string().default('S1'),
  countryOfOrigin: z.string().default('USA'),
  hsCode: z.string().default('8544.42.20'),
  warrantyMonths: z.coerce.number().int().min(0).default(12),
  packageType: z.string().default('Box'),
  handlingInstructions: z.string().default('Standard handling'),
  isReturnable: z.coerce.boolean().default(true),
  minStorageTempC: z.coerce.number().default(-10),
  maxStorageTempC: z.coerce.number().default(40),

  createdBy: z.string().default('Ops User'),
  updatedBy: z.string().default('Ops User'),
  syncStatus: z.enum(['Synced', 'Pending', 'Conflict']).default('Synced'),
});

export type RecordSchemaInput = z.infer<typeof recordSchema>;
