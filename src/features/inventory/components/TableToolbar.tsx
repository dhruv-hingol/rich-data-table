// Top action toolbar using common TableHeader with Import CSV -> Filters -> Manage Inventory button order.
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, Plus } from "lucide-react";
import { useTableUIStore } from "../store/useTableUIStore";
import { useDebouncedValue } from "../../../hooks/useDebouncedValue";
import { TableHeader } from "../../../components/tables/table-header";
import { Button } from "../../../components/ui/button";

interface TableToolbarProps {
  title?: string;
  showSearch?: boolean;
  showFilterButton?: boolean;
}

export function TableToolbar({
  title = "Inventories",
  showSearch = true,
  showFilterButton = true,
}: TableToolbarProps) {
  const navigate = useNavigate();
  const {
    searchQuery,
    setSearchQuery,
    setIsColumnManagerOpen,
    setIsBulkImportOpen,
    statusFilter,
  } = useTableUIStore();
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const debouncedSearch = useDebouncedValue(localSearch, 300);

  useEffect(() => {
    setSearchQuery(debouncedSearch);
  }, [debouncedSearch, setSearchQuery]);

  // 1. Import CSV Button (with Upload React Icon)
  const importCsvButton = (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setIsBulkImportOpen(true)}
      className="text-xs font-semibold text-slate-700 bg-white border-slate-200 hover:bg-slate-50 flex items-center gap-1.5"
    >
      <Upload className="h-3.5 w-3.5 text-slate-500" />
      <span>Import CSV</span>
    </Button>
  );

  // 3. Manage Inventory Button (with Plus React Icon)
  const manageInventoryButton = (
    <Button
      variant="primary"
      size="sm"
      onClick={() => navigate("/inventory/new")}
      className="bg-[#ff6600] hover:bg-[#e55c00] text-white font-semibold flex items-center gap-1.5 shadow-xs"
    >
      <Plus className="h-4 w-4" />
      <span>Add Inventory</span>
    </Button>
  );

  return (
    <TableHeader
      title={title}
      showSearch={showSearch}
      searchValue={localSearch}
      searchPlaceholder="Search by product name"
      onSearchChange={setLocalSearch}
      showFilterButton={showFilterButton}
      isFilterActive={statusFilter !== "ALL"}
      onFilterClick={() => setIsColumnManagerOpen(true)}
      importCsvButton={importCsvButton}
      manageInventoryButton={manageInventoryButton}
    />
  );
}
