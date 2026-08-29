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
      <Input
        label="SKU"
        required
        placeholder="e.g. SKU-10023"
        errorMessage={errors.sku?.message}
        {...register("sku")}
      />

      <Input
        label="Product Name"
        required
        placeholder="e.g. Wireless Barcode Scanner"
        errorMessage={errors.name?.message}
        {...register("name")}
      />

      <Input
        label="Barcode"
        required
        placeholder="e.g. 8901234567890"
        errorMessage={errors.barcode?.message}
        {...register("barcode")}
      />

      <Select
        label="Category"
        required
        labelClassName="font-medium text-slate-700 mb-1.5"
        options={categoryOptions}
        value={watchCategory}
        onChange={(val) => setValue("category", val)}
      />

      <Input
        label="Subcategory"
        placeholder="e.g. Handheld Scanners"
        {...register("subcategory")}
      />

      <Input
        label="Brand"
        required
        placeholder="e.g. Zebra Technologies"
        {...register("brand")}
      />
    </FormSection>
  );
}

export default ProductDetailsSection;
