import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  ModuleRegistry,
  AllCommunityModule,
  ValidationModule,
  type RowSelectionOptions,
} from "ag-grid-community";
import type { GridReadyEvent, GridApi, ColDef } from "ag-grid-community";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import type { AgGridTableProps } from "./types";
import DataTablePagination from "./table-pagination";
import { HashLoader } from "../ui/hash-loader";

ModuleRegistry.registerModules([AllCommunityModule, ValidationModule]);

const VIEWPORT_BOTTOM_GAP = 24;

export function AgGridTable<T>({
  rowData,
  columnDefs,
  defaultColDef: propDefaultColDef,
  isLoading = false,
  isFilterActive = false,
  paginatorOptions,
  rowHeight = 44,
  height,
  rootWrapperStyles,
  rootContainerClassName,
  dynamicViewportHeight = true,
  noRowsMessage = "No records found",
  rowSelection,
  onGridReady,
  onSortChanged,
  ...restProps
}: AgGridTableProps<T>) {
  const tableRef = useRef<HTMLDivElement>(null);
  const paginationRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<AgGridReact<T>>(null);
  const gridApiRef = useRef<GridApi<T> | null>(null);

  const [availableHeight, setAvailableHeight] = useState<number | undefined>(
    undefined,
  );

  const defaultColDef = useMemo<ColDef<T>>(
    () => ({
      width: 400,
      minWidth: 150,
      resizable: true,
      sortable: true,
      filter: true,
      ...propDefaultColDef,
    }),
    [propDefaultColDef],
  );

  // Configure selectionColumnDef to ensure checkbox column is pinned at index 0 as first column
  const defaultSelectionColumnDef = useMemo(
    () => ({
      width: 50,
      pinned: "left" as const,
      resizable: false,
      sortable: false,
      suppressMovable: true,
    }),
    [],
  );

  // Normalize rowSelection to AG Grid v36 RowSelectionOptions object format
  const normalizedRowSelection = useMemo<
    RowSelectionOptions<T> | undefined
  >(() => {
    if (!rowSelection) return undefined;
    if (typeof rowSelection === "object")
      return rowSelection as RowSelectionOptions<T>;
    if (rowSelection === "multiple") {
      return {
        mode: "multiRow",
        headerCheckbox: true,
        checkboxes: true,
        enableClickSelection: false,
      };
    }
    if (rowSelection === "single") {
      return {
        mode: "singleRow",
        checkboxes: true,
        enableClickSelection: false,
      };
    }
    return undefined;
  }, [rowSelection]);

  const handleGridReady = useCallback(
    (params: GridReadyEvent<T>) => {
      gridApiRef.current = params.api;
      if (onGridReady) {
        onGridReady(params);
      }
    },
    [onGridReady],
  );

  const handleSortChanged = useCallback(
    (event: any) => {
      if (!onSortChanged) return;
      const columnState = event.api.getColumnState();
      const sortedCol = columnState.find((col: any) => col.sort !== null);

      if (sortedCol) {
        const colDef = event.api.getColumnDef(sortedCol.colId) as any;
        const sortField = colDef?.sortField || sortedCol.colId;
        onSortChanged(sortField).onClick();
      } else {
        onSortChanged("").onClick();
      }
    },
    [onSortChanged],
  );

  useLayoutEffect(() => {
    if (!dynamicViewportHeight) return;

    const updateAvailableHeight = () => {
      if (!tableRef.current) return;

      const tableTop = tableRef.current.getBoundingClientRect().top;
      const paginationHeight = paginationRef.current?.offsetHeight ?? 0;

      // 10px gap between table grid and pagination
      const computedHeight = Math.max(
        200,
        window.innerHeight - tableTop - paginationHeight - VIEWPORT_BOTTOM_GAP - 10,
      );
      setAvailableHeight(computedHeight);
    };

    updateAvailableHeight();

    const resizeObserver = new ResizeObserver(updateAvailableHeight);
    if (paginationRef.current) resizeObserver.observe(paginationRef.current);
    if (tableRef.current?.parentElement) {
      resizeObserver.observe(tableRef.current.parentElement);
    }
    window.addEventListener("resize", updateAvailableHeight);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateAvailableHeight);
    };
  }, [dynamicViewportHeight, paginatorOptions]);

  // Compute responsive style: fits row content height when rows are few, capped by max availableHeight
  const gridContainerStyle = useMemo<React.CSSProperties>(() => {
    if (height !== undefined) {
      return { height: typeof height === "number" ? `${height}px` : height, width: "100%" };
    }
    if (dynamicViewportHeight && availableHeight !== undefined) {
      const headerHeight = 44;
      const rowCount = rowData ? Math.max(1, rowData.length) : 0;
      const contentHeight = headerHeight + rowCount * rowHeight + 4;
      const finalHeight = Math.min(contentHeight, availableHeight);
      return {
        height: `${finalHeight}px`,
        maxHeight: `${availableHeight}px`,
        width: "100%",
      };
    }
    return { height: "580px", width: "100%" };
  }, [height, dynamicViewportHeight, availableHeight, rowData, rowHeight]);

  return (
    <div
      className={`w-full flex flex-col flex-1 min-h-0 gap-2.5 ${rootContainerClassName || ""}`}
      style={rootWrapperStyles}
    >
      <div
        ref={tableRef}
        className="w-full bg-white border border-slate-200 rounded-xl overflow-hidden ag-theme-alpine ag-theme-custom-light relative shadow-xs transition-[height] duration-200"
        style={gridContainerStyle}
      >
        {/* Consistent Loading Overlay: Uses common animated HashLoader */}
        {isLoading && (
          <div className="absolute inset-0 z-30 bg-white/65 backdrop-blur-[1px] flex items-center justify-center animate-in fade-in duration-150 pointer-events-auto">
            <HashLoader size="md" />
          </div>
        )}

        <AgGridReact<T>
          ref={gridRef}
          theme="legacy"
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowSelection={normalizedRowSelection}
          selectionColumnDef={defaultSelectionColumnDef}
          rowHeight={rowHeight}
          headerHeight={44}
          onGridReady={handleGridReady}
          onSortChanged={onSortChanged ? handleSortChanged : undefined}
          animateRows={false}
          suppressCellFocus
          overlayNoRowsTemplate={`<span class="text-sm font-medium text-slate-500">${noRowsMessage}</span>`}
          {...restProps}
        />
      </div>

      {paginatorOptions && (
        <div ref={paginationRef} className="shrink-0">
          <DataTablePagination
            current={paginatorOptions.current}
            total={paginatorOptions.total}
            pageSize={paginatorOptions.pageSize}
            onChange={paginatorOptions.onChange}
            setPageSize={paginatorOptions.setPageSize}
          />
        </div>
      )}
    </div>
  );
}

export { DataTablePagination };
export type { AgGridTableProps, DataTablePaginationProps } from "./types";
