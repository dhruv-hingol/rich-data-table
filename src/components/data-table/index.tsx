import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AgGridReact } from "ag-grid-react";
import {
  ModuleRegistry,
  AllCommunityModule,
  ValidationModule,
  type RowSelectionOptions,
  type SortChangedEvent,
  type ColumnState,
} from "ag-grid-community";
import type { GridReadyEvent, GridApi, ColDef } from "ag-grid-community";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import { renderToString } from "react-dom/server";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
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
  void isFilterActive;
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
      unSortIcon: true,
      filter: true,
      ...propDefaultColDef,
    }),
    [propDefaultColDef],
  );

  const gridIcons = useMemo(
    () => ({
      sortUnSort: renderToString(
        <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 opacity-70" />,
      ),
      sortAscending: renderToString(
        <ArrowUp className="w-3.5 h-3.5 text-[#ff6600]" />,
      ),
      sortDescending: renderToString(
        <ArrowDown className="w-3.5 h-3.5 text-[#ff6600]" />,
      ),
    }),
    [],
  );

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
      if (isLoading) {
        params.api.hideOverlay();
      } else if (!rowData || rowData.length === 0) {
        params.api.showNoRowsOverlay();
      }
      if (onGridReady) {
        onGridReady(params);
      }
    },
    [onGridReady, isLoading, rowData],
  );

  useEffect(() => {
    if (!gridApiRef.current) return;
    if (isLoading) {
      gridApiRef.current.hideOverlay();
    } else if (!rowData || rowData.length === 0) {
      gridApiRef.current.showNoRowsOverlay();
    } else {
      gridApiRef.current.hideOverlay();
    }
  }, [isLoading, rowData]);

  const handleSortChanged = useCallback(
    (event: SortChangedEvent<T>) => {
      if (!onSortChanged) return;
      const columnState = event.api.getColumnState();
      const sortedCol = columnState.find(
        (col: ColumnState) => col.sort !== null,
      );

      if (sortedCol) {
        const colDef = event.api.getColumnDef(sortedCol.colId);
        const sortField =
          (colDef as { sortField?: string })?.sortField || sortedCol.colId;
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
      let siblingBottomHeight = 0;

      const agGridTableRoot =
        tableRef.current.closest(".w-full.flex.flex-col") || tableRef.current;
      const parentContainer = agGridTableRoot.parentElement;

      if (parentContainer) {
        const children = Array.from(parentContainer.children);
        const agGridIndex = children.indexOf(agGridTableRoot);

        if (agGridIndex !== -1) {
          for (let i = agGridIndex + 1; i < children.length; i++) {
            const child = children[i] as HTMLElement;
            const style = window.getComputedStyle(child);
            if (style.position !== "absolute" && style.position !== "fixed") {
              const marginTop = parseFloat(style.marginTop) || 0;
              const marginBottom = parseFloat(style.marginBottom) || 0;
              siblingBottomHeight += child.offsetHeight + marginTop + marginBottom;
            }
          }
        }
      }

      const paginationHeight = paginationRef.current?.offsetHeight ?? 0;

      const computedHeight = Math.max(
        200,
        window.innerHeight -
          tableTop -
          siblingBottomHeight -
          paginationHeight -
          VIEWPORT_BOTTOM_GAP,
      );
      setAvailableHeight(computedHeight);
    };

    updateAvailableHeight();

    const resizeObserver = new ResizeObserver(updateAvailableHeight);
    if (paginationRef.current) resizeObserver.observe(paginationRef.current);

    const agGridTableRoot =
      tableRef.current?.closest(".w-full.flex.flex-col") || tableRef.current;
    if (agGridTableRoot?.parentElement) {
      const parent = agGridTableRoot.parentElement;
      resizeObserver.observe(parent);
      Array.from(parent.children).forEach((child) => {
        resizeObserver.observe(child);
      });
    }
    window.addEventListener("resize", updateAvailableHeight);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateAvailableHeight);
    };
  }, [dynamicViewportHeight, paginatorOptions]);

  const gridContainerStyle = useMemo<React.CSSProperties>(() => {
    if (height !== undefined) {
      return {
        height: typeof height === "number" ? `${height}px` : height,
        minHeight: typeof height === "number" ? `${height}px` : height,
        width: "100%",
      };
    }
    if (dynamicViewportHeight && availableHeight !== undefined) {
      return {
        height: `${availableHeight}px`,
        minHeight: `${availableHeight}px`,
        maxHeight: `${availableHeight}px`,
        width: "100%",
      };
    }
    return { height: "580px", minHeight: "580px", width: "100%" };
  }, [height, dynamicViewportHeight, availableHeight]);

  return (
    <div
      className={`w-full flex flex-col flex-1 min-h-0 gap-2.5 ${rootContainerClassName || ""}`}
      style={rootWrapperStyles}
    >
      <div
        ref={tableRef}
        className="w-full bg-white border border-slate-200 rounded-xl overflow-hidden ag-theme-alpine ag-theme-custom-light relative shadow-xs"
        style={gridContainerStyle}
      >
        {/* Consistent Loading Overlay: Uses common animated HashLoader */}
        {isLoading && (
          <div className="absolute inset-0 z-30 bg-white/75 backdrop-blur-[1px] flex flex-col items-center justify-center gap-2.5 animate-in fade-in duration-150 pointer-events-auto">
            <HashLoader size="md" />
          </div>
        )}

        <AgGridReact<T>
          ref={gridRef}
          theme="legacy"
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          icons={gridIcons}
          rowSelection={normalizedRowSelection}
          selectionColumnDef={defaultSelectionColumnDef}
          rowHeight={rowHeight}
          headerHeight={44}
          onGridReady={handleGridReady}
          onSortChanged={onSortChanged ? handleSortChanged : undefined}
          animateRows={false}
          suppressCellFocus
          suppressScrollOnNewData={true}
          suppressNoRowsOverlay={isLoading}
          getRowId={(params) =>
            (params.data as { id?: string })?.id || String(Math.random())
          }
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
