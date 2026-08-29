/* eslint-disable react-refresh/only-export-components */
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { DataTablePaginationProps } from "./types";
import { Select } from "../ui/select";

export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100] as const;

export function DataTablePagination({
  current,
  total,
  pageSize,
  onChange,
  setPageSize,
}: DataTablePaginationProps) {
  const totalPages = Math.ceil(total / pageSize) || 1;

  const getPageItems = (): (number | "ellipsis-left" | "ellipsis-right")[] => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (current <= 3) {
      return [1, 2, 3, 4, "ellipsis-right", totalPages];
    }

    if (current >= totalPages - 2) {
      return [
        1,
        "ellipsis-left",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      1,
      "ellipsis-left",
      current - 1,
      current,
      current + 1,
      "ellipsis-right",
      totalPages,
    ];
  };

  const pageItems = getPageItems();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 py-2.5 px-3 sm:px-4 text-slate-700 text-sm w-full">
      <div className="flex flex-wrap items-center justify-between sm:justify-start gap-2 sm:gap-3 w-full sm:w-auto">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium whitespace-nowrap">
            Rows per page:
          </span>
          <Select
            options={PAGE_SIZE_OPTIONS.map((size) => ({
              label: String(size),
              value: size,
            }))}
            value={pageSize}
            onChange={(val) => setPageSize && setPageSize(Number(val))}
            size="sm"
            className="w-20"
            menuClassName="bottom-full mb-1.5 mt-0"
          />
        </div>
        <span className="text-xs text-slate-500 border-l border-slate-200 pl-3">
          <strong className="text-slate-800 font-semibold">
            {total > 0 ? (current - 1) * pageSize + 1 : 0}
          </strong>{" "}
          -{" "}
          <strong className="text-slate-800 font-semibold">
            {Math.min(current * pageSize, total)}
          </strong>{" "}
          of <strong className="text-slate-800 font-semibold">{total}</strong>
        </span>
      </div>

      <div className="flex items-center justify-center gap-1 max-w-full overflow-x-auto py-1">
        <button
          type="button"
          onClick={() => onChange(Math.max(1, current - 1))}
          disabled={current === 1}
          className="w-8 h-8 rounded-lg text-slate-600 flex items-center justify-center hover:bg-slate-100 hover:text-slate-900 disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-colors text-xs shrink-0"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4.5 w-4.5" />
        </button>

        {pageItems.map((item, idx) => {
          if (item === "ellipsis-left" || item === "ellipsis-right") {
            return (
              <span
                key={`${item}-${idx}`}
                className="w-7 h-8 flex items-center justify-center text-xs text-slate-400 font-semibold select-none shrink-0"
              >
                ...
              </span>
            );
          }

          const pageNum = item as number;
          const isActive = pageNum === current;

          return (
            <button
              key={pageNum}
              type="button"
              onClick={() => onChange(pageNum)}
              className={`w-7 h-8 sm:w-8 sm:h-8 rounded-lg text-xs font-semibold flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                isActive
                  ? "bg-[#ff6600] text-white shadow-xs"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => onChange(Math.min(totalPages, current + 1))}
          disabled={current === totalPages}
          className="w-8 h-8 rounded-lg text-slate-600 flex items-center justify-center hover:bg-slate-100 hover:text-slate-900 disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-colors text-xs shrink-0"
          aria-label="Next page"
        >
          <ChevronRight className="h-4.5 w-4.5" />
        </button>
      </div>
    </div>
  );
}

export default DataTablePagination;
