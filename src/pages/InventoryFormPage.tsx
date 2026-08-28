import { RecordForm } from "../features/inventory/components/RecordForm";

export function InventoryFormPage() {
  return (
    <div className="flex-1 flex flex-col w-full bg-white px-8 pb-8 pt-0 min-h-0 overflow-y-auto">
      <RecordForm />
    </div>
  );
}

export default InventoryFormPage;
