import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { inventoryApi } from '../api/inventoryApi';
import type {
  GetRecordsParams,
  CreateInventoryRecordPayload,
  UpdateInventoryRecordPayload,
} from '../types/inventory.types';

export const inventoryKeys = {
  all: ['inventory'] as const,
  lists: () => [...inventoryKeys.all, 'list'] as const,
  list: (params: GetRecordsParams) => [...inventoryKeys.lists(), params] as const,
  details: () => [...inventoryKeys.all, 'detail'] as const,
  detail: (id: string) => [...inventoryKeys.details(), id] as const,
  skus: () => [...inventoryKeys.all, 'skus'] as const,
  categories: () => [...inventoryKeys.all, 'categories'] as const,
};

export function useInventoryRecordsQuery(params: GetRecordsParams) {
  return useQuery({
    queryKey: inventoryKeys.list(params),
    queryFn: () => inventoryApi.listRecords(params),
    placeholderData: keepPreviousData,
  });
}

export function useInventoryRecordDetailQuery(id?: string) {
  return useQuery({
    queryKey: inventoryKeys.detail(id || ''),
    queryFn: () => inventoryApi.getRecord(id!),
    enabled: Boolean(id),
  });
}

export function useUniqueSkusQuery() {
  return useQuery({
    queryKey: inventoryKeys.skus(),
    queryFn: () => inventoryApi.getUniqueSkus(),
    staleTime: 60000,
  });
}

export function useCreateRecordMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateInventoryRecordPayload) => inventoryApi.createRecord(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.all });
    },
  });
}

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

export function useDeleteRecordsMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) => inventoryApi.deleteRecords(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.all });
    },
  });
}

export function useBulkCreateRecordsMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (records: Parameters<typeof inventoryApi.bulkCreateRecords>[0]) =>
      inventoryApi.bulkCreateRecords(records),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.all });
    },
  });
}
