import { get, set } from 'idb-keyval';
import type {
  InventoryRecord,
  GetRecordsParams,
  PaginatedResponse,
  CreateInventoryRecordPayload,
  UpdateInventoryRecordPayload,
  StockStatus,
} from '../types/inventory.types';
import { generateMockRecord } from './mockDataGenerator.worker';

const IDB_KEY = 'apex_inventory_records_v1';

class MockServerEngine {
  private records: InventoryRecord[] = [];
  private isInitialized = false;

  private async simulateNetworkDelay(): Promise<void> {
    const delay = Math.floor(Math.random() * (500 - 150 + 1)) + 150;
    return new Promise((resolve) => setTimeout(resolve, delay));
  }

  public async initialize(initialRecords?: InventoryRecord[]): Promise<void> {
    if (this.isInitialized && this.records.length > 0) return;

    if (initialRecords && initialRecords.length > 0) {
      this.records = initialRecords;
      this.isInitialized = true;
      try {
        await set(IDB_KEY, this.records);
      } catch (err) {
        console.warn('IDB save failed, operating in-memory:', err);
      }
      return;
    }

    try {
      const stored = await get<InventoryRecord[]>(IDB_KEY);
      if (stored && stored.length > 0) {
        this.records = stored;
        this.isInitialized = true;
        return;
      }
    } catch (err) {
      console.warn('IDB read error:', err);
    }

    // Generate fallback 50,000 records if not provided
    const count = 50000;
    const generated: InventoryRecord[] = new Array(count);
    for (let i = 0; i < count; i++) {
      generated[i] = generateMockRecord(i);
    }
    this.records = generated;
    this.isInitialized = true;
    try {
      await set(IDB_KEY, this.records);
    } catch {
      // Ignore IDB write fallback
    }
  }

  public setDatasetDirectly(records: InventoryRecord[]): void {
    this.records = records;
    this.isInitialized = true;
  }

  public getRawRecordsCount(): number {
    return this.records.length;
  }

  public async listRecords(params: GetRecordsParams): Promise<PaginatedResponse<InventoryRecord>> {
    await this.simulateNetworkDelay();

    if (!this.isInitialized) {
      await this.initialize();
    }

    const {
      page = 0,
      pageSize = 100,
      sortBy,
      sortDir = 'asc',
      search,
      filters = [],
      statusFilter = 'ALL',
      warehouseFilter = 'ALL',
    } = params;

    // STEP 1: Apply global search and column filters FIRST before pagination or sorting
    let filtered = this.records;

    // Global Search
    if (search && search.trim() !== '') {
      const q = search.toLowerCase().trim();
      filtered = filtered.filter(
        (r) =>
          r.sku.toLowerCase().includes(q) ||
          r.name.toLowerCase().includes(q) ||
          r.barcode.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q) ||
          r.brand.toLowerCase().includes(q) ||
          r.warehouse.toLowerCase().includes(q) ||
          r.binLocation.toLowerCase().includes(q) ||
          r.supplierName.toLowerCase().includes(q)
      );
    }

    // Status Quick Filter
    if (statusFilter && statusFilter !== 'ALL') {
      filtered = filtered.filter((r) => r.status === statusFilter);
    }

    // Warehouse Filter
    if (warehouseFilter && warehouseFilter !== 'ALL') {
      filtered = filtered.filter((r) => r.warehouse === warehouseFilter);
    }

    // Column level filters
    if (filters && filters.length > 0) {
      filtered = filtered.filter((row) => {
        return filters.every((f) => {
          const val = row[f.field];
          if (val === undefined || val === null) return false;

          switch (f.operator) {
            case 'equals':
              return String(val).toLowerCase() === String(f.value).toLowerCase();
            case 'contains':
              return String(val).toLowerCase().includes(String(f.value).toLowerCase());
            case 'gt':
              return Number(val) > Number(f.value);
            case 'gte':
              return Number(val) >= Number(f.value);
            case 'lt':
              return Number(val) < Number(f.value);
            case 'lte':
              return Number(val) <= Number(f.value);
            case 'in':
              if (Array.isArray(f.value)) {
                return f.value.includes(val);
              }
              return String(val).toLowerCase().includes(String(f.value).toLowerCase());
            default:
              return true;
          }
        });
      });
    }

    // Compute status counts on the filtered dataset
    const statusCounts = {
      LOW_STOCK: 0,
      HEALTHY: 0,
      OVERSTOCK: 0,
      DISCONTINUED: 0,
      ALL: filtered.length,
    };

    for (let i = 0; i < filtered.length; i++) {
      const st = filtered[i].status;
      if (statusCounts[st] !== undefined) {
        statusCounts[st]++;
      }
    }

