import { Routes, Route } from "react-router-dom";
import { InventoryTable } from "../features/inventory/components/InventoryTable";
import { TableToolbar } from "../features/inventory/components/TableToolbar";
import { AppliedFiltersBar } from "../features/inventory/components/AppliedFiltersBar";
import { RecordForm } from "../features/inventory/components/RecordForm";
import { FilterSheet } from "../features/inventory/components/FilterSheet";
import { BulkImportDialog } from "../features/inventory/components/BulkImportDialog";

function InventoryDashboardView() {
  return (
    <div className="flex-1 flex flex-col gap-3 w-full h-full min-h-0 overflow-hidden">
      <TableToolbar />
      <AppliedFiltersBar />
      <InventoryTable />
    </div>
  );
}

function RecordFormView() {
  return (
    <div className="flex-1 flex flex-col w-full bg-white px-8 pb-8 pt-0 min-h-0 overflow-y-auto">
      <RecordForm />
    </div>
  );
}

export default function App() {
  return (
    <div className="h-screen w-screen max-h-screen max-w-screen overflow-hidden bg-[#fff] text-slate-900 flex flex-col font-sans antialiased p-5">
      <main className="flex-1 max-w-[1920px] w-full mx-auto flex flex-col min-h-0 overflow-hidden">
        <Routes>
          <Route path="/" element={<InventoryDashboardView />} />
          <Route path="/inventory" element={<InventoryDashboardView />} />
          <Route path="/inventory/create" element={<RecordFormView />} />
          <Route path="/inventory/new" element={<RecordFormView />} />
          <Route path="/inventory/:id" element={<RecordFormView />} />
          <Route path="/inventory/edit/:id" element={<RecordFormView />} />
        </Routes>
      </main>

      {/* Global Filter Drawer & Import Dialog */}
      <FilterSheet />
      <BulkImportDialog />
    </div>
  );
}
