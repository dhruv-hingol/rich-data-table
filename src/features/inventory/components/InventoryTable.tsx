import { showToast } from "../../../components/ui/toast";
import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  GridReadyEvent,
  GridApi,
  RowSelectionOptions,
} from "ag-grid-community";
import { AgGridTable } from "../../../components/data-table";
import { createColumnDefinitions } from "../lib/columnDefsFactory.tsx";
import { useTableUIStore } from "../store/useTableUIStore";
import { SelectionActionBar } from "./SelectionActionBar";
import type { InventoryRecord } from "../types/inventory.types";
import {
  useInventoryRecordsQuery,
  useDeleteRecordsMutation,
} from "../hooks/useInventoryQuery";

export function InventoryTable() {
  const {
    searchQuery,
    statusFilter,
    categoryFilter,
    skuFilter,
    selectedRowIds,
    setSelectedRowIds,
    clearSelection,
  } = useTableUIStore();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [gridApi, setGridApi] = useState<GridApi<InventoryRecord> | null>(null);

  const columnDefs = useMemo(() => createColumnDefinitions(), []);

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

  const { data, isLoading } = useInventoryRecordsQuery({
    page: currentPage - 1,
    pageSize,
    search: searchQuery,
    statusFilter,
    filters,
  });

  const deleteMutation = useDeleteRecordsMutation();

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, categoryFilter, skuFilter]);

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

  const handleDeleteSelected = useCallback(async () => {
    if (selectedRowIds.length === 0) return;
    const count = selectedRowIds.length;
    deleteMutation.mutate(selectedRowIds, {
      onSuccess: () => {
        if (gridApi) {
          gridApi.deselectAll();
        }
        clearSelection();
        showToast.success(`${count} ${count === 1 ? 'product' : 'products'} deleted successfully`);
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
        isLoading={isLoading}
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
        onDelete={handleDeleteSelected}
        onCancel={handleClearSelection}
      />
    </div>
  );
}
