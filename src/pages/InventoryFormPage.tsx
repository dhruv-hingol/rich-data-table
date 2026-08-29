import { lazy, Suspense } from "react";
import { RecordFormSkeleton } from "@/src/features/inventory/components/RecordFormSkeleton";

const RecordForm = lazy(() =>
  import("@/src/features/inventory/components/RecordForm").then((m) => ({
    default: m.RecordForm,
  }))
);

export function InventoryFormPage() {
  return (
    <Suspense fallback={<RecordFormSkeleton />}>
      <RecordForm />
    </Suspense>
  );
}

export default InventoryFormPage;
