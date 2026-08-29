import { useTableUIStore } from '@/src/features/inventory/store/useTableUIStore';
import {
  getStatusSummaryCards,
  type StatusCounts,
} from '@/src/features/inventory/constants/statusCardConfigs';

interface StatusSummaryStripProps {
  statusCounts?: Partial<StatusCounts>;
}

export function StatusSummaryStrip({ statusCounts }: StatusSummaryStripProps) {
  const { statusFilter, setStatusFilter } = useTableUIStore();
  const cards = getStatusSummaryCards(statusCounts);

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
