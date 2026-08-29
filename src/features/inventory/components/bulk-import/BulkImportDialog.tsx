import { showToast } from "../../../../components/ui/toast";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Dialog } from "../../../../components/ui/dialog";
import { parseCSVStream, type ParseResult } from "../../lib/csvParser";
import { useTableUIStore } from "../../store/useTableUIStore";
import { useBulkCreateRecordsMutation, inventoryKeys } from "../../hooks/useInventoryQuery";
import { ImportWizardSteps } from "./ImportWizardSteps";
import { UploadStep } from "./UploadStep";
import { ValidationPreviewStep } from "./ValidationPreviewStep";
import { CommitSummaryStep } from "./CommitSummaryStep";

export function BulkImportDialog() {
  const { isBulkImportOpen, setIsBulkImportOpen, triggerRefresh } =
    useTableUIStore();
  const queryClient = useQueryClient();
  const bulkCreateMutation = useBulkCreateRecordsMutation();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isParsing, setIsParsing] = useState(false);
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importSummary, setImportSummary] = useState<{
    created: number;
    rejected: number;
  } | null>(null);

  const handleFileChange = async (selectedFile: File) => {
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
      const res = await bulkCreateMutation.mutateAsync(parseResult.validRows);
      setImportSummary({
        created: res.created.length,
        rejected: res.rejected.length + parseResult.invalidRows.length,
      });
      showToast.success(`Successfully imported ${res.created.length} products`);
      queryClient.invalidateQueries({ queryKey: inventoryKeys.all });
      triggerRefresh();
    } catch (err) {
      console.error("Bulk create error:", err);
    } finally {
      setIsImporting(false);
    }
  };

  const resetState = () => {
    setStep(1);
    setParseResult(null);
    setImportSummary(null);
    queryClient.invalidateQueries({ queryKey: inventoryKeys.all });
    triggerRefresh();
    setIsBulkImportOpen(false);
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <UploadStep
            isParsing={isParsing}
            onFileSelected={handleFileChange}
          />
        );

      case 2:
        if (!parseResult) return null;
        return (
          <ValidationPreviewStep
            parseResult={parseResult}
            onCancel={resetState}
            onCommit={handleCommitImport}
          />
        );

      case 3:
        return (
          <CommitSummaryStep
            isImporting={isImporting}
            importSummary={importSummary}
            onDone={resetState}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Dialog
      open={isBulkImportOpen}
      onClose={resetState}
      title="Bulk CSV Inventory Import Wizard"
      size="lg"
    >
      <ImportWizardSteps currentStep={step} />
      {renderStepContent()}
    </Dialog>
  );
}
