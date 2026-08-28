// Top action toolbar using common TableHeader with prefixIcon buttons.
import { useState, useEffect } from "react";
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

  // 1. Import CSV Button
  const importCsvButton = (
    <Button
      variant="outline"
      size="sm"
      prefixIcon={<Upload className="h-3.5 w-3.5" />}
      onClick={() => setIsBulkImportOpen(true)}
    >
      Import CSV
    </Button>
  );

  // 3. Add Inventory Button -> Navigates to /inventory/create
  const manageInventoryButton = (
    <Button
      variant="primary"
      size="sm"
      prefixIcon={<Plus className="h-4 w-4" />}
      onClick={() => navigate("/inventory/create")}
    >
      Add Inventory
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
