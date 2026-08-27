// API client wrapper abstraction interfacing with the mockServer engine instance.
import { mockServer } from '../lib/mockServer';
import type { GetRecordsParams, CreateInventoryRecordPayload, UpdateInventoryRecordPayload } from '../types/inventory.types';

export const inventoryApi = {
  listRecords: (params: GetRecordsParams) => mockServer.listRecords(params),
  getRecord: (id: string) => mockServer.getRecord(id),
  createRecord: (payload: CreateInventoryRecordPayload) => mockServer.createRecord(payload),
  updateRecord: (id: string, patch: UpdateInventoryRecordPayload) => mockServer.updateRecord(id, patch),
  deleteRecords: (ids: string[]) => mockServer.deleteRecords(ids),
  restoreRecords: (records: any[]) => mockServer.restoreRecords(records),
  bulkCreateRecords: (rows: any[]) => mockServer.bulkCreateRecords(rows),
};
