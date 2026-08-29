export function EmptyState({
  type = "filtered",
}: {
  type?: "filtered" | "nodata";
}) {
  if (type === "nodata") {
    return (
      <div className="p-12 text-center text-slate-400">
        <h3 className="text-base font-semibold text-slate-200 mb-1">
          No Inventory Records Found
        </h3>
        <p className="text-sm">
          No inventory records exist in the warehouse database. Add a record or
          run a CSV import.
        </p>
      </div>
    );
  }

  return (
    <div className="p-12 text-center text-slate-400">
      <h3 className="text-base font-semibold text-slate-200 mb-1">
        No Matching Inventory Records
      </h3>
      <p className="text-sm">
        No inventory records match your active filters. Try adjusting SKU search
        or status filters.
      </p>
    </div>
  );
}
