import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { recordSchema, type RecordSchemaInput } from "../lib/recordSchema";
import { showToast } from "../../../components/ui/toast";
import { PageHeader } from "../../../components/ui/page-header";
import { FormFooter } from "../../../components/ui/form-footer";
import type { StockStatus } from "../types/inventory.types";
import {
  useInventoryRecordDetailQuery,
  useCreateRecordMutation,
  useUpdateRecordMutation,
} from "../hooks/useInventoryQuery";
import {
  DEFAULT_RECORD_FORM_VALUES,
  RECORD_FORM_TABS as TABS,
} from "../constants/formDefaultValues";
import {
  FORM_CATEGORY_OPTIONS as categoryOptions,
  FORM_WAREHOUSE_OPTIONS as warehouseOptions,
} from "../constants/filterOptions";
import { useTabScrollSpy } from "../hooks/useTabScrollSpy";
import {
  ProductDetailsSection,
  StockLocationSection,
  PricingFinancialSection,
  SupplierInfoSection,
  PhysicalSpecsSection,
} from "./form-sections";

export function RecordForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isEditMode = Boolean(id);

  const { data: record, isLoading: isLoadingRecord } =
    useInventoryRecordDetailQuery(id);

  // Custom hook for sticky header tab scrollspy tracking & smooth section scroll
  const { activeTab, scrollToSection } = useTabScrollSpy({
    tabs: TABS,
    defaultTabId: "sec-details",
    headerOffset: 130,
    scrollOffset: 145,
    isDisabled: isLoadingRecord,
  });

  const createMutation = useCreateRecordMutation();
  const updateMutation = useUpdateRecordMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<RecordSchemaInput>({
    resolver: zodResolver(recordSchema) as any,
    defaultValues: DEFAULT_RECORD_FORM_VALUES,
  });

  useEffect(() => {
    if (record) {
      reset({
        sku: record.sku,
        name: record.name,
        barcode: record.barcode,
        category: record.category,
        subcategory: record.subcategory,
        brand: record.brand,
        tags: record.tags || ["imported"],
        variant: record.variant || "Standard",
        unit: record.unit || "pcs",
        warehouse: record.warehouse,
        qtyOnHand: record.qtyOnHand,
        qtyReserved: record.qtyReserved,
        reorderPoint: record.reorderPoint,
        reorderQty: record.reorderQty,
        binLocation: record.binLocation,
        unitCost: record.unitCost,
        listPrice: record.listPrice,
        salePrice: record.salePrice || record.listPrice,
        taxRate: record.taxRate || 0,
        discountPercent: record.discountPercent || 0,
        priceTier: (record.priceTier as any) || "Standard",
        supplierId: record.supplierId,
        supplierName: record.supplierName,
        supplierSku: record.supplierSku,
        leadTimeDays: record.leadTimeDays,
        minOrderQty: record.minOrderQty,
        lastPurchaseDate:
          record.lastPurchaseDate || new Date().toISOString().split("T")[0],
        status: record.status,
        isPerishable: record.isPerishable,
        weightKg: record.weightKg,
        dimensionsCm: record.dimensionsCm,
        isFragile: record.isFragile,
        hazardClass: record.hazardClass,
        bayNumber: record.bayNumber,
        shelfNumber: record.shelfNumber,
        countryOfOrigin: record.countryOfOrigin,
        hsCode: record.hsCode,
        warrantyMonths: record.warrantyMonths,
        packageType: record.packageType,
        handlingInstructions: record.handlingInstructions,
        isReturnable: record.isReturnable,
        minStorageTempC: record.minStorageTempC,
        maxStorageTempC: record.maxStorageTempC,
      });
    }
  }, [record, reset]);

  const watchName = watch("name");
  const watchSku = watch("sku");
  const watchQtyOnHand = watch("qtyOnHand") || 0;
  const watchReorderPoint = watch("reorderPoint") || 0;
  const watchCategory = watch("category");
  const watchWarehouse = watch("warehouse");

  const liveStatus: StockStatus = React.useMemo(() => {
    if (watchQtyOnHand === 0 || watchQtyOnHand <= watchReorderPoint) {
      return "LOW_STOCK";
    }
    if (watchQtyOnHand > 1000) {
      return "OVERSTOCK";
    }
    return "HEALTHY";
  }, [watchQtyOnHand, watchReorderPoint]);

  const onSubmit = async (data: RecordSchemaInput) => {
    setIsSubmitting(true);
    try {
      if (isEditMode && id) {
        await updateMutation.mutateAsync({
          id,
          patch: { ...data, status: liveStatus } as any,
        });
        showToast.success("Product updated successfully");
      } else {
        await createMutation.mutateAsync({
          ...data,
          status: liveStatus,
        } as any);
        showToast.success("Product created successfully");
      }
      setTimeout(() => {
        navigate("/");
      }, 800);
    } catch (err) {
      showToast.error("Failed to save product");
      console.error("Form submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingRecord) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="w-8 h-8 border-2 border-[#ff6600] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-semibold text-slate-600">
          Loading item details...
        </span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="pb-4">
      <PageHeader
        sticky
        backText="Back to Product Inventories"
        backHref="/"
        title={
          isEditMode
            ? `Product Detail - ${watchName || watchSku || id}`
            : "Create Product Inventory"
        }
      >
        <div className="flex items-center gap-8 text-sm font-medium overflow-x-auto pt-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => scrollToSection(tab.id)}
              className={`pb-2 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? "text-slate-900 border-b-2 border-[#ff6600] font-bold"
                  : "text-slate-500 hover:text-slate-800 font-medium"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </PageHeader>

      <ProductDetailsSection
        register={register}
        errors={errors}
        watchCategory={watchCategory}
        categoryOptions={categoryOptions}
        setValue={setValue}
      />

      <StockLocationSection
        register={register}
        errors={errors}
        watchWarehouse={watchWarehouse}
        warehouseOptions={warehouseOptions}
        setValue={setValue}
      />

      <PricingFinancialSection register={register} />

      <SupplierInfoSection register={register} />

      <PhysicalSpecsSection register={register} />

      <FormFooter
        onCancel={() => navigate("/")}
        isSubmitting={isSubmitting}
        submitText="Save"
        submittingText="Saving..."
      />
    </form>
  );
}
