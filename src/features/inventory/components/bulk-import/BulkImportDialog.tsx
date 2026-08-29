import { showToast } from "@/src/components/ui/toast";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Modal } from "@/src/components/ui/modal";
import { parseCSVStream, type ParseResult } from "@/src/features/inventory/lib/csvParser";
import { useTableUIStore } from "@/src/features/inventory/store/useTableUIStore";
import { useBulkCreateRecordsMutation, inventoryKeys } from "@/src/features/inventory/hooks/useInventoryQuery";
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

  const handleBackToUpload = () => {
    setStep(1);
    setParseResult(null);
    setImportSummary(null);
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
            onBack={handleBackToUpload}
          />
        );

      case 3:
        return (
          <CommitSummaryStep
            isImporting={isImporting}
            importSummary={importSummary}
            onDone={resetState}
            onUploadAnother={handleBackToUpload}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Modal
      open={isBulkImportOpen}
      onClose={resetState}
      title="Bulk CSV Inventory Import Wizard"
      size="lg"
    >
      <ImportWizardSteps
        currentStep={step}
        onStepClick={(stepNum) => stepNum === 1 && handleBackToUpload()}
      />
      {renderStepContent()}
    </Modal>
  );
}

export default BulkImportDialog;
