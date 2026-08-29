import type { UseFormRegister, FieldErrors } from "react-hook-form";
import { FormSection } from "../../../../components/ui/form-section";
import { Input } from "../../../../components/ui/input";
import type { RecordSchemaInput } from "../../lib/recordSchema";

export interface SupplierInfoSectionProps {
  register: UseFormRegister<RecordSchemaInput>;
  errors?: FieldErrors<RecordSchemaInput>;
}

export function SupplierInfoSection({
  register,
  errors,
}: SupplierInfoSectionProps) {
  return (
    <FormSection id="sec-supplier" title="Supplier Info">
      <Input
        label="Supplier Name *"
        placeholder="e.g. Acme Tech Solutions Pvt Ltd"
        errorMessage={errors?.supplierName?.message}
        {...register("supplierName")}
      />

      <Input
        label="Supplier SKU"
        placeholder="e.g. SUP-ZB-990"
        errorMessage={errors?.supplierSku?.message}
        {...register("supplierSku")}
      />

      <Input
        label="Lead Time (Days)"
        type="number"
        placeholder="e.g. 7"
        errorMessage={errors?.leadTimeDays?.message}
        {...register("leadTimeDays")}
      />

      <Input
        label="Min Order Qty"
        type="number"
        placeholder="e.g. 10"
        errorMessage={errors?.minOrderQty?.message}
        {...register("minOrderQty")}
      />
    </FormSection>
  );
}

export default SupplierInfoSection;
