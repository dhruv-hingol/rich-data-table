// 3-step CSV import wizard modal handling file selection, row validation preview, and batch commit.
import React, { useState } from 'react';
import { Dialog } from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { parseCSVStream, type ParseResult } from '../lib/csvParser';
import { inventoryApi } from '../api/inventoryApi';
import { useTableUIStore } from '../store/useTableUIStore';

export function BulkImportDialog() {
  const { isBulkImportOpen, setIsBulkImportOpen } = useTableUIStore();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [file, setFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importSummary, setImportSummary] = useState<{ created: number; rejected: number } | null>(null);

  const handleFileChange = async (selectedFile: File) => {
    setFile(selectedFile);
    setIsParsing(true);
    try {
      const result = await parseCSVStream(selectedFile);
      setParseResult(result);
      setStep(2);
    } catch (err) {
      console.error('CSV parse error:', err);
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
    } catch (err) {
      console.error('Bulk create error:', err);
    } finally {
      setIsImporting(false);
    }
  };

  const resetState = () => {
    setStep(1);
    setFile(null);
    setParseResult(null);
    setImportSummary(null);
    setIsBulkImportOpen(false);
  };

  return (
    <Dialog open={isBulkImportOpen} onClose={resetState} title="Bulk CSV Inventory Import Wizard">
      {/* Wizard Step Indicator */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
        <div className={`flex items-center gap-2 ${step >= 1 ? 'text-amber-500 font-bold' : 'text-slate-500'}`}>
          <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-xs">1</span>
          <span className="text-xs">Upload File</span>
        </div>
        <span className="text-slate-700">→</span>
        <div className={`flex items-center gap-2 ${step >= 2 ? 'text-amber-500 font-bold' : 'text-slate-500'}`}>
          <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-xs">2</span>
          <span className="text-xs">Validation Preview</span>
        </div>
        <span className="text-slate-700">→</span>
        <div className={`flex items-center gap-2 ${step >= 3 ? 'text-amber-500 font-bold' : 'text-slate-500'}`}>
          <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-xs">3</span>
          <span className="text-xs">Batch Commit</span>
        </div>
      </div>

      {/* Step 1: File Upload */}
      {step === 1 && (
        <div className="space-y-4">
          <div className="border-2 border-dashed border-slate-700 hover:border-amber-500 rounded-lg p-8 text-center bg-slate-950/50 transition-colors">
            <p className="text-sm text-slate-300 font-medium mb-1">Select or drag & drop inventory CSV file</p>
            <p className="text-xs text-slate-500 mb-4">Supports .csv format streaming up to 50,000 rows</p>
            <input
              type="file"
              accept=".csv"
              id="csv-upload-input"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileChange(e.target.files[0]);
                }
              }}
            />
            <label htmlFor="csv-upload-input">
              <Button variant="primary" size="sm" type="button" disabled={isParsing}>
                {isParsing ? 'Streaming & Parsing CSV...' : 'Browse CSV File'}
              </Button>
            </label>
          </div>
        </div>
      )}

      {/* Step 2: Validation Preview */}
      {step === 2 && parseResult && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-lg">
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 font-semibold">{file?.name}</span>
              <Badge variant="healthy">{parseResult.validRows.length} Valid Rows</Badge>
              {parseResult.invalidRows.length > 0 && (
                <Badge variant="low">{parseResult.invalidRows.length} Invalid Rows</Badge>
              )}
            </div>
            <span className="text-xs text-slate-500">Total: {parseResult.totalParsed}</span>
          </div>

          {/* Invalid Rows Error List */}
          {parseResult.invalidRows.length > 0 && (
            <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-3 max-h-40 overflow-y-auto space-y-2">
              <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">Validation Errors Identified:</span>
              {parseResult.invalidRows.slice(0, 10).map((err, idx) => (
                <div key={idx} className="text-xs text-rose-300 font-mono">
                  Row #{err.rowNumber}: {err.errors.join(' | ')}
                </div>
              ))}
              {parseResult.invalidRows.length > 10 && (
                <p className="text-[11px] text-rose-400 italic">...and {parseResult.invalidRows.length - 10} more errors.</p>
              )}
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <Button variant="outline" size="sm" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleCommitImport}
              disabled={parseResult.validRows.length === 0}
            >
              Commit {parseResult.validRows.length} Valid Records
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Batch Commit Progress / Summary */}
      {step === 3 && (
        <div className="py-8 text-center space-y-4">
          {isImporting ? (
            <div className="space-y-3">
              <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm font-semibold text-slate-200">Committing records to server database...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto text-xl font-bold">
                ✓
              </div>
              <h3 className="text-lg font-bold text-slate-100">Import Complete!</h3>
              <p className="text-sm text-slate-300">
                <span className="text-emerald-400 font-bold">{importSummary?.created}</span> records successfully added to inventory.{' '}
                {importSummary?.rejected ? (
                  <span className="text-rose-400 font-semibold">{importSummary.rejected} skipped.</span>
                ) : (
                  '0 skipped.'
                )}
              </p>
              <Button variant="primary" size="sm" onClick={resetState}>
                Done & Refresh Table
              </Button>
            </div>
          )}
        </div>
      )}
    </Dialog>
  );
}
