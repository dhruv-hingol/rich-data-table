import { showToast } from "@/src/components/ui/toast";
import { useCallback, useMemo, useState } from "react";
import type {
  GridReadyEvent,
  GridApi,
  RowSelectionOptions,
} from "ag-grid-community";
import { AgGridTable } from "@/src/components/data-table";
import { createColumnDefinitions } from "@/src/features/inventory/lib/columnDefsFactory";
import { useTableUIStore } from "@/src/features/inventory/store/useTableUIStore";
import { SelectionActionBar } from "./SelectionActionBar";
import type { InventoryRecord } from "@/src/features/inventory/types/inventory.types";
import {
  useInventoryRecordsQuery,
  useDeleteRecordsMutation,
} from "@/src/features/inventory/hooks/useInventoryQuery";
import ConfirmationModal from "@/src/components/ui/confirmation-modal";

export function InventoryTable() {
  const {
    searchQuery,
    statusFilter,
    categoryFilter,
    skuFilter,
    warehouseFilter,
    selectedRowIds,
    setSelectedRowIds,
    clearSelection,
    visibleColumns,
  } = useTableUIStore();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(25);
  const [gridApi, setGridApi] = useState<GridApi<InventoryRecord> | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const columnDefs = useMemo(
    () => createColumnDefinitions(visibleColumns),
    [visibleColumns],
  );

  const rowSelection = useMemo<RowSelectionOptions<InventoryRecord>>(
    () => ({
      mode: "multiRow",
      headerCheckbox: true,
      checkboxes: true,
      enableClickSelection: false,
    }),
    [],
  );

  const filters = useMemo(() => {
    const list = [];
    if (categoryFilter && categoryFilter !== "ALL") {
      list.push({
        field: "category" as const,
        operator: "equals" as const,
        value: categoryFilter,
      });
    }
    if (skuFilter && skuFilter.trim() !== "") {
      list.push({
        field: "sku" as const,
        operator: "contains" as const,
        value: skuFilter.trim(),
      });
    }
    return list;
  }, [categoryFilter, skuFilter]);

  const { data, isFetching } = useInventoryRecordsQuery({
    page: currentPage - 1,
    pageSize,
    search: searchQuery,
    statusFilter,
    warehouseFilter,
    filters,
  });

  const deleteMutation = useDeleteRecordsMutation();

  const filterKey = `${searchQuery}_${statusFilter}_${categoryFilter}_${skuFilter}_${warehouseFilter}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (filterKey !== prevFilterKey) {
    setPrevFilterKey(filterKey);
    setCurrentPage(1);
  }

  const onGridReady = useCallback((params: GridReadyEvent<InventoryRecord>) => {
    setGridApi(params.api);
  }, []);

  const onSelectionChanged = useCallback(() => {
    if (gridApi) {
      const selectedNodes = gridApi.getSelectedNodes();
      const ids = selectedNodes
        .map((n) => n.data?.id)
        .filter(Boolean) as string[];
      setSelectedRowIds(ids);
    }
  }, [gridApi, setSelectedRowIds]);

  const selectedSet = useMemo(() => new Set(selectedRowIds), [selectedRowIds]);

  const handleClearSelection = useCallback(() => {
    if (gridApi) {
      gridApi.deselectAll();
    }
    clearSelection();
  }, [gridApi, clearSelection]);

  const handleOpenDeleteModal = useCallback(() => {
    if (selectedRowIds.length === 0) return;
    setIsDeleteModalOpen(true);
  }, [selectedRowIds]);

  const handleConfirmDelete = useCallback(async () => {
    if (selectedRowIds.length === 0) return;
    const count = selectedRowIds.length;
    deleteMutation.mutate(selectedRowIds, {
      onSuccess: () => {
        if (gridApi) {
          gridApi.deselectAll();
        }
        clearSelection();
        setIsDeleteModalOpen(false);
        showToast.success(
          `${count} ${count === 1 ? "product" : "products"} deleted successfully`,
        );
      },
      onError: () => {
        showToast.error("Failed to delete selected products");
      },
    });
  }, [selectedRowIds, gridApi, clearSelection, deleteMutation]);

  return (
    <div className="w-full flex-1 flex flex-col min-h-0">
      <AgGridTable<InventoryRecord>
        rowData={data?.rows || []}
        columnDefs={columnDefs}
        isLoading={isFetching}
        rowSelection={rowSelection}
        rowHeight={44}
        dynamicViewportHeight={true}
        onGridReady={onGridReady}
        onSelectionChanged={onSelectionChanged}
        paginatorOptions={{
          current: currentPage,
          total: data?.totalCount || 0,
          pageSize,
          onChange: (page) => setCurrentPage(page),
          setPageSize: (size) => {
            setPageSize(size);
            setCurrentPage(1);
          },
        }}
      />

      <SelectionActionBar
        selectedRows={selectedSet}
        onDelete={handleOpenDeleteModal}
        onCancel={handleClearSelection}
      />

      <ConfirmationModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title={`Delete ${selectedRowIds.length} ${selectedRowIds.length === 1 ? "Product" : "Products"}?`}
        description={`Are you sure you want to delete ${
          selectedRowIds.length === 1
            ? "this product"
            : `these ${selectedRowIds.length} products`
        }? This action cannot be undone and will permanently remove the record from inventory.`}
        confirmText={
          deleteMutation.isPending ? "Deleting..." : "Confirm Delete"
        }
        cancelText="Cancel"
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
