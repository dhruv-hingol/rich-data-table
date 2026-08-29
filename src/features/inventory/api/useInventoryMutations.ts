// React Query hooks for create, update, delete, and bulk import mutations.
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryApi } from './inventoryApi';
import { inventoryKeys } from './inventoryKeys';

import type { UpdateInventoryRecordPayload } from '../types/inventory.types';

export function useInventoryMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: inventoryApi.createRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.lists() });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: UpdateInventoryRecordPayload }) => inventoryApi.updateRecord(id, patch),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.lists() });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: inventoryApi.deleteRecords,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.lists() });
    },
  });

  const bulkCreateMutation = useMutation({
    mutationFn: inventoryApi.bulkCreateRecords,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.lists() });
    },
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
    bulkCreateMutation,
  };
}
