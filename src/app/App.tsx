import { Routes, Route, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { InventoryTable } from "../features/inventory/components/InventoryTable";
import { TableToolbar } from "../features/inventory/components/TableToolbar";
import { RecordForm } from "../features/inventory/components/RecordForm";
import { FilterSheet } from "../features/inventory/components/FilterSheet";
import { BulkImportDialog } from "../features/inventory/components/BulkImportDialog";

function InventoryDashboardView() {
  return (
    <div className="flex-1 flex flex-col gap-4 w-full h-full min-h-0 overflow-hidden">
      <TableToolbar />
      <InventoryTable />
    </div>
  );
}

function RecordFormView() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col max-w-4xl w-full mx-auto bg-white border border-slate-200 rounded-xl p-8 shadow-sm max-h-[calc(100vh-64px)] overflow-y-auto">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6 shrink-0">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Add Inventory Record
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Fill in product classification, inventory stock levels, pricing, and
            supplier details.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate("/")}>
          Back to Table
        </Button>
      </div>
      <RecordForm />
    </div>
  );
}

export default function App() {
  return (
    <div className="h-screen w-screen max-h-screen max-w-screen overflow-hidden bg-[#f8fafc] text-slate-900 flex flex-col font-sans antialiased p-6">
      <main className="flex-1 max-w-[1920px] w-full mx-auto flex flex-col min-h-0 overflow-hidden">
        <Routes>
          <Route path="/" element={<InventoryDashboardView />} />
          <Route path="/inventory" element={<InventoryDashboardView />} />
          <Route path="/inventory/new" element={<RecordFormView />} />
          <Route path="/inventory/edit/:id" element={<RecordFormView />} />
        </Routes>
      </main>

      {/* Global Filter Drawer & Import Dialog */}
      <FilterSheet />
      <BulkImportDialog />
    </div>
  );
}
