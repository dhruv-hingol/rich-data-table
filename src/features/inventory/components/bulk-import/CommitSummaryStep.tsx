import { Button } from "@/src/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export interface CommitSummaryStepProps {
  isImporting: boolean;
  importSummary: { created: number; rejected: number } | null;
  onDone: () => void;
}

export function CommitSummaryStep({
  isImporting,
  importSummary,
  onDone,
}: CommitSummaryStepProps) {
  return (
    <div className="space-y-6 text-center py-6">
      {isImporting ? (
        <div className="space-y-3">
          <div className="w-8 h-8 border-4 border-[#ff6600] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-800">
            Committing batch records to IndexedDB store...
          </p>
        </div>
      ) : (
        <div className="space-y-4 flex flex-col items-center">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mb-1" />
          <h3 className="text-lg font-bold text-slate-900">
            Bulk Import Complete!
          </h3>
          {importSummary && (
            <p className="text-xs text-slate-600">
              Successfully created{" "}
              <strong className="text-emerald-600">
                {importSummary.created}
              </strong>{" "}
              records.{" "}
              {importSummary.rejected > 0 && (
                <span className="text-rose-500">
                  {importSummary.rejected} rows rejected.
                </span>
              )}
            </p>
          )}
          <Button
            variant="primary"
            onClick={onDone}
            className="bg-[#ff6600] mx-auto"
          >
            Done & Return to Dashboard
          </Button>
        </div>
      )}
    </div>
  );
}

export default CommitSummaryStep;
