import type { StockStatus } from "@/src/features/inventory/types/inventory.types";

export interface StatusCardConfig {
  label: string;
  key: StockStatus | "ALL";
  colorClass: string;
  bgClass: string;
  borderClass: string;
}

export const STATUS_CARD_CONFIGS: StatusCardConfig[] = [
  {
    label: "Total Inventory",
    key: "ALL",
    colorClass: "text-slate-200",
    bgClass: "bg-slate-800/80",
    borderClass: "border-slate-700",
  },
  {
    label: "Low Stock Alert",
    key: "LOW_STOCK",
    colorClass: "text-rose-400",
    bgClass: "bg-rose-500/10",
    borderClass: "border-rose-500/30",
  },
  {
    label: "Healthy Stock",
    key: "HEALTHY",
    colorClass: "text-emerald-400",
    bgClass: "bg-emerald-500/10",
    borderClass: "border-emerald-500/30",
  },
  {
    label: "Overstock",
    key: "OVERSTOCK",
    colorClass: "text-blue-400",
    bgClass: "bg-blue-500/10",
    borderClass: "border-blue-500/30",
  },
  {
    label: "Discontinued",
    key: "DISCONTINUED",
    colorClass: "text-slate-400",
    bgClass: "bg-slate-800/40",
    borderClass: "border-slate-700/50",
  },
];

export type StatusCounts = Record<StockStatus | "ALL", number>;

export function getStatusSummaryCards(counts: Partial<StatusCounts> = {}) {
  return STATUS_CARD_CONFIGS.map((config) => ({
    ...config,
    count: counts[config.key] ?? 0,
  }));
}
