import { X } from "lucide-react";

export interface AppliedFilterItem {
  key: string;
  label: string;
  value: string;
  onRemove: () => void;
}

export interface AppliedFiltersBarProps {
  filters?: AppliedFilterItem[];
  onClearAll?: () => void;
  className?: string;
}

export function AppliedFiltersBar({
  filters = [],
  onClearAll,
  className = "",
}: AppliedFiltersBarProps) {
  if (!filters || filters.length === 0) return null;

  return (
    <div className={`flex items-center flex-wrap gap-3 py-1.5 ${className}`}>
      {filters.map((item) => (
        <div
          key={item.key}
          className="inline-flex items-center gap-1.5 text-xs"
        >
          <span className="text-slate-600 font-medium">{item.label}:</span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-medium">
            <span>{item.value}</span>
            <button
              type="button"
              onClick={item.onRemove}
              className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer p-0.5 rounded-full"
              aria-label={`Remove ${item.label} filter`}
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        </div>
      ))}

      {onClearAll && (
        <button
          type="button"
          onClick={onClearAll}
          className="text-xs font-medium text-[#ff6600] hover:underline cursor-pointer ml-1"
        >
          Clear All
        </button>
      )}
    </div>
  );
}

export default AppliedFiltersBar;
