// React Query custom hook for fetching server-side paginated inventory records.
import { useQuery } from '@tanstack/react-query';
import { inventoryApi } from './inventoryApi';
import { inventoryKeys } from './inventoryKeys';
import type { GetRecordsParams } from '../types/inventory.types';

export function useInventoryQuery(params: GetRecordsParams) {
  return useQuery({
    queryKey: inventoryKeys.list(params),
    queryFn: () => inventoryApi.listRecords(params),
    placeholderData: (previousData) => previousData,
    staleTime: 30000,
  });
}
