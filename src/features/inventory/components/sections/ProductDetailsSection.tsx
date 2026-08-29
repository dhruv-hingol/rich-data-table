import type {
  UseFormRegister,
  FieldErrors,
  UseFormSetValue,
} from "react-hook-form";
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
        <Input {...register("sku")} error={!!errors.sku} />
        {errors.sku && (
          <p className="text-[11px] text-rose-500 mt-1">{errors.sku.message}</p>
        )}
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1.5">
          Product Name *
        </label>
        <Input
          {...register("name")}
          error={!!errors.name}
          placeholder="e.g. Barcode Scanner"
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
        <Input {...register("barcode")} error={!!errors.barcode} />
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
        <Input {...register("subcategory")} />
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1.5">
          Brand *
        </label>
        <Input {...register("brand")} />
      </div>
    </FormSection>
  );
}

export default ProductDetailsSection;
