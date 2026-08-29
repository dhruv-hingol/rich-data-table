import React from "react";
import type { UseFormRegister, FieldErrors, UseFormSetValue } from "react-hook-form";
import { FormSection } from "../../../../components/ui/form-section";
import { Input } from "../../../../components/ui/input";
import { Select, type SelectOption } from "../../../../components/ui/select";
import type { RecordSchemaInput } from "../../lib/recordSchema";

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
        label="Warehouse *"
        labelClassName="font-medium text-slate-700 mb-1.5"
        options={warehouseOptions}
        value={watchWarehouse}
        onChange={(val) => setValue("warehouse", val)}
      />

      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1.5">
          Qty On Hand *
        </label>
        <Input
          type="number"
          {...register("qtyOnHand")}
          error={!!errors.qtyOnHand}
          placeholder="e.g. 150"
        />
        {errors.qtyOnHand && (
          <p className="text-[11px] text-rose-500 mt-1">
            {errors.qtyOnHand.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1.5">
          Qty Reserved
        </label>
        <Input
          type="number"
          {...register("qtyReserved")}
          placeholder="e.g. 25"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1.5">
          Reorder Point *
        </label>
        <Input
          type="number"
          {...register("reorderPoint")}
          error={!!errors.reorderPoint}
          placeholder="e.g. 30"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1.5">
          Reorder Qty
        </label>
        <Input
          type="number"
          {...register("reorderQty")}
          placeholder="e.g. 100"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1.5">
          Bin Location *
        </label>
        <Input {...register("binLocation")} placeholder="e.g. A-12-04" />
      </div>
    </FormSection>
  );
}

export default StockLocationSection;
