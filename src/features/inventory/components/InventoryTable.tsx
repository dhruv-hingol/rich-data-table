import { useCallback, useEffect, useMemo, useState } from "react";
import type { GridReadyEvent, GridApi, RowSelectionOptions } from "ag-grid-community";
import { AgGridTable } from "../../../components/data-table";
import { createColumnDefinitions } from "../lib/columnDefsFactory.tsx";
import { inventoryApi } from "../api/inventoryApi";
import { useTableUIStore } from "../store/useTableUIStore";
import { SelectionActionBar } from "./SelectionActionBar";
import type { InventoryRecord } from "../types/inventory.types";

export function InventoryTable() {
  const {
    searchQuery,
    statusFilter,
    categoryFilter,
    skuFilter,
    selectedRowIds,
    setSelectedRowIds,
    clearSelection,
    refreshKey,
  } = useTableUIStore();

  const [rowData, setRowData] = useState<InventoryRecord[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [gridApi, setGridApi] = useState<GridApi<InventoryRecord> | null>(null);

  const columnDefs = useMemo(() => createColumnDefinitions(), []);

  const rowSelection = useMemo<RowSelectionOptions<InventoryRecord>>(
    () => ({
      mode: "multiRow",
      headerCheckbox: true,
      checkboxes: true,
      enableClickSelection: false,
    }),
    []
  );

  const fetchRecords = useCallback(async () => {
    setIsLoading(true);
    try {
      const filters = [];
      if (categoryFilter && categoryFilter !== "ALL") {
        filters.push({
          field: "category" as const,
          operator: "equals" as const,
          value: categoryFilter,
        });
      }
      if (skuFilter && skuFilter.trim() !== "") {
        filters.push({
          field: "sku" as const,
          operator: "contains" as const,
          value: skuFilter.trim(),
        });
      }

      const res = await inventoryApi.listRecords({
        page: currentPage - 1, // 0-indexed page for server
        pageSize,
        search: searchQuery,
        statusFilter,
        filters,
      });
      setRowData(res.rows);
      setTotalCount(res.totalCount);
    } catch (err) {
      console.error("Inventory list fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [
    currentPage,
    pageSize,
    searchQuery,
    statusFilter,
    categoryFilter,
    skuFilter,
    refreshKey,
  ]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

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
    try {
      await inventoryApi.deleteRecords(selectedRowIds);
      if (gridApi) {
        gridApi.deselectAll();
      }
      clearSelection();
      fetchRecords();
    } catch (err) {
      console.error("Delete error:", err);
    }
  }, [selectedRowIds, gridApi, clearSelection, fetchRecords]);

  return (
    <div className="w-full flex-1 flex flex-col min-h-0">
      <AgGridTable<InventoryRecord>
        rowData={rowData}
        columnDefs={columnDefs}
        isLoading={isLoading}
        rowSelection={rowSelection}
        rowHeight={44}
        dynamicViewportHeight={true}
        onGridReady={onGridReady}
        onSelectionChanged={onSelectionChanged}
        paginatorOptions={{
          current: currentPage,
          total: totalCount,
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
