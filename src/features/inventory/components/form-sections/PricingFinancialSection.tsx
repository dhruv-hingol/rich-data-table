import React from "react";
import type { UseFormRegister } from "react-hook-form";
import { FormSection } from "../../../../components/ui/form-section";
import { Input } from "../../../../components/ui/input";
import type { RecordSchemaInput } from "../../lib/recordSchema";

export interface PricingFinancialSectionProps {
  register: UseFormRegister<RecordSchemaInput>;
}

export function PricingFinancialSection({ register }: PricingFinancialSectionProps) {
  return (
    <FormSection id="sec-pricing" title="Pricing & Financial">
      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1.5">
          Unit Cost (₹) *
        </label>
        <Input
          type="number"
          step="0.01"
          {...register("unitCost")}
          placeholder="e.g. 450.00"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1.5">
          List Price (₹) *
        </label>
        <Input
          type="number"
          step="0.01"
          {...register("listPrice")}
          placeholder="e.g. 899.00"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1.5">
          Sale Price (₹)
        </label>
        <Input
          type="number"
          step="0.01"
          {...register("salePrice")}
          placeholder="e.g. 799.00"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1.5">
          Tax Rate (%)
        </label>
        <Input
          type="number"
          step="0.1"
          {...register("taxRate")}
          placeholder="e.g. 18"
        />
      </div>
    </FormSection>
  );
}

export default PricingFinancialSection;
