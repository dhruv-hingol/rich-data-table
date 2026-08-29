import React from "react";
import { Search, X, Filter } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export interface TableHeaderProps {
  title?: string;
  showSearch?: boolean;
  searchValue?: string;
  searchPlaceholder?: string;
  onSearchChange?: (val: string) => void;
  showFilterButton?: boolean;
  isFilterActive?: boolean;
  onFilterClick?: () => void;
  importCsvButton?: React.ReactNode;
  manageInventoryButton?: React.ReactNode;
  extraButtons?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export function TableHeader({
  title = "Inventories",
  showSearch = true,
  searchValue = "",
  searchPlaceholder = "Search by product name",
  onSearchChange,
  showFilterButton = true,
  isFilterActive = false,
  onFilterClick,
  importCsvButton,
  manageInventoryButton,
  extraButtons,
  children,
  className = "",
}: TableHeaderProps) {
  return (
    <div className={`flex flex-col gap-4 pt-1 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {title && (
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {title}
          </h1>
        )}

        <div className="flex flex-wrap items-center gap-3">
          {importCsvButton}

          {showFilterButton && (
            <Button
              variant="outline"
              size="sm"
              prefixIcon={<Filter className="h-3.5 w-3.5" />}
              onClick={onFilterClick}
              className="relative"
            >
              Filters
              {isFilterActive && (
                <span className="w-2 h-2 rounded-full bg-[#ff6600] absolute -top-1 -right-1" />
              )}
            </Button>
          )}
          {manageInventoryButton}
          {extraButtons}
          {children}
        </div>
      </div>

      {showSearch && (
        <div className="relative w-full sm:w-80 self-end">
          <Input
            type="text"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            className="pl-9 pr-8 py-2 text-xs bg-white border-slate-200 text-slate-900 placeholder-slate-400 rounded-lg focus:border-[#ff6600]"
          />
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400 pointer-events-none" />

          {searchValue && (
            <button
              type="button"
              onClick={() => onSearchChange && onSearchChange("")}
              className="absolute right-2.5 top-2.5 p-0.5 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default TableHeader;
