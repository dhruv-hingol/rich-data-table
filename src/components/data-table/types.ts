// Reusable data table type definitions matching reference codebase.
import type { ColDef } from 'ag-grid-community';
import type { AgGridReactProps } from 'ag-grid-react';
import type { CSSProperties } from 'react';

export interface DataTablePaginationProps {
  current: number; // 1-indexed page
  total: number;
  pageSize: number;
  onChange: (page: number) => void;
  setPageSize?: (pageSize: number) => void;
}

export type AgGridPaginatorOptions = Required<
  Pick<DataTablePaginationProps, 'current' | 'onChange' | 'pageSize' | 'total'>
> &
  Pick<DataTablePaginationProps, 'setPageSize'>;

export type AgGridTableProps<T> = {
  rowData: T[];
  columnDefs: ColDef<T>[];
  isLoading?: boolean;
  isFilterActive?: boolean;
  paginatorOptions?: AgGridPaginatorOptions;
  rowHeight?: number;
  height?: number | string;
  rootWrapperStyles?: CSSProperties;
  rootContainerClassName?: string;
  dynamicViewportHeight?: boolean;
  onSortChanged?: (field: string) => { onClick: () => void };
  noRowsMessage?: string;
} & Omit<AgGridReactProps<T>, 'rowData' | 'columnDefs' | 'onSortChanged'>;
