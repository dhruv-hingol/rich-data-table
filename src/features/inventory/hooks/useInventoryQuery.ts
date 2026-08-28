// Custom TanStack React Query hooks for Inventory records management, mutations, and cache invalidations.
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryApi } from '../api/inventoryApi';
import type {
  GetRecordsParams,
  CreateInventoryRecordPayload,
  UpdateInventoryRecordPayload,
} from '../types/inventory.types';

// Query Keys Factory
export const inventoryKeys = {
  all: ['inventory'] as const,
  lists: () => [...inventoryKeys.all, 'list'] as const,
  list: (params: GetRecordsParams) => [...inventoryKeys.lists(), params] as const,
  details: () => [...inventoryKeys.all, 'detail'] as const,
  detail: (id: string) => [...inventoryKeys.details(), id] as const,
  skus: () => [...inventoryKeys.all, 'skus'] as const,
  categories: () => [...inventoryKeys.all, 'categories'] as const,
};

// 1. Fetch Paginated Inventory Records Query Hook
export function useInventoryRecordsQuery(params: GetRecordsParams) {
  return useQuery({
    queryKey: inventoryKeys.list(params),
    queryFn: () => inventoryApi.listRecords(params),
  });
}

// 2. Fetch Record Detail by ID Query Hook
export function useInventoryRecordDetailQuery(id?: string) {
  return useQuery({
    queryKey: inventoryKeys.detail(id || ''),
    queryFn: () => inventoryApi.getRecord(id!),
    enabled: Boolean(id),
  });
}

// 3. Fetch Unique SKUs Query Hook
export function useUniqueSkusQuery() {
  return useQuery({
    queryKey: inventoryKeys.skus(),
    queryFn: () => inventoryApi.getUniqueSkus(),
    staleTime: 60000,
  });
}

// 4. Create Record Mutation Hook
export function useCreateRecordMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateInventoryRecordPayload) => inventoryApi.createRecord(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.all });
    },
  });
}

// 5. Update Record Mutation Hook
export function useUpdateRecordMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: UpdateInventoryRecordPayload }) =>
      inventoryApi.updateRecord(id, patch),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.all });
      queryClient.invalidateQueries({ queryKey: inventoryKeys.detail(id) });
    },
  });
}

// 6. Delete Records Mutation Hook
export function useDeleteRecordsMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) => inventoryApi.deleteRecords(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.all });
    },
  });
}
