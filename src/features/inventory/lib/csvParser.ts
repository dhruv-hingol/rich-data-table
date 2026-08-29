import Papa from 'papaparse';
import { recordSchema } from './recordSchema';
import type { InventoryRecord } from '../types/inventory.types';

export interface ParseResult {
  validRows: Partial<InventoryRecord>[];
  invalidRows: { rowNumber: number; raw: any; errors: string[] }[];
  totalParsed: number;
}

function normalizeCSVRow(raw: Record<string, any>, rowNumber: number): Record<string, any> {
  const normalized: Record<string, any> = {};

  for (const key of Object.keys(raw)) {
    const val = raw[key];
    if (val === undefined || val === null || val === '') continue;

    const cleanKey = key.trim().toLowerCase().replace(/[^a-z0-9]/g, '');

    if (cleanKey === 'sku') normalized.sku = String(val).trim();
    else if (cleanKey === 'name' || cleanKey === 'productname' || cleanKey === 'itemname') normalized.name = String(val).trim();
    else if (cleanKey === 'barcode' || cleanKey === 'upc' || cleanKey === 'ean') normalized.barcode = String(val).trim();
    else if (cleanKey === 'category') normalized.category = String(val).trim();
    else if (cleanKey === 'subcategory' || cleanKey === 'subcat') normalized.subcategory = String(val).trim();
    else if (cleanKey === 'brand') normalized.brand = String(val).trim();
    else if (cleanKey === 'warehouse' || cleanKey === 'location') normalized.warehouse = String(val).trim();
    else if (cleanKey === 'qtyonhand' || cleanKey === 'qty' || cleanKey === 'quantity' || cleanKey === 'stock') normalized.qtyOnHand = Number(val);
    else if (cleanKey === 'qtyreserved' || cleanKey === 'reserved') normalized.qtyReserved = Number(val);
    else if (cleanKey === 'reorderpoint' || cleanKey === 'minstock') normalized.reorderPoint = Number(val);
    else if (cleanKey === 'reorderqty') normalized.reorderQty = Number(val);
    else if (cleanKey === 'binlocation' || cleanKey === 'bin') normalized.binLocation = String(val).trim();
    else if (cleanKey === 'unitcost' || cleanKey === 'cost') normalized.unitCost = Number(val);
    else if (cleanKey === 'listprice' || cleanKey === 'price') normalized.listPrice = Number(val);
    else if (cleanKey === 'suppliername' || cleanKey === 'supplier') normalized.supplierName = String(val).trim();
    else if (cleanKey === 'supplierid') normalized.supplierId = String(val).trim();
    else if (cleanKey === 'suppliersku') normalized.supplierSku = String(val).trim();
    else normalized[key] = val;
  }

  return {
    sku: normalized.sku || `SKU-IMP-${rowNumber}-${Math.floor(1000 + Math.random() * 9000)}`,
    name: normalized.name || 'Unnamed CSV Product',
    barcode: normalized.barcode || `${Math.floor(100000000000 + Math.random() * 900000000000)}`,
    category: normalized.category || 'General',
    subcategory: normalized.subcategory || 'Standard',
    brand: normalized.brand || 'Generic',
    tags: ['imported'],
    variant: 'Standard',
    unit: 'pcs',
    warehouse: normalized.warehouse || 'WH-NORTH-01',
    qtyOnHand: normalized.qtyOnHand !== undefined && !isNaN(Number(normalized.qtyOnHand)) ? Number(normalized.qtyOnHand) : 10,
    qtyReserved: normalized.qtyReserved !== undefined && !isNaN(Number(normalized.qtyReserved)) ? Number(normalized.qtyReserved) : 0,
    reorderPoint: normalized.reorderPoint !== undefined && !isNaN(Number(normalized.reorderPoint)) ? Number(normalized.reorderPoint) : 5,
    reorderQty: normalized.reorderQty !== undefined && !isNaN(Number(normalized.reorderQty)) ? Number(normalized.reorderQty) : 20,
    binLocation: normalized.binLocation || 'A-1-1',
    unitCost: normalized.unitCost !== undefined && !isNaN(Number(normalized.unitCost)) ? Number(normalized.unitCost) : 1.0,
    listPrice: normalized.listPrice !== undefined && !isNaN(Number(normalized.listPrice)) ? Number(normalized.listPrice) : 2.0,
    salePrice: normalized.listPrice !== undefined && !isNaN(Number(normalized.listPrice)) ? Number(normalized.listPrice) : 2.0,
    taxRate: 0,
    discountPercent: 0,
    priceTier: 'Standard',
    supplierId: normalized.supplierId || 'SUP-001',
    supplierName: normalized.supplierName || 'Default Supplier',
    supplierSku: normalized.supplierSku || normalized.sku || 'SUP-SKU',
    leadTimeDays: 7,
    minOrderQty: 1,
    lastPurchaseDate: new Date().toISOString().split('T')[0],
    status: 'HEALTHY',
    isPerishable: false,
    expiryDate: null,
    weightKg: 1.0,
    dimensionsCm: '10x10x10',
    isFragile: false,
    hazardClass: 'None',
    bayNumber: 'B1',
    shelfNumber: 'S1',
    countryOfOrigin: 'USA',
    hsCode: '0000.00.00',
    warrantyMonths: 12,
    packageType: 'Box',
    handlingInstructions: 'Standard',
    isReturnable: true,
    minStorageTempC: -10,
    maxStorageTempC: 40,
    createdBy: 'CSV Import',
    updatedBy: 'CSV Import',
    syncStatus: 'Synced',
    ...normalized,
  };
}

export function parseCSVStream(file: File): Promise<ParseResult> {
  return new Promise((resolve, reject) => {
    const validRows: Partial<InventoryRecord>[] = [];
    const invalidRows: { rowNumber: number; raw: any; errors: string[] }[] = [];
    let rowNumber = 0;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      step: (results) => {
        rowNumber++;
        const raw = results.data as any;
        const normalized = normalizeCSVRow(raw, rowNumber);
        const parseResult = recordSchema.safeParse(normalized);

        if (parseResult.success) {
          validRows.push(parseResult.data as any);
        } else {
          const errors = parseResult.error.issues.map(
            (issue) => `${issue.path.join('.')}: ${issue.message}`
          );
          invalidRows.push({ rowNumber, raw, errors });
        }
      },
      complete: () => {
        resolve({
          validRows,
          invalidRows,
          totalParsed: rowNumber,
        });
      },
      error: (err) => {
        reject(err);
      },
    });
  });
}
