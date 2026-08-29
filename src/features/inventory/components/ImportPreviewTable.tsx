import { useMemo } from "react";
import type { ColDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import type { ParseResult } from "../lib/csvParser";

export interface PreviewRow {
  rowNumber: number;
  sku: string;
  name: string;
  category: string;
  warehouse: string;
  status: "Valid" | "Invalid";
  error: string;
}

export interface ImportPreviewTableProps {
  parseResult: ParseResult;
}

export function ImportPreviewTable({ parseResult }: ImportPreviewTableProps) {
  const rowData = useMemo<PreviewRow[]>(() => {
    const valid: PreviewRow[] = parseResult.validRows.map((row, idx) => ({
      rowNumber: idx + 1,
      sku: row.sku || "-",
      name: row.name || "-",
      category: row.category || "-",
      warehouse: row.warehouse || "-",
      status: "Valid",
      error: "",
    }));

    const invalid: PreviewRow[] = parseResult.invalidRows.map((item) => ({
      rowNumber: item.rowNumber,
      sku: String(item.raw?.sku || "-"),
      name: String(item.raw?.name || "-"),
      category: String(item.raw?.category || "-"),
      warehouse: String(item.raw?.warehouse || "-"),
      status: "Invalid",
      error: item.errors.join(", ") || "Invalid record format",
    }));

    return [...valid, ...invalid];
  }, [parseResult]);

  const columnDefs = useMemo<ColDef<PreviewRow>[]>(
    () => [
      {
        field: "rowNumber",
        headerName: "Row",
        width: 70,
        sortable: true,
      },
      {
        field: "sku",
        headerName: "SKU",
        width: 140,
        sortable: true,
        cellRenderer: (params: { value: string; data?: PreviewRow }) => (
          <span
            className={`font-mono text-xs ${
              params.data?.status === "Invalid"
                ? "text-rose-600 font-semibold"
                : "text-[#ff6600] font-semibold"
            }`}
          >
            {params.value}
          </span>
        ),
      },
      {
        field: "name",
        headerName: "Product Name",
        width: 180,
        sortable: true,
      },
      {
        field: "status",
        headerName: "Status",
        width: 100,
        sortable: true,
        cellRenderer: (params: { value: string }) =>
          params.value === "Valid" ? (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold  text-emerald-700">
              Valid
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold  text-rose-700">
              Invalid
            </span>
          ),
      },
      {
        field: "error",
        headerName: "Validation Error / Reason",
        flex: 1,
        minWidth: 200,
        cellRenderer: (params: { value: string }) => (
          <span className="text-xs text-rose-600 font-medium">
            {params.value || "-"}
          </span>
        ),
      },
    ],
    [],
  );

  return (
    <div className="ag-theme-alpine w-full h-64 rounded-lg overflow-hidden border border-slate-200">
      <AgGridReact<PreviewRow>
        theme="legacy"
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={{
          resizable: true,
          sortable: true,
        }}
        rowHeight={38}
        headerHeight={36}
      />
    </div>
  );
}

export default ImportPreviewTable;
