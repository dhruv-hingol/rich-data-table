import { lazy, Suspense } from "react";
import { HashLoader } from "@/src/components/ui/hash-loader";

const TableToolbar = lazy(() =>
  import("@/src/features/inventory/components/TableToolbar").then((m) => ({
    default: m.TableToolbar,
  }))
);
const AppliedFiltersBar = lazy(() =>
  import("@/src/features/inventory/components/AppliedFiltersBar").then((m) => ({
    default: m.AppliedFiltersBar,
  }))
);
const InventoryTable = lazy(() =>
  import("@/src/features/inventory/components/InventoryTable").then((m) => ({
    default: m.InventoryTable,
  }))
);

export function InventoryDashboardPage() {
  return (
    <div className="flex-1 flex flex-col gap-2.5 sm:gap-3 w-full h-full min-h-0 overflow-hidden pt-3 sm:pt-5 md:pt-6">
      <Suspense
        fallback={
          <div className="flex-1 w-full h-full flex items-center justify-center">
            <HashLoader size="md" />
          </div>
        }
      >
        <TableToolbar />
        <AppliedFiltersBar />
        <InventoryTable />
      </Suspense>
    </div>
  );
}

export default InventoryDashboardPage;
