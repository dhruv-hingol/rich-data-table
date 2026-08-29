import React from "react";
import type { UseFormRegister } from "react-hook-form";
import { FormSection } from "../../../../components/ui/form-section";
import { Input } from "../../../../components/ui/input";
import type { RecordSchemaInput } from "../../lib/recordSchema";

export interface SupplierInfoSectionProps {
  register: UseFormRegister<RecordSchemaInput>;
}

export function SupplierInfoSection({ register }: SupplierInfoSectionProps) {
  return (
    <FormSection id="sec-supplier" title="Supplier Info">
      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1.5">
          Supplier Name *
        </label>
        <Input
          {...register("supplierName")}
          placeholder="e.g. Acme Tech Solutions Pvt Ltd"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1.5">
          Supplier SKU
        </label>
        <Input
          {...register("supplierSku")}
          placeholder="e.g. SUP-ZB-990"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1.5">
          Lead Time (Days)
        </label>
        <Input
          type="number"
          {...register("leadTimeDays")}
          placeholder="e.g. 7"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1.5">
          Min Order Qty
        </label>
        <Input
          type="number"
          {...register("minOrderQty")}
          placeholder="e.g. 10"
        />
      </div>
    </FormSection>
  );
}

export default SupplierInfoSection;
