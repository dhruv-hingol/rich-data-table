import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import type { DataTablePaginationProps } from "./types";

export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100] as const;

function RowsPerPageSelector({
  pageSize,
  setPageSize,
}: {
  pageSize: number;
  setPageSize?: (size: number) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`h-8 pl-3 pr-2.5 py-1 text-sm bg-white border rounded-lg text-slate-800 font-medium focus:outline-none cursor-pointer transition-all inline-flex items-center gap-2 ${
          isOpen
            ? "border-[#ff6600] ring-1 ring-[#ff6600]"
            : "border-slate-200 hover:border-[#ff6600]"
        }`}
      >
        <span>{pageSize}</span>
        <ChevronDown
          className={`h-4 w-4 text-slate-600 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-[#ff6600]" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 bottom-full mb-1.5 z-50 w-20 bg-white rounded-xl shadow-xl border border-slate-200 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
          {PAGE_SIZE_OPTIONS.map((size) => {
            const isSelected = size === pageSize;
            return (
              <button
                key={size}
                type="button"
                onClick={() => {
                  setPageSize?.(size);
                  setIsOpen(false);
                }}
                className={`w-full text-center px-3 py-2 text-sm font-semibold transition-colors cursor-pointer block ${
                  isSelected
                    ? "bg-slate-100 text-[#ff6600] font-bold"
                    : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function DataTablePagination({
  current,
  total,
  pageSize,
  onChange,
  setPageSize,
}: DataTablePaginationProps) {
  const totalPages = Math.ceil(total / pageSize) || 1;

  // Generate page numbers range around current page
  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, current - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-3 px-2 bg-white text-slate-700 text-sm border-t border-slate-100">
      {/* Left: Rows Per Page Selector matching Screenshot UI */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-500 font-medium">
          Rows per page:
        </span>
        <RowsPerPageSelector pageSize={pageSize} setPageSize={setPageSize} />
      </div>

      {/* Right: Page Navigation Controls */}
      <div className="flex items-center gap-1">
        {/* Previous Page Button */}
        <button
          type="button"
          onClick={() => onChange(Math.max(1, current - 1))}
          disabled={current === 1}
          className="w-8 h-8 rounded-lg border border-slate-200 text-slate-600 flex items-center justify-center hover:bg-slate-50 hover:text-slate-900 disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-colors text-xs"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Page Number Buttons */}
        {pageNumbers.map((page) => {
          const isActive = page === current;
          return (
            <button
              key={page}
              type="button"
              onClick={() => onChange(page)}
              className={`w-8 h-8 rounded-lg text-xs font-semibold flex items-center justify-center transition-colors cursor-pointer ${
                isActive
                  ? "bg-[#ff6600] text-white shadow-xs"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              {page}
            </button>
          );
        })}

        {/* Next Page Button */}
        <button
          type="button"
          onClick={() => onChange(Math.min(totalPages, current + 1))}
          disabled={current === totalPages}
          className="w-8 h-8 rounded-lg border border-slate-200 text-slate-600 flex items-center justify-center hover:bg-slate-50 hover:text-slate-900 disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-colors text-xs"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default DataTablePagination;
