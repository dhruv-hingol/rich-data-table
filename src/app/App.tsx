import { Toaster } from "sonner";
import { AppRouter } from "../routes/appRouter";
import { FilterSheet } from "../features/inventory/components/FilterSheet";
import { BulkImportDialog } from "../features/inventory/components/BulkImportDialog";

export default function App() {
  return (
    <div className="h-screen w-screen max-h-screen max-w-screen overflow-hidden bg-[#fff] text-slate-900 flex flex-col font-sans antialiased">
      <Toaster position="top-center" richColors closeButton />
      <main className="flex-1 max-w-[1920px] w-full mx-auto flex flex-col min-h-0 overflow-y-auto px-6 pb-6 md:px-8 md:pb-8 pt-0">
        <AppRouter />
      </main>
      <FilterSheet />
      <BulkImportDialog />
    </div>
  );
}
