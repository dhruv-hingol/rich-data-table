import React from "react";
import type { UseFormRegister } from "react-hook-form";
import { FormSection } from "../../../../components/ui/form-section";
import { Input } from "../../../../components/ui/input";
import type { RecordSchemaInput } from "../../lib/recordSchema";

export interface PhysicalSpecsSectionProps {
  register: UseFormRegister<RecordSchemaInput>;
}

export function PhysicalSpecsSection({ register }: PhysicalSpecsSectionProps) {
  return (
    <FormSection id="sec-physical" title="Physical Specs" showDivider={false}>
      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1.5">
          Weight (kg)
        </label>
        <Input
          type="number"
          step="0.1"
          {...register("weightKg")}
          placeholder="e.g. 1.25"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1.5">
          Dimensions (cm)
        </label>
        <Input
          {...register("dimensionsCm")}
          placeholder="e.g. 20 x 15 x 10"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1.5">
          Package Type
        </label>
        <Input
          {...register("packageType")}
          placeholder="e.g. Corrugated Box"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1.5">
          Handling Instructions
        </label>
        <Input
          {...register("handlingInstructions")}
          placeholder="e.g. Handle with care, fragile glass lens"
        />
      </div>
    </FormSection>
  );
}

export default PhysicalSpecsSection;
