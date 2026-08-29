import type { UseFormRegister, FieldErrors, UseFormSetValue } from "react-hook-form";
import { FormSection } from "@/src/components/ui/form-section";
import { Input } from "@/src/components/ui/input";
import { Select, type SelectOption } from "@/src/components/ui/select";
import type { RecordSchemaInput } from "@/src/features/inventory/lib/recordSchema";

export interface StockLocationSectionProps {
  register: UseFormRegister<RecordSchemaInput>;
  errors: FieldErrors<RecordSchemaInput>;
  watchWarehouse: string;
  warehouseOptions: SelectOption[];
  setValue: UseFormSetValue<RecordSchemaInput>;
}

export function StockLocationSection({
  register,
  errors,
  watchWarehouse,
  warehouseOptions,
  setValue,
}: StockLocationSectionProps) {
  return (
    <FormSection id="sec-inventory" title="Stock & Location">
      <Select
        label="Warehouse"
        required
        labelClassName="font-medium text-slate-700 mb-1.5"
        options={warehouseOptions}
        value={watchWarehouse}
        onChange={(val) => setValue("warehouse", val)}
      />

      <Input
        label="Qty On Hand"
        required
        type="number"
        placeholder="e.g. 150"
        errorMessage={errors.qtyOnHand?.message}
        {...register("qtyOnHand")}
      />

      <Input
        label="Qty Reserved"
        type="number"
        placeholder="e.g. 25"
        {...register("qtyReserved")}
      />

      <Input
        label="Reorder Point"
        required
        type="number"
        placeholder="e.g. 30"
        errorMessage={errors.reorderPoint?.message}
        {...register("reorderPoint")}
      />

      <Input
        label="Reorder Qty"
        type="number"
        placeholder="e.g. 100"
        {...register("reorderQty")}
      />

      <Input
        label="Bin Location"
        required
        placeholder="e.g. A-12-04"
        {...register("binLocation")}
      />
    </FormSection>
  );
}

export default StockLocationSection;