    const totalCount = filtered.length;

    // STEP 2: Apply Sorting
    if (sortBy) {
      filtered = [...filtered].sort((a, b) => {
        const valA = a[sortBy];
        const valB = b[sortBy];

        if (valA === valB) return 0;
        if (valA === null || valA === undefined) return 1;
        if (valB === null || valB === undefined) return -1;

        const result =
          typeof valA === 'number' && typeof valB === 'number'
            ? valA - valB
            : String(valA).localeCompare(String(valB));

        return sortDir === 'desc' ? -result : result;
      });
    }

    // STEP 3: Apply Server-side Pagination
    const totalPages = Math.ceil(totalCount / pageSize) || 1;
    const startIndex = page * pageSize;
    const paginatedRows = filtered.slice(startIndex, startIndex + pageSize);

    return {
      rows: paginatedRows,
      totalCount,
      page,
      pageSize,
      totalPages,
      statusCounts,
    };
  }

  public async getRecord(id: string): Promise<InventoryRecord> {
    await this.simulateNetworkDelay();
    const record = this.records.find((r) => r.id === id);
    if (!record) {
      throw new Error(`Inventory record with ID '${id}' not found`);
    }
    return record;
  }

  public async createRecord(payload: CreateInventoryRecordPayload): Promise<InventoryRecord> {
    await this.simulateNetworkDelay();
    const qtyOnHand = payload.qtyOnHand;
    const qtyReserved = payload.qtyReserved;
    const reorderPoint = payload.reorderPoint;
    const unitCost = payload.unitCost;
    const listPrice = payload.listPrice;

    let status: StockStatus = payload.status || 'HEALTHY';
    if (qtyOnHand === 0 || qtyOnHand <= reorderPoint) {
      status = 'LOW_STOCK';
    }

    const newRecord: InventoryRecord = {
      ...payload,
      id: `rec_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status,
      qtyAvailable: qtyOnHand - qtyReserved,
      marginPercent: listPrice > 0 ? Number((((listPrice - unitCost) / listPrice) * 100).toFixed(1)) : 0,
      totalStockValue: Number((qtyOnHand * unitCost).toFixed(2)),
      daysOfSupply: Math.max(1, Math.round(qtyOnHand / 15)),
      isLowStock: qtyOnHand <= reorderPoint,
    };

    this.records.unshift(newRecord); // Place newly created record at the beginning
    set(IDB_KEY, this.records).catch(() => {});
    return newRecord;
  }

  public async updateRecord(id: string, patch: UpdateInventoryRecordPayload): Promise<InventoryRecord> {
    await this.simulateNetworkDelay();
    const index = this.records.findIndex((r) => r.id === id);
    if (index === -1) {
      throw new Error(`Record ${id} not found`);
    }

    const existing = this.records[index];
    const updated = {
      ...existing,
      ...patch,
      updatedAt: new Date().toISOString(),
    };

    // Recompute derived fields
    updated.qtyAvailable = updated.qtyOnHand - updated.qtyReserved;
    updated.marginPercent = updated.listPrice > 0
      ? Number((((updated.listPrice - updated.unitCost) / updated.listPrice) * 100).toFixed(1))
      : 0;
    updated.totalStockValue = Number((updated.qtyOnHand * updated.unitCost).toFixed(2));
    updated.isLowStock = updated.qtyOnHand <= updated.reorderPoint;

    this.records[index] = updated;
    set(IDB_KEY, this.records).catch(() => {});
    return updated;
  }

  public async deleteRecords(ids: string[]): Promise<{ deletedIds: string[] }> {
    await this.simulateNetworkDelay();
    const idSet = new Set(ids);
    this.records = this.records.filter((r) => !idSet.has(r.id));
    set(IDB_KEY, this.records).catch(() => {});
    return { deletedIds: ids };
  }

  public async restoreRecords(recordsToRestore: InventoryRecord[]): Promise<void> {
    await this.simulateNetworkDelay();
    const existingIds = new Set(this.records.map((r) => r.id));
    const newToInsert = recordsToRestore.filter((r) => !existingIds.has(r.id));
    this.records.unshift(...newToInsert);
    set(IDB_KEY, this.records).catch(() => {});
  }

  public async bulkCreateRecords(
    rawRows: Partial<InventoryRecord>[]
  ): Promise<{ created: InventoryRecord[]; rejected: { row: Record<string, unknown>; errors: string[] }[] }> {
    await this.simulateNetworkDelay();

    const created: InventoryRecord[] = [];
    const rejected: { row: Record<string, unknown>; errors: string[] }[] = [];

    for (let i = 0; i < rawRows.length; i++) {
      const raw = rawRows[i];
      if (!raw.sku || !raw.name) {
        rejected.push({ row: raw, errors: ['Missing required fields: SKU or Name'] });
        continue;
      }

      const qtyOnHand = Number(raw.qtyOnHand || 0);
      const qtyReserved = Number(raw.qtyReserved || 0);
      const reorderPoint = Number(raw.reorderPoint || 10);
      const unitCost = Number(raw.unitCost || 1);
      const listPrice = Number(raw.listPrice || 2);

      let status: StockStatus = (raw.status as StockStatus) || 'HEALTHY';
      if (qtyOnHand === 0 || qtyOnHand <= reorderPoint) {
        status = 'LOW_STOCK';
      }

      const record: InventoryRecord = {
        id: `rec_${Date.now()}_${i}_${Math.random().toString(36).substring(2, 7)}`,
        sku: String(raw.sku),
        name: String(raw.name),
        barcode: String(raw.barcode || '100000000000'),
        category: String(raw.category || 'General'),
        subcategory: String(raw.subcategory || 'Standard'),
        brand: String(raw.brand || 'Generic'),
        tags: Array.isArray(raw.tags) ? raw.tags : ['imported'],
        variant: String(raw.variant || 'Standard'),
        unit: String(raw.unit || 'pcs'),

        warehouse: String(raw.warehouse || 'WH-MAIN'),
        qtyOnHand,
        qtyReserved,
        qtyAvailable: qtyOnHand - qtyReserved,
        reorderPoint,
        reorderQty: Number(raw.reorderQty || 50),
        binLocation: String(raw.binLocation || 'A-1-1'),

        unitCost,
        listPrice,
        salePrice: Number(raw.salePrice || listPrice),
        marginPercent: listPrice > 0 ? Number((((listPrice - unitCost) / listPrice) * 100).toFixed(1)) : 0,
        taxRate: Number(raw.taxRate || 0),
        discountPercent: Number(raw.discountPercent || 0),
        priceTier: (raw.priceTier as InventoryRecord['priceTier']) || 'Standard',

        supplierId: String(raw.supplierId || 'SUP-001'),
        supplierName: String(raw.supplierName || 'Default Supplier'),
        supplierSku: String(raw.supplierSku || raw.sku),
        leadTimeDays: Number(raw.leadTimeDays || 7),
        minOrderQty: Number(raw.minOrderQty || 1),
        lastPurchaseDate: String(raw.lastPurchaseDate || new Date().toISOString().split('T')[0]),

        status,
        isPerishable: Boolean(raw.isPerishable),
        expiryDate: raw.expiryDate || null,
        weightKg: Number(raw.weightKg || 1),
        dimensionsCm: String(raw.dimensionsCm || '10x10x10'),
        isFragile: Boolean(raw.isFragile),
        hazardClass: String(raw.hazardClass || 'None'),

        bayNumber: String(raw.bayNumber || 'B1'),
        shelfNumber: String(raw.shelfNumber || 'S1'),
        countryOfOrigin: String(raw.countryOfOrigin || 'USA'),
        hsCode: String(raw.hsCode || '0000.00.00'),
        warrantyMonths: Number(raw.warrantyMonths || 12),
        packageType: String(raw.packageType || 'Box'),
        handlingInstructions: String(raw.handlingInstructions || 'Standard'),
        isReturnable: Boolean(raw.isReturnable ?? true),
        minStorageTempC: Number(raw.minStorageTempC || -10),
        maxStorageTempC: Number(raw.maxStorageTempC || 40),

        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'CSV Import',
        updatedBy: 'CSV Import',
        lastSoldAt: new Date().toISOString(),
        syncStatus: 'Synced',

        totalStockValue: Number((qtyOnHand * unitCost).toFixed(2)),
        daysOfSupply: Math.max(1, Math.round(qtyOnHand / 15)),
        isLowStock: qtyOnHand <= reorderPoint,
      };

      created.push(record);
    }

    this.records.unshift(...created);
    set(IDB_KEY, this.records).catch(() => {});

    return { created, rejected };
  }

  public async getUniqueSkus(): Promise<string[]> {
    if (!this.isInitialized) {
      await this.initialize();
    }
    return Array.from(new Set(this.records.map((r) => r.sku))).slice(0, 50);
  }

  public async getUniqueCategories(): Promise<string[]> {
    if (!this.isInitialized) {
      await this.initialize();
    }
    return Array.from(new Set(this.records.map((r) => r.category)));
  }
}

export const mockServer = new MockServerEngine();
