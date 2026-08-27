// Summary strip component showing real-time Low Stock, Healthy, Overstock, and Discontinued counts.
import React from 'react';
import { useTableUIStore } from '../store/useTableUIStore';
import type { StockStatus } from '../types/inventory.types';

interface StatusSummaryStripProps {
  statusCounts?: {
    LOW_STOCK: number;
    HEALTHY: number;
    OVERSTOCK: number;
    DISCONTINUED: number;
    ALL: number;
  };
}

export function StatusSummaryStrip({ statusCounts }: StatusSummaryStripProps) {
  const { statusFilter, setStatusFilter } = useTableUIStore();

  const counts = statusCounts || {
    LOW_STOCK: 0,
    HEALTHY: 0,
    OVERSTOCK: 0,
    DISCONTINUED: 0,
    ALL: 0,
  };

  const cards: { label: string; key: StockStatus | 'ALL'; count: number; colorClass: string; bgClass: string; borderClass: string }[] = [
    {
      label: 'Total Inventory',
      key: 'ALL',
      count: counts.ALL,
      colorClass: 'text-slate-200',
      bgClass: 'bg-slate-800/80',
      borderClass: 'border-slate-700',
    },
    {
      label: 'Low Stock Alert',
      key: 'LOW_STOCK',
      count: counts.LOW_STOCK,
      colorClass: 'text-rose-400',
      bgClass: 'bg-rose-500/10',
      borderClass: 'border-rose-500/30',
    },
    {
      label: 'Healthy Stock',
      key: 'HEALTHY',
      count: counts.HEALTHY,
      colorClass: 'text-emerald-400',
      bgClass: 'bg-emerald-500/10',
      borderClass: 'border-emerald-500/30',
    },
    {
      label: 'Overstock',
      key: 'OVERSTOCK',
      count: counts.OVERSTOCK,
      colorClass: 'text-blue-400',
      bgClass: 'bg-blue-500/10',
      borderClass: 'border-blue-500/30',
    },
    {
      label: 'Discontinued',
      key: 'DISCONTINUED',
      count: counts.DISCONTINUED,
      colorClass: 'text-slate-400',
      bgClass: 'bg-slate-800/40',
      borderClass: 'border-slate-700/50',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-4">
      {cards.map((c) => {
        const isActive = statusFilter === c.key;
        return (
          <button
            key={c.key}
            onClick={() => setStatusFilter(c.key)}
            className={`flex flex-col p-3 rounded-lg border text-left transition-all cursor-pointer hover:scale-[1.01] ${
              c.bgClass
            } ${c.borderClass} ${isActive ? 'ring-2 ring-amber-500 shadow-md' : ''}`}
          >
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">{c.label}</span>
            <div className="flex items-baseline justify-between">
              <span className={`text-xl font-bold font-mono tracking-tight ${c.colorClass}`}>
                {c.count.toLocaleString()}
              </span>
              {isActive && <span className="text-[10px] bg-amber-500 text-slate-950 font-bold px-1.5 py-0.5 rounded uppercase">Active</span>}
            </div>
          </button>
        );
      })}
    </div>
  );
}
