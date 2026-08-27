// Floating action toolbar appearing on row selection to perform bulk deletion or export actions.
import React, { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/button';
import { cn } from '../../../utils/cn';

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
        'fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ease-in-out',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      )}
    >
      <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-3 pr-4 flex items-center gap-4 min-w-[400px]">
        <div className="flex-1 flex items-center gap-4">
          <div className="text-sm font-semibold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            {selectedRows.size} selected
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="hover:bg-rose-500/10 hover:text-rose-400 text-slate-300 text-sm px-3"
          >
            Delete Selected
          </Button>

          {onExport && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onExport}
              className="hover:bg-slate-800 text-slate-300 text-sm px-3"
            >
              Export CSV
            </Button>
          )}
        </div>

        <button
          onClick={onCancel}
          className="text-xs text-slate-400 hover:text-slate-200 px-2 py-1 rounded hover:bg-slate-800 transition-colors"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
