import React from "react";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import { FormSection } from "../../../../components/ui/form-section";
import { Input } from "../../../../components/ui/input";
import type { RecordSchemaInput } from "../../lib/recordSchema";

export interface PricingFinancialSectionProps {
  register: UseFormRegister<RecordSchemaInput>;
  errors?: FieldErrors<RecordSchemaInput>;
}

export function PricingFinancialSection({
  register,
  errors,
}: PricingFinancialSectionProps) {
  return (
    <FormSection id="sec-pricing" title="Pricing & Financial">
      <Input
        label="Unit Cost (₹) *"
        type="number"
        step="0.01"
        placeholder="e.g. 450.00"
        errorMessage={errors?.unitCost?.message}
        {...register("unitCost")}
      />

      <Input
        label="List Price (₹) *"
        type="number"
        step="0.01"
        placeholder="e.g. 899.00"
        errorMessage={errors?.listPrice?.message}
        {...register("listPrice")}
      />

      <Input
        label="Sale Price (₹)"
        type="number"
        step="0.01"
        placeholder="e.g. 799.00"
        errorMessage={errors?.salePrice?.message}
        {...register("salePrice")}
      />

      <Input
        label="Tax Rate (%)"
        type="number"
        step="0.1"
        placeholder="e.g. 18"
        errorMessage={errors?.taxRate?.message}
        {...register("taxRate")}
      />
    </FormSection>
  );
}

export default PricingFinancialSection;
