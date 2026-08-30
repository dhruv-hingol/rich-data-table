import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useTableUIStore } from "../store/useTableUIStore";
import type { StockStatus } from "../types/inventory.types";

const VALID_STATUSES: (StockStatus | "ALL")[] = [
  "ALL",
  "LOW_STOCK",
  "HEALTHY",
  "OVERSTOCK",
  "DISCONTINUED",
];

export function useTableUrlSync() {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    searchQuery,
    statusFilter,
    categoryFilter,
    skuFilter,
    warehouseFilter,
    setSearchQuery,
    setStatusFilter,
    setCategoryFilter,
    setSkuFilter,
    setWarehouseFilter,
  } = useTableUIStore();

  const isUpdatingFromUrl = useRef(false);

  // 1. Sync from URL query parameters to store on load or when URL params change (e.g. back/forward navigation)
  useEffect(() => {
    const urlSearch = searchParams.get("search") || searchParams.get("q") || "";
    const urlStatusRaw = searchParams.get("status");
    const urlStatus = VALID_STATUSES.includes(
      urlStatusRaw as StockStatus | "ALL",
    )
      ? (urlStatusRaw as StockStatus | "ALL")
      : "ALL";
    const urlCategory = searchParams.get("category") || "ALL";
    const urlSku = searchParams.get("sku") || "";
    const urlWarehouse = searchParams.get("warehouse") || "ALL";

    isUpdatingFromUrl.current = true;

    if (urlSearch !== searchQuery) {
      setSearchQuery(urlSearch);
    }
    if (urlStatus !== statusFilter) {
      setStatusFilter(urlStatus);
    }
    if (urlCategory !== categoryFilter) {
      setCategoryFilter(urlCategory);
    }
    if (urlSku !== skuFilter) {
      setSkuFilter(urlSku);
    }
    if (urlWarehouse !== warehouseFilter) {
      setWarehouseFilter(urlWarehouse);
    }

    Promise.resolve().then(() => {
      isUpdatingFromUrl.current = false;
    });
  }, [searchParams]);

  // 2. Sync from store to URL query parameters whenever filter state changes
  useEffect(() => {
    if (isUpdatingFromUrl.current) return;

    const newParams = new URLSearchParams();

    if (searchQuery && searchQuery.trim() !== "") {
      newParams.set("search", searchQuery.trim());
    }
    if (statusFilter && statusFilter !== "ALL") {
      newParams.set("status", statusFilter);
    }
    if (categoryFilter && categoryFilter !== "ALL") {
      newParams.set("category", categoryFilter);
    }
    if (skuFilter && skuFilter.trim() !== "") {
      newParams.set("sku", skuFilter.trim());
    }
    if (warehouseFilter && warehouseFilter !== "ALL") {
      newParams.set("warehouse", warehouseFilter);
    }

    const currentString = searchParams.toString();
    const newString = newParams.toString();

    if (currentString !== newString) {
      setSearchParams(newParams, { replace: true });
    }
  }, [
    searchQuery,
    statusFilter,
    categoryFilter,
    skuFilter,
    warehouseFilter,
    searchParams,
    setSearchParams,
  ]);
}
