// Query key factory for TanStack React Query cache management.
import type { GetRecordsParams } from '../types/inventory.types';

export const inventoryKeys = {
  all: ['inventory'] as const,
  lists: () => [...inventoryKeys.all, 'list'] as const,
  list: (params: GetRecordsParams) => [...inventoryKeys.lists(), params] as const,
  details: () => [...inventoryKeys.all, 'detail'] as const,
  detail: (id: string) => [...inventoryKeys.details(), id] as const,
};
