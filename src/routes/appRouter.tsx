import { Routes, Route, Navigate } from "react-router-dom";
import { InventoryDashboardPage } from "../pages/InventoryDashboardPage";
import { InventoryFormPage } from "../pages/InventoryFormPage";

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<InventoryDashboardPage />} />
      <Route path="/inventory" element={<InventoryDashboardPage />} />

      <Route path="/inventory/create" element={<InventoryFormPage />} />
      <Route path="/inventory/:id" element={<InventoryFormPage />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRouter;
