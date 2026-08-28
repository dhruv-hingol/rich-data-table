// Unified Inventory API interface delegating requests to apiInterceptor.
import { apiInterceptor } from './apiInterceptor';
import type { GetRecordsParams, CreateInventoryRecordPayload, UpdateInventoryRecordPayload } from '../types/inventory.types';

export const inventoryApi = {
  listRecords: (params: GetRecordsParams) => apiInterceptor.listRecords(params),
  getRecord: (id: string) => apiInterceptor.getRecord(id),
  createRecord: (payload: CreateInventoryRecordPayload) => apiInterceptor.createRecord(payload),
  updateRecord: (id: string, patch: UpdateInventoryRecordPayload) => apiInterceptor.updateRecord(id, patch),
  deleteRecords: (ids: string[]) => apiInterceptor.deleteRecords(ids),
  bulkCreateRecords: (rows: any[]) => apiInterceptor.bulkCreateRecords(rows),
  getUniqueSkus: () => apiInterceptor.getUniqueSkus(),
  getUniqueCategories: () => apiInterceptor.getUniqueCategories(),
};
