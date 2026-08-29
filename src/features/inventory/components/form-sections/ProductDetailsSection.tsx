import React from "react";
import type { UseFormRegister, FieldErrors, UseFormSetValue } from "react-hook-form";
import { FormSection } from "../../../../components/ui/form-section";
import { Input } from "../../../../components/ui/input";
import { Select, type SelectOption } from "../../../../components/ui/select";
import type { RecordSchemaInput } from "../../lib/recordSchema";

export interface ProductDetailsSectionProps {
  register: UseFormRegister<RecordSchemaInput>;
  errors: FieldErrors<RecordSchemaInput>;
  watchCategory: string;
  categoryOptions: SelectOption[];
  setValue: UseFormSetValue<RecordSchemaInput>;
}

export function ProductDetailsSection({
  register,
  errors,
  watchCategory,
  categoryOptions,
  setValue,
}: ProductDetailsSectionProps) {
  return (
    <FormSection id="sec-details" title="Details">
      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1.5">
          SKU *
        </label>
        <Input
          {...register("sku")}
          error={!!errors.sku}
          placeholder="e.g. SKU-10023"
        />
        {errors.sku && (
          <p className="text-[11px] text-rose-500 mt-1">
            {errors.sku.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1.5">
          Product Name *
        </label>
        <Input
          {...register("name")}
          error={!!errors.name}
          placeholder="e.g. Wireless Barcode Scanner"
        />
        {errors.name && (
          <p className="text-[11px] text-rose-500 mt-1">
            {errors.name.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1.5">
          Barcode *
        </label>
        <Input
          {...register("barcode")}
          error={!!errors.barcode}
          placeholder="e.g. 8901234567890"
        />
        {errors.barcode && (
          <p className="text-[11px] text-rose-500 mt-1">
            {errors.barcode.message}
          </p>
        )}
      </div>

      <Select
        label="Category *"
        labelClassName="font-medium text-slate-700 mb-1.5"
        options={categoryOptions}
        value={watchCategory}
        onChange={(val) => setValue("category", val)}
      />

      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1.5">
          Subcategory
        </label>
        <Input
          {...register("subcategory")}
          placeholder="e.g. Handheld Scanners"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1.5">
          Brand *
        </label>
        <Input
          {...register("brand")}
          placeholder="e.g. Zebra Technologies"
        />
      </div>
    </FormSection>
  );
}

export default ProductDetailsSection;
