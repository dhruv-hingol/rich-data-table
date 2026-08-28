import React, { useEffect, useState, useRef, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { recordSchema, type RecordSchemaInput } from "../lib/recordSchema";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Select } from "../../../components/ui/select";
import { PageHeader } from "../../../components/ui/page-header";
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

export function RecordForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isEditMode = Boolean(id);

  const [activeTab, setActiveTab] = useState<string>("sec-details");
  const { data: record, isLoading: isLoadingRecord } =
    useInventoryRecordDetailQuery(id);
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

  const isProgrammaticScrollRef = useRef(false);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ScrollSpy: Automatically update activeTab to match section visible below header on manual scroll
  useEffect(() => {
    if (isLoadingRecord) return;

    const sectionIds = TABS.map((t) => t.id);

    const handleScroll = () => {
      if (isProgrammaticScrollRef.current) return;

      const scrollContainer = document.querySelector(".overflow-y-auto");
      const scrollTop = scrollContainer
        ? scrollContainer.scrollTop
        : window.scrollY;
      const targetOffset = scrollTop + 145;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el && el.offsetTop <= targetOffset) {
          setActiveTab(sectionIds[i]);
          break;
        }
      }
    };

    const container = document.querySelector(".overflow-y-auto") || window;
    container.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [isLoadingRecord]);

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
      } else {
        await createMutation.mutateAsync({
          ...data,
          status: liveStatus,
        } as any);
      }
      setSubmitSuccess(true);
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err) {
      console.error("Form submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToSection = useCallback((sectionId: string) => {
    setActiveTab(sectionId);
    isProgrammaticScrollRef.current = true;

    if (scrollTimerRef.current) {
      clearTimeout(scrollTimerRef.current);
    }

    const el = document.getElementById(sectionId);
    const container = document.querySelector(".overflow-y-auto");
    if (el && container) {
      const headerOffset = 130;
      const targetPos = Math.max(0, el.offsetTop - headerOffset);
      container.scrollTo({
        top: targetPos,
        behavior: "smooth",
      });
    }

    scrollTimerRef.current = setTimeout(() => {
      isProgrammaticScrollRef.current = false;
    }, 600);
  }, []);

  const categoryOptions = [
    { label: "Electronics", value: "Electronics" },
    { label: "Industrial Hardware", value: "Industrial Hardware" },
    { label: "Safety Equipment", value: "Safety Equipment" },
    { label: "Packaging Materials", value: "Packaging Materials" },
  ];

  const warehouseOptions = [
    { label: "WH-NORTH-01", value: "WH-NORTH-01" },
    { label: "WH-SOUTH-02", value: "WH-SOUTH-02" },
    { label: "WH-EAST-05", value: "WH-EAST-05" },
    { label: "WH-WEST-09", value: "WH-WEST-09" },
  ];

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

      {/* Success Notification Banner */}
      {submitSuccess && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <span>
            ✓{" "}
            {isEditMode
              ? "Record updated successfully!"
              : "Record created successfully!"}{" "}
            Redirecting...
          </span>
        </div>
      )}

      {/* ALL SECTIONS VISIBLE ON ONE PAGE */}

      {/* Section 1: Product Details */}
      <div id="sec-details" className="pt-2 scroll-mt-20">
        <div className="flex flex-col md:flex-row gap-6 md:gap-12 pb-8">
          <div className="w-full md:w-52 shrink-0">
            <h3 className="text-base font-bold text-slate-900">Details</h3>
          </div>
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                SKU *
              </label>
              <Input {...register("sku")} error={!!errors.sku} />
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
          </div>
        </div>
      </div>

      <div className="border-t border-dashed border-slate-200 my-6" />

      {/* Section 2: Stock & Location */}
      <div id="sec-inventory" className="pt-2 scroll-mt-20">
        <div className="flex flex-col md:flex-row gap-6 md:gap-12 pb-8">
          <div className="w-full md:w-52 shrink-0">
            <h3 className="text-base font-bold text-slate-900">
              Stock & Location
            </h3>
          </div>
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Select
              label="Warehouse *"
              labelClassName="font-medium text-slate-700 mb-1.5"
              options={warehouseOptions}
              value={watchWarehouse}
              onChange={(val) => setValue("warehouse", val)}
            />

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Qty On Hand *
              </label>
              <Input
                type="number"
                {...register("qtyOnHand")}
                error={!!errors.qtyOnHand}
              />
              {errors.qtyOnHand && (
                <p className="text-[11px] text-rose-500 mt-1">
                  {errors.qtyOnHand.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Qty Reserved
              </label>
              <Input type="number" {...register("qtyReserved")} />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Reorder Point *
              </label>
              <Input
                type="number"
                {...register("reorderPoint")}
                error={!!errors.reorderPoint}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Reorder Qty
              </label>
              <Input type="number" {...register("reorderQty")} />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Bin Location *
              </label>
              <Input {...register("binLocation")} placeholder="e.g. A-12-04" />
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-dashed border-slate-200 my-6" />

      {/* Section 3: Pricing & Financial */}
      <div id="sec-pricing" className="pt-2 scroll-mt-20">
        <div className="flex flex-col md:flex-row gap-6 md:gap-12 pb-8">
          <div className="w-full md:w-52 shrink-0">
            <h3 className="text-base font-bold text-slate-900">
              Pricing & Financial
            </h3>
          </div>
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Unit Cost (₹) *
              </label>
              <Input type="number" step="0.01" {...register("unitCost")} />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                List Price (₹) *
              </label>
              <Input type="number" step="0.01" {...register("listPrice")} />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Sale Price (₹)
              </label>
              <Input type="number" step="0.01" {...register("salePrice")} />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Tax Rate (%)
              </label>
              <Input type="number" step="0.1" {...register("taxRate")} />
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-dashed border-slate-200 my-6" />

      {/* Section 4: Supplier Info */}
      <div id="sec-supplier" className="pt-2 scroll-mt-20">
        <div className="flex flex-col md:flex-row gap-6 md:gap-12 pb-8">
          <div className="w-full md:w-52 shrink-0">
            <h3 className="text-base font-bold text-slate-900">
              Supplier Info
            </h3>
          </div>
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Supplier Name *
              </label>
              <Input {...register("supplierName")} />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Supplier SKU
              </label>
              <Input {...register("supplierSku")} />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Lead Time (Days)
              </label>
              <Input type="number" {...register("leadTimeDays")} />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Min Order Qty
              </label>
              <Input type="number" {...register("minOrderQty")} />
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-dashed border-slate-200 my-6" />

      {/* Section 5: Physical Specs */}
      <div id="sec-physical" className="pt-2 scroll-mt-20">
        <div className="flex flex-col md:flex-row gap-6 md:gap-12 pb-8">
          <div className="w-full md:w-52 shrink-0">
            <h3 className="text-base font-bold text-slate-900">
              Physical Specs
            </h3>
          </div>
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Weight (kg)
              </label>
              <Input type="number" step="0.1" {...register("weightKg")} />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Dimensions (cm)
              </label>
              <Input
                {...register("dimensionsCm")}
                placeholder="e.g. 20x15x10"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Package Type
              </label>
              <Input {...register("packageType")} />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Handling Instructions
              </label>
              <Input {...register("handlingInstructions")} />
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Footer Bar at Bottom matching screenshot */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-8 py-3.5 flex items-center justify-end gap-3 z-40 shadow-lg">
        <Button variant="outline" type="button" onClick={() => navigate("/")}>
          Cancel
        </Button>
        <Button
          variant="primary"
          type="submit"
          disabled={isSubmitting}
          className="bg-[#ff6600] px-6"
        >
          {isSubmitting ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  );
}
