import { Button } from "@/src/components/ui/button";
import type { ParseResult } from "@/src/features/inventory/lib/csvParser";
import { CheckCircle2, XCircle, ArrowLeft, UploadCloud } from "lucide-react";
import { ImportPreviewTable } from "../ImportPreviewTable";

export interface ValidationPreviewStepProps {
  parseResult: ParseResult;
  onCancel: () => void;
  onCommit: () => void;
  onBack?: () => void;
}

export function ValidationPreviewStep({
  parseResult,
  onCancel,
  onCommit,
  onBack,
}: ValidationPreviewStepProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200">
        <div className="flex items-center gap-4">
          <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {parseResult.validRows.length} Valid Rows
          </span>
          <span className="text-xs font-semibold text-rose-500 flex items-center gap-1.5">
            <XCircle className="w-3.5 h-3.5" />
            {parseResult.invalidRows.length} Invalid Rows
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500">
            Total Parsed: {parseResult.totalParsed}
          </span>
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="text-xs font-medium text-[#ff6600] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              Upload Different File
            </button>
          )}
        </div>
      </div>

      <ImportPreviewTable parseResult={parseResult} />

      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <div>
          {onBack && (
            <Button
              variant="outline"
              onClick={onBack}
              className="flex items-center gap-1.5 text-slate-700"
              prefixIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Back to Upload
            </Button>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={onCommit}
            disabled={parseResult.validRows.length === 0}
            className="bg-[#ff6600]"
          >
            Commit Import ({parseResult.validRows.length} Records)
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ValidationPreviewStep;
