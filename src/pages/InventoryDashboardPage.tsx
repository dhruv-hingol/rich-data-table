import { TableToolbar } from "../features/inventory/components/TableToolbar";
import { AppliedFiltersBar } from "../features/inventory/components/AppliedFiltersBar";
import { InventoryTable } from "../features/inventory/components/InventoryTable";

export function InventoryDashboardPage() {
  return (
    <div className="flex-1 flex flex-col gap-3 w-full h-full min-h-0 overflow-hidden pt-5 md:pt-6">
      <TableToolbar />
      <AppliedFiltersBar />
      <InventoryTable />
    </div>
  );
}

export default InventoryDashboardPage;
