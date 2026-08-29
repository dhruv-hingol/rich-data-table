import { mockServer } from '../lib/mockServer';
import type {
  GetRecordsParams,
  PaginatedResponse,
  InventoryRecord,
  CreateInventoryRecordPayload,
  UpdateInventoryRecordPayload,
} from '../types/inventory.types';

export interface RequestConfig {
  headers?: Record<string, string>;
  baseUrl?: string;
  useMockApi?: boolean;
}

const DEFAULT_CONFIG: RequestConfig = {
  baseUrl: (import.meta.env && import.meta.env.VITE_API_BASE_URL) || '/api/v1',
  useMockApi: true, // Default to in-memory mock engine; set to false for production REST API backend
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
};

// Request Interceptor: Attach Auth Bearer tokens, Tenant ID, Request ID
function requestInterceptor(url: string, init?: RequestInit): { url: string; init: RequestInit } {
  const headers = new Headers(init?.headers || {});
  headers.set('X-Request-Timestamp', new Date().toISOString());

  const token = localStorage.getItem('auth_token');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  return {
    url,
    init: {
      ...init,
      headers,
    },
  };
}

// Response Interceptor: Error handling, status code check, telemetry
async function responseInterceptor<T>(responsePromise: Promise<Response>): Promise<T> {
  try {
    const res = await responsePromise;
    if (!res.ok) {
      const errorBody = await res.text().catch(() => '');
      throw new Error(`HTTP ${res.status}: ${res.statusText} - ${errorBody}`);
    }
    return (await res.json()) as T;
  } catch (err) {
    console.error('[API Interceptor Error]:', err);
    throw err;
  }
}

// Interceptor-wrapped API Interface
export const apiInterceptor = {
  async listRecords(params: GetRecordsParams, config: RequestConfig = DEFAULT_CONFIG): Promise<PaginatedResponse<InventoryRecord>> {
    if (config.useMockApi) {
      return mockServer.listRecords(params);
    }
    const query = new URLSearchParams({
      page: String(params.page),
      pageSize: String(params.pageSize),
      ...(params.search && { search: params.search }),
      ...(params.statusFilter && { statusFilter: params.statusFilter }),
    }).toString();

    const { url, init } = requestInterceptor(`${config.baseUrl}/inventory?${query}`);
    return responseInterceptor<PaginatedResponse<InventoryRecord>>(fetch(url, init));
  },

  async getRecord(id: string, config: RequestConfig = DEFAULT_CONFIG): Promise<InventoryRecord> {
    if (config.useMockApi) {
      return mockServer.getRecord(id);
    }
    const { url, init } = requestInterceptor(`${config.baseUrl}/inventory/${id}`);
    return responseInterceptor<InventoryRecord>(fetch(url, init));
  },

  async createRecord(payload: CreateInventoryRecordPayload, config: RequestConfig = DEFAULT_CONFIG): Promise<InventoryRecord> {
    if (config.useMockApi) {
      return mockServer.createRecord(payload);
    }
    const { url, init } = requestInterceptor(`${config.baseUrl}/inventory`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return responseInterceptor<InventoryRecord>(fetch(url, init));
  },

  async updateRecord(id: string, patch: UpdateInventoryRecordPayload, config: RequestConfig = DEFAULT_CONFIG): Promise<InventoryRecord> {
    if (config.useMockApi) {
      return mockServer.updateRecord(id, patch);
    }
    const { url, init } = requestInterceptor(`${config.baseUrl}/inventory/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(patch),
    });
    return responseInterceptor<InventoryRecord>(fetch(url, init));
  },

  async deleteRecords(ids: string[], config: RequestConfig = DEFAULT_CONFIG): Promise<{ deletedIds: string[] }> {
    if (config.useMockApi) {
      return mockServer.deleteRecords(ids);
    }
    const { url, init } = requestInterceptor(`${config.baseUrl}/inventory/bulk-delete`, {
      method: 'POST',
      body: JSON.stringify({ ids }),
    });
    return responseInterceptor<{ deletedIds: string[] }>(fetch(url, init));
  },

  async bulkCreateRecords(rows: Partial<InventoryRecord>[], config: RequestConfig = DEFAULT_CONFIG) {
    if (config.useMockApi) {
      return mockServer.bulkCreateRecords(rows);
    }
    const { url, init } = requestInterceptor(`${config.baseUrl}/inventory/bulk-create`, {
      method: 'POST',
      body: JSON.stringify({ rows }),
    });
    return responseInterceptor<{ created: InventoryRecord[]; rejected: { row: Record<string, unknown>; errors: string[] }[] }>(fetch(url, init));
  },

  async getUniqueSkus(config: RequestConfig = DEFAULT_CONFIG): Promise<string[]> {
    if (config.useMockApi) {
      return mockServer.getUniqueSkus();
    }
    const { url, init } = requestInterceptor(`${config.baseUrl}/inventory/skus`);
    return responseInterceptor<string[]>(fetch(url, init));
  },

  async getUniqueCategories(config: RequestConfig = DEFAULT_CONFIG): Promise<string[]> {
    if (config.useMockApi) {
      return mockServer.getUniqueCategories();
    }
    const { url, init } = requestInterceptor(`${config.baseUrl}/inventory/categories`);
    return responseInterceptor<string[]>(fetch(url, init));
  },
};
