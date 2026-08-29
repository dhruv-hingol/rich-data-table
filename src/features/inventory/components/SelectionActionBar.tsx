import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/utils/cn";

interface SelectionActionBarProps {
  selectedRows: Set<string>;
  onDelete: () => void;
  onExport?: () => void;
  onCancel: () => void;
}

export function SelectionActionBar({
  selectedRows,
  onDelete,
  onExport,
  onCancel,
}: SelectionActionBarProps) {
  const isVisible = selectedRows.size > 0;

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ease-in-out",
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4 pointer-events-none",
      )}
    >
      <div className="bg-white border border-slate-200 rounded-xl shadow-xl p-3 flex items-center justify-between gap-4">
        <div className="text-xs font-bold text-white bg-[#ff6600] px-3 py-1.5 rounded-lg whitespace-nowrap shadow-xs">
          {selectedRows.size} {selectedRows.size === 1 ? "item" : "items"}{" "}
          selected
        </div>

        <Button variant="primary" size="sm" onClick={onDelete}>
          Delete
        </Button>

        {onExport && (
          <Button variant="outline" size="sm" onClick={onExport}>
            Export CSV
          </Button>
        )}

        <Button variant="text" size="sm" onClick={onCancel} className="text-xs">
          Clear
        </Button>
      </div>
    </div>
  );
}
