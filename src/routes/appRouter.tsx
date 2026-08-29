import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { HashLoader } from "@/src/components/ui/hash-loader";

const InventoryDashboardPage = lazy(
  () => import("@/src/pages/InventoryDashboardPage")
);
const InventoryFormPage = lazy(() => import("@/src/pages/InventoryFormPage"));

const PageFallback = () => (
  <div className="flex-1 w-full h-full flex items-center justify-center py-20">
    <HashLoader size="md" />
  </div>
);

export function AppRouter() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route path="/" element={<InventoryDashboardPage />} />
        <Route path="/inventory" element={<InventoryDashboardPage />} />

        <Route path="/inventory/create" element={<InventoryFormPage />} />
        <Route path="/inventory/:id" element={<InventoryFormPage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default AppRouter;
