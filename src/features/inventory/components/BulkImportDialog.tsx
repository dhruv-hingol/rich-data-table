import { showToast } from "../../../components/ui/toast";
import { useState } from "react";
import { Dialog } from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { parseCSVStream, type ParseResult } from "../lib/csvParser";
import { inventoryApi } from "../api/inventoryApi";
import { useTableUIStore } from "../store/useTableUIStore";

export function BulkImportDialog() {
  const { isBulkImportOpen, setIsBulkImportOpen, triggerRefresh } =
    useTableUIStore();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [file, setFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importSummary, setImportSummary] = useState<{
    created: number;
    rejected: number;
  } | null>(null);

  const handleFileChange = async (selectedFile: File) => {
    setFile(selectedFile);
    setIsParsing(true);
    try {
      const result = await parseCSVStream(selectedFile);
      setParseResult(result);
      setStep(2);
    } catch (err) {
      console.error("CSV parse error:", err);
    } finally {
      setIsParsing(false);
    }
  };

  const handleCommitImport = async () => {
    if (!parseResult || parseResult.validRows.length === 0) return;
    setStep(3);
    setIsImporting(true);
    try {
      const res = await inventoryApi.bulkCreateRecords(parseResult.validRows);
      setImportSummary({
        created: res.created.length,
        rejected: res.rejected.length + parseResult.invalidRows.length,
      });
      showToast.success(`Successfully imported ${res.created.length} products`);
      triggerRefresh(); // Trigger instant data table refresh
    } catch (err) {
      console.error("Bulk create error:", err);
    } finally {
      setIsImporting(false);
    }
  };

  const resetState = () => {
    setStep(1);
    setFile(null);
    setParseResult(null);
    setImportSummary(null);
    triggerRefresh();
    setIsBulkImportOpen(false);
  };

  return (
    <Dialog
      open={isBulkImportOpen}
      onClose={resetState}
      title="Bulk CSV Inventory Import Wizard"
      size="lg"
    >
      {/* Wizard Step Indicator */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
        <div
          className={`flex items-center gap-2 ${step >= 1 ? "text-[#ff6600] font-bold" : "text-slate-400"}`}
        >
          <span
            className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${step >= 1 ? "bg-[#ff6600] text-white" : "bg-slate-200 text-slate-600"}`}
          >
            1
          </span>
          <span className="text-xs">Upload File</span>
        </div>
        <span className="text-slate-300">→</span>
        <div
          className={`flex items-center gap-2 ${step >= 2 ? "text-[#ff6600] font-bold" : "text-slate-400"}`}
        >
          <span
            className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${step >= 2 ? "bg-[#ff6600] text-white" : "bg-slate-200 text-slate-600"}`}
          >
            2
          </span>
          <span className="text-xs">Validation Preview</span>
        </div>
        <span className="text-slate-300">→</span>
        <div
          className={`flex items-center gap-2 ${step >= 3 ? "text-[#ff6600] font-bold" : "text-slate-400"}`}
        >
          <span
            className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${step >= 3 ? "bg-[#ff6600] text-white" : "bg-slate-200 text-slate-600"}`}
          >
            3
          </span>
          <span className="text-xs">Batch Commit</span>
        </div>
      </div>

      {/* STEP 1: Upload */}
      {step === 1 && (
        <div className="space-y-6 text-center py-6">
          <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 hover:border-[#ff6600] transition-colors cursor-pointer bg-slate-50">
            <input
              type="file"
              accept=".csv"
              id="csv-file-input"
              className="hidden"
              onChange={(e) =>
                e.target.files?.[0] && handleFileChange(e.target.files[0])
              }
            />
            <label
              htmlFor="csv-file-input"
              className="cursor-pointer block space-y-2"
            >
              <span className="text-3xl block">📄</span>
              <p className="text-sm font-semibold text-slate-800">
                Click or Drag & Drop CSV file to upload
              </p>
              <p className="text-xs text-slate-500">
                Supports files up to 50MB with SKU, Name, Barcode, Warehouse
                columns
              </p>
            </label>
          </div>
          {isParsing && (
            <p className="text-xs font-semibold text-[#ff6600] animate-pulse">
              Parsing CSV stream and validating schema rules...
            </p>
          )}
        </div>
      )}

      {/* STEP 2: Validation Preview */}
      {step === 2 && parseResult && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div className="flex gap-3">
              <span className="text-xs font-semibold text-emerald-600">
                ✓ {parseResult.validRows.length} Valid Rows
              </span>
              <span className="text-xs font-semibold text-rose-500">
                ✕ {parseResult.invalidRows.length} Invalid Rows
              </span>
            </div>
            <span className="text-xs text-slate-500">
              Total Parsed: {parseResult.totalParsed}
            </span>
          </div>

          <div className="border border-slate-200 rounded-lg overflow-hidden max-h-60 overflow-y-auto">
            <table className="w-full text-xs text-left text-slate-700">
              <thead className="bg-slate-100 text-slate-600 uppercase font-semibold text-[10px]">
                <tr>
                  <th className="p-2">Row</th>
                  <th className="p-2">SKU</th>
                  <th className="p-2">Name</th>
                  <th className="p-2">Status / Error</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {parseResult.validRows.slice(0, 5).map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="p-2">{idx + 1}</td>
                    <td className="p-2 font-mono text-[#ff6600]">{row.sku}</td>
                    <td className="p-2">{row.name}</td>
                    <td className="p-2">
                      <span className="text-emerald-600 font-semibold">
                        Valid
                      </span>
                    </td>
                  </tr>
                ))}
                {parseResult.invalidRows.map((item, idx) => (
                  <tr key={`inv-${idx}`} className="bg-rose-50/50">
                    <td className="p-2 text-rose-600 font-semibold">
                      {item.rowNumber}
                    </td>
                    <td className="p-2 font-mono text-rose-600">
                      {String(item.raw?.sku || "-")}
                    </td>
                    <td className="p-2 text-rose-600">
                      {String(item.raw?.name || "-")}
                    </td>
                    <td className="p-2 text-rose-600 font-semibold">
                      {item.errors[0] || "Invalid record format"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="outline" onClick={resetState}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCommitImport}
              disabled={parseResult.validRows.length === 0}
              className="bg-[#ff6600]"
            >
              Commit Import ({parseResult.validRows.length} Records)
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: Batch Commit Summary */}
      {step === 3 && (
        <div className="space-y-6 text-center py-6">
          {isImporting ? (
            <div className="space-y-3">
              <div className="w-8 h-8 border-4 border-[#ff6600] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm font-semibold text-slate-800">
                Committing batch records to IndexedDB store...
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <span className="text-4xl block">🎉</span>
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
                onClick={resetState}
                className="bg-[#ff6600] mx-auto"
              >
                Done & Return to Dashboard
              </Button>
            </div>
          )}
        </div>
      )}
    </Dialog>
  );
}
