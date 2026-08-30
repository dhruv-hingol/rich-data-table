import { showToast } from "@/src/components/ui/toast";
import { useCallback, useMemo, useState, useEffect, useRef } from "react";
import type {
  GridReadyEvent,
  GridApi,
  RowSelectionOptions,
  BodyScrollEvent,
} from "ag-grid-community";
import { AgGridTable } from "@/src/components/data-table";
import { createColumnDefinitions } from "@/src/features/inventory/lib/columnDefsFactory";
import { useTableUIStore } from "@/src/features/inventory/store/useTableUIStore";
import { SelectionActionBar } from "./SelectionActionBar";
import type { InventoryRecord } from "@/src/features/inventory/types/inventory.types";
import {
  useInfiniteInventoryQuery,
  useDeleteRecordsMutation,
} from "@/src/features/inventory/hooks/useInventoryQuery";
import ConfirmationModal from "@/src/components/ui/confirmation-modal";
import { HashLoader } from "@/src/components/ui/hash-loader";

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

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isFetching,
  } = useInfiniteInventoryQuery({
    pageSize: 100,
    search: searchQuery,
    statusFilter,
    warehouseFilter,
    filters,
  });

  const allRows = useMemo(() => {
    return data?.pages.flatMap((page) => page.rows) || [];
  }, [data]);

  const totalCount = data?.pages[0]?.totalCount || 0;

  const deleteMutation = useDeleteRecordsMutation();

  const prevRowsCountRef = useRef(allRows.length);
  const isAllSelectedBeforeScrollRef = useRef(false);

  useEffect(() => {
    if (allRows.length > 0 && selectedRowIds.length >= allRows.length) {
      isAllSelectedBeforeScrollRef.current = true;
    } else {
      isAllSelectedBeforeScrollRef.current = false;
    }
  }, [selectedRowIds.length, allRows.length]);

  useEffect(() => {
    const prevCount = prevRowsCountRef.current;
    const currentCount = allRows.length;

    if (
      gridApi &&
      currentCount > prevCount &&
      isAllSelectedBeforeScrollRef.current
    ) {
      gridApi.selectAll();
      const newAllIds = allRows.map((r) => r.id);
      setSelectedRowIds(newAllIds);
    }

    prevRowsCountRef.current = currentCount;
  }, [allRows, gridApi, setSelectedRowIds]);

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

  const handleBodyScroll = useCallback(
    (event: BodyScrollEvent<InventoryRecord>) => {
      if (event.direction !== "vertical") return;
      const api = event.api;
      const pixelRange = api.getVerticalPixelRange();
      const scrollPosition = pixelRange.bottom;
      const totalHeight = api.getDisplayedRowCount() * 44;

      if (
        hasNextPage &&
        !isFetchingNextPage &&
        totalHeight > 0 &&
        scrollPosition >= totalHeight - 500
      ) {
        fetchNextPage();
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage],
  );

  const selectedSet = useMemo(() => new Set(selectedRowIds), [selectedRowIds]);

  const handleClearSelection = useCallback(() => {
    if (gridApi) {
      gridApi.deselectAll();
    }
    clearSelection();
  }, [gridApi, clearSelection]);

  const [deletingCount, setDeletingCount] = useState<number | null>(null);

  const handleOpenDeleteModal = useCallback(() => {
    if (selectedRowIds.length === 0) return;
    setDeletingCount(selectedRowIds.length);
    setIsDeleteModalOpen(true);
  }, [selectedRowIds]);

  const handleConfirmDelete = useCallback(async () => {
    if (selectedRowIds.length === 0) return;
    const count = selectedRowIds.length;
    setDeletingCount(count);
    deleteMutation.mutate(selectedRowIds, {
      onSuccess: () => {
        if (gridApi) {
          gridApi.deselectAll();
        }
        clearSelection();
        setIsDeleteModalOpen(false);
        setDeletingCount(null);
        showToast.success(
          `${count} ${count === 1 ? "product" : "products"} deleted successfully`,
        );
      },
      onError: () => {
        setDeletingCount(null);
        showToast.error("Failed to delete selected products");
      },
    });
  }, [selectedRowIds, gridApi, clearSelection, deleteMutation]);

  const activeDeleteCount = deletingCount ?? selectedRowIds.length;
  const isTableLoading = isLoading || (isFetching && allRows.length === 0);

  return (
    <div className="w-full flex-1 flex flex-col min-h-0">
      <AgGridTable<InventoryRecord>
        rowData={allRows}
        columnDefs={columnDefs}
        isLoading={isTableLoading}
        rowSelection={rowSelection}
        rowHeight={44}
        dynamicViewportHeight={true}
        onGridReady={onGridReady}
        onSelectionChanged={onSelectionChanged}
        onBodyScroll={handleBodyScroll}
      />

      <div className="flex items-center justify-between px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-600 font-medium shrink-0 shadow-xs mt-2.5 h-10">
        <span>
          Showing <strong className="text-slate-900">{allRows.length}</strong>{" "}
          of{" "}
          <strong className="text-slate-900">
            {totalCount.toLocaleString()}
          </strong>{" "}
          records
        </span>

        {isFetchingNextPage && (
          <div className="inline-flex items-center gap-2 text-[#ff6600] font-semibold animate-pulse">
            <HashLoader size="sm" />
            <span>Loading more records...</span>
          </div>
        )}

        {!hasNextPage && allRows.length > 0 && (
          <span className="text-slate-500 font-medium">
            All {totalCount.toLocaleString()} records loaded
          </span>
        )}
      </div>

      <SelectionActionBar
        selectedRows={selectedSet}
        onDelete={handleOpenDeleteModal}
        onCancel={handleClearSelection}
      />

      <ConfirmationModal
        open={isDeleteModalOpen}
        onClose={() => !deleteMutation.isPending && setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title={`Delete ${activeDeleteCount} ${activeDeleteCount === 1 ? "Product" : "Products"}?`}
        description={`Are you sure you want to delete ${
          activeDeleteCount === 1
            ? "this product"
            : `these ${activeDeleteCount} products`
        }? This action cannot be undone and will permanently remove the record from inventory.`}
        confirmText="Confirm Delete"
        loadingText={`Deleting ${activeDeleteCount} ${activeDeleteCount === 1 ? "Product" : "Products"}...`}
        cancelText="Cancel"
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
