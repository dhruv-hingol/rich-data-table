// Floating action toolbar appearing on row selection with primary badge, solid delete button, and common Button variant=text clear button.
import { useState, useEffect } from "react";
import { Button } from "../../../components/ui/button";
import { cn } from "../../../utils/cn";

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
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (selectedRows.size > 0 && !isVisible) {
      setIsVisible(true);
    } else if (selectedRows.size === 0 && isVisible) {
      setIsVisible(false);
    }
  }, [selectedRows, isVisible]);

  if (!isVisible && selectedRows.size === 0) return null;

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
        {/* Primary Color Selected Items Badge */}
        <div className="text-xs font-bold text-white bg-[#ff6600] px-3 py-1.5 rounded-lg whitespace-nowrap shadow-xs">
          {selectedRows.size} {selectedRows.size === 1 ? "item" : "items"}{" "}
          selected
        </div>

        {/* Solid Variant Delete Button */}
        <Button variant="primary" size="sm" onClick={onDelete}>
          Delete
        </Button>

        {onExport && (
          <Button variant="outline" size="sm" onClick={onExport}>
            Export CSV
          </Button>
        )}

        {/* Common Button variant="text" Clear Button */}
        <Button variant="text" size="sm" onClick={onCancel} className="text-xs">
          Clear
        </Button>
      </div>
    </div>
  );
}
