import type { UseFormRegister, FieldErrors } from "react-hook-form";
import { FormSection } from "../../../../components/ui/form-section";
import { Input } from "../../../../components/ui/input";
import type { RecordSchemaInput } from "../../lib/recordSchema";

export interface PhysicalSpecsSectionProps {
  register: UseFormRegister<RecordSchemaInput>;
  errors?: FieldErrors<RecordSchemaInput>;
}

export function PhysicalSpecsSection({
  register,
  errors,
}: PhysicalSpecsSectionProps) {
  return (
    <FormSection id="sec-physical" title="Physical Specs" showDivider={false}>
      <Input
        label="Weight (kg)"
        type="number"
        step="0.1"
        placeholder="e.g. 1.25"
        errorMessage={errors?.weightKg?.message}
        {...register("weightKg")}
      />

      <Input
        label="Dimensions (cm)"
        placeholder="e.g. 20 x 15 x 10"
        errorMessage={errors?.dimensionsCm?.message}
        {...register("dimensionsCm")}
      />

      <Input
        label="Package Type"
        placeholder="e.g. Corrugated Box"
        errorMessage={errors?.packageType?.message}
        {...register("packageType")}
      />

      <Input
        label="Handling Instructions"
        placeholder="e.g. Handle with care, fragile glass lens"
        errorMessage={errors?.handlingInstructions?.message}
        {...register("handlingInstructions")}
      />
    </FormSection>
  );
}

export default PhysicalSpecsSection;
