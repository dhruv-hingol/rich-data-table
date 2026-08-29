import { Button } from "../../../../components/ui/button";
import type { ParseResult } from "../../lib/csvParser";
import { ImportPreviewTable } from "../ImportPreviewTable";
import { CheckCircle2, XCircle } from "lucide-react";

export interface ValidationPreviewStepProps {
  parseResult: ParseResult;
  onCancel: () => void;
  onCommit: () => void;
}

export function ValidationPreviewStep({
  parseResult,
  onCancel,
  onCommit,
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
        <span className="text-xs text-slate-500">
          Total Parsed: {parseResult.totalParsed}
        </span>
      </div>

      <ImportPreviewTable parseResult={parseResult} />

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
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
  );
}

export default ValidationPreviewStep;
