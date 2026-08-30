import { TableToolbar } from "@/src/features/inventory/components/TableToolbar";
import { AppliedFiltersBar } from "@/src/features/inventory/components/AppliedFiltersBar";
import { InventoryTable } from "@/src/features/inventory/components/InventoryTable";
import { useTableUrlSync } from "@/src/features/inventory/hooks/useTableUrlSync";

export function InventoryDashboardPage() {
  useTableUrlSync();

  return (
    <div className="flex-1 flex flex-col gap-2.5 sm:gap-3 w-full h-full min-h-0 overflow-hidden pt-3 sm:pt-5 md:pt-6">
      <TableToolbar />
      <AppliedFiltersBar />
      <InventoryTable />
    </div>
  );
}

export default InventoryDashboardPage;
