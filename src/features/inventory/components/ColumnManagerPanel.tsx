import { Sheet } from "@/src/components/ui/sheet";
import { Button } from "@/src/components/ui/button";
import { Checkbox } from "@/src/components/ui/checkbox";
import {
  useTableUIStore,
  type ColumnPreset,
} from "@/src/features/inventory/store/useTableUIStore";
import { ALL_COLUMNS_METADATA } from "@/src/features/inventory/lib/columnDefsFactory";

export function ColumnManagerPanel() {
  const {
    isColumnManagerOpen,
    setIsColumnManagerOpen,
    columnPreset,
    setColumnPreset,
    visibleColumns,
    toggleColumnVisibility,
  } = useTableUIStore();

  const presets: { id: ColumnPreset; label: string }[] = [
    { id: "ALL", label: "All Columns" },
    { id: "ESSENTIALS", label: "Essentials Only" },
    { id: "INVENTORY", label: "Inventory & Bins" },
    { id: "PRICING", label: "Pricing & Margins" },
    { id: "SUPPLIER", label: "Supplier Operations" },
  ];

  const visibleCount = visibleColumns.length;

  return (
    <Sheet
      open={isColumnManagerOpen}
      onClose={() => setIsColumnManagerOpen(false)}
      title="Configure Columns & Presets"
    >
      <div className="space-y-6 flex flex-col h-full">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Column Presets
          </label>
          <div className="flex flex-wrap gap-2">
            {presets.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setColumnPreset(p.id)}
                className={`text-xs px-3 py-1.5 rounded-lg border font-semibold transition-colors cursor-pointer ${
                  columnPreset === p.id
                    ? "bg-[#ff6600] border-[#ff6600] text-white shadow-xs"
                    : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 min-h-0 flex flex-col">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-3 shrink-0">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Visible Columns ({visibleCount} / {ALL_COLUMNS_METADATA.length})
            </span>
          </div>

          <div className="space-y-2 overflow-y-auto pr-1 flex-1">
            {ALL_COLUMNS_METADATA.map((col) => {
              const isChecked = visibleColumns.includes(col.field);
              return (
                <label
                  key={col.field}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer border border-transparent hover:border-slate-200 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={isChecked}
                      onChange={() => toggleColumnVisibility(col.field)}
                    />
                    <span className="text-sm font-medium text-slate-800">
                      {col.label}
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {col.group}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end shrink-0">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsColumnManagerOpen(false)}
            className="bg-[#ff6600]"
          >
            Apply & Save Preferences
          </Button>
        </div>
      </div>
    </Sheet>
  );
}
