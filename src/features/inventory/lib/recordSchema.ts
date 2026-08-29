import { z } from 'zod';

export const stockStatusSchema = z.enum(['LOW_STOCK', 'HEALTHY', 'OVERSTOCK', 'DISCONTINUED']);

export const recordSchema = z.object({
  sku: z
    .string()
    .min(1, 'SKU is required')
    .max(50, 'SKU cannot exceed 50 characters')
    .transform((val) => val.trim().toUpperCase()),
  name: z.string().min(1, 'Product name is required').max(120, 'Product name is too long'),
  barcode: z.string().min(1, 'Barcode is required'),
  category: z.string().min(1, 'Category is required'),
  subcategory: z.string().optional().default(''),
  brand: z.string().min(1, 'Brand is required'),
  tags: z.array(z.string()).or(z.string().transform((val) => val.split(',').map((t) => t.trim()).filter(Boolean))).default([]),
  variant: z.string().default('Standard'),
  unit: z.string().default('pcs'),

  warehouse: z.string().min(1, 'Warehouse location is required'),
  qtyOnHand: z.coerce.number().int('Qty on hand must be an integer').min(0, 'Qty on hand cannot be negative'),
  qtyReserved: z.coerce.number().int('Qty reserved must be an integer').min(0, 'Qty reserved cannot be negative').default(0),
  reorderPoint: z.coerce.number().int('Reorder point must be an integer').min(0, 'Reorder point cannot be negative'),
  reorderQty: z.coerce.number().int('Reorder qty must be an integer').min(0, 'Reorder qty cannot be negative').default(10),
  binLocation: z.string().optional().default('A-1'),

  unitCost: z.coerce.number().min(0, 'Unit cost cannot be negative'),
  listPrice: z.coerce.number().min(0, 'List price cannot be negative'),
  salePrice: z.coerce.number().min(0, 'Sale price cannot be negative').default(0),
  taxRate: z.coerce.number().min(0).max(100).default(0),
  discountPercent: z.coerce.number().min(0).max(100).default(0),
  priceTier: z.enum(['Standard', 'Wholesale', 'VIP', 'Clearance']).default('Standard'),

  supplierId: z.string().optional().default('SUP-GEN-01'),
  supplierName: z.string().min(1, 'Supplier name is required'),
  supplierSku: z.string().optional().default(''),
  leadTimeDays: z.coerce.number().int().min(0).default(7),
  minOrderQty: z.coerce.number().int().min(0).default(1),
  lastPurchaseDate: z.string().default(() => new Date().toISOString().split('T')[0]),

  status: stockStatusSchema.default('HEALTHY'),
  isPerishable: z.coerce.boolean().default(false),
  expiryDate: z.string().nullable().optional().default(null),
  weightKg: z.coerce.number().min(0).default(0),
  dimensionsCm: z.string().optional().default(''),
  isFragile: z.coerce.boolean().default(false),
  hazardClass: z.string().default('None'),

  bayNumber: z.string().default('A1'),
  shelfNumber: z.string().default('S1'),
  countryOfOrigin: z.string().default('India'),
  hsCode: z.string().default('8544.42.20'),
  warrantyMonths: z.coerce.number().int().min(0).default(12),
  packageType: z.string().optional().default('Box'),
  handlingInstructions: z.string().optional().default('Standard handling'),
  isReturnable: z.coerce.boolean().default(true),
  minStorageTempC: z.coerce.number().default(-10),
  maxStorageTempC: z.coerce.number().default(40),

  createdBy: z.string().default('Ops User'),
  updatedBy: z.string().default('Ops User'),
  syncStatus: z.enum(['Synced', 'Pending', 'Conflict']).default('Synced'),
});

export type RecordSchemaInput = z.infer<typeof recordSchema>;
