import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  ModuleRegistry,
  AllCommunityModule,
  ValidationModule,
  type RowSelectionOptions,
} from "ag-grid-community";
import type { GridReadyEvent, GridApi } from "ag-grid-community";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import type { AgGridTableProps } from "./types";
import DataTablePagination from "./table-pagination";

ModuleRegistry.registerModules([AllCommunityModule, ValidationModule]);

const VIEWPORT_BOTTOM_GAP = 24;

export function AgGridTable<T>({
  rowData,
  columnDefs,
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

  const defaultColDef = useMemo(
    () => ({
      resizable: true,
      sortable: true,
      filter: true,
    }),
    [],
  );

  // Normalize rowSelection to AG Grid v36 RowSelectionOptions object format to avoid #306 deprecation warnings
  const normalizedRowSelection = useMemo<RowSelectionOptions<T> | undefined>(() => {
    if (!rowSelection) return undefined;
    if (typeof rowSelection === "object") return rowSelection as RowSelectionOptions<T>;
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

      const computedHeight = Math.max(
        200,
        window.innerHeight - tableTop - paginationHeight - VIEWPORT_BOTTOM_GAP,
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

  const gridHeightStyle = useMemo(() => {
    if (height !== undefined) {
      return typeof height === "number" ? `${height}px` : height;
    }
    if (dynamicViewportHeight && availableHeight !== undefined) {
      return `${availableHeight}px`;
    }
    return "580px";
  }, [height, dynamicViewportHeight, availableHeight]);

  return (
    <div
      className={`w-full flex flex-col flex-1 min-h-0 ${rootContainerClassName || ""}`}
      style={rootWrapperStyles}
    >
      <div
        ref={tableRef}
        className="w-full bg-white border border-slate-200 rounded-xl overflow-hidden ag-theme-alpine ag-theme-custom-light relative shadow-xs"
        style={{ height: gridHeightStyle, width: "100%" }}
      >
        {isLoading && (
          <div className="absolute inset-0 z-10 bg-white/70 backdrop-blur-xs flex items-center justify-center">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#ff6600]">
              <div className="w-5 h-5 border-2 border-[#ff6600] border-t-transparent rounded-full animate-spin" />
              <span>Loading data...</span>
            </div>
          </div>
        )}

        <AgGridReact<T>
          ref={gridRef}
          theme="legacy"
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowSelection={normalizedRowSelection}
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
