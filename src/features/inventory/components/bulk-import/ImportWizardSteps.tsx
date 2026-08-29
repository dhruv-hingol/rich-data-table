import React from "react";
import { ChevronRight } from "lucide-react";

export interface WizardStep {
  number: number;
  label: string;
}

export interface ImportWizardStepsProps {
  currentStep: number;
  steps?: WizardStep[];
  onStepClick?: (stepNumber: number) => void;
}

const DEFAULT_STEPS: WizardStep[] = [
  { number: 1, label: "Upload File" },
  { number: 2, label: "Validation Preview" },
  { number: 3, label: "Batch Commit" },
];

export function ImportWizardSteps({
  currentStep,
  steps = DEFAULT_STEPS,
  onStepClick,
}: ImportWizardStepsProps) {
  return (
    <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
      {steps.map((stepItem, index) => {
        const isActive = currentStep >= stepItem.number;
        const isClickable = onStepClick && stepItem.number < currentStep;

        return (
          <React.Fragment key={stepItem.number}>
            <div
              onClick={() => isClickable && onStepClick(stepItem.number)}
              className={`flex items-center gap-2 ${
                isActive ? "text-[#ff6600] font-bold" : "text-slate-400"
              } ${isClickable ? "cursor-pointer hover:opacity-80 hover:underline" : ""}`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                  isActive
                    ? "bg-[#ff6600] text-white"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                {stepItem.number}
              </span>
              <span className="text-xs">{stepItem.label}</span>
            </div>
            {index < steps.length - 1 && (
              <ChevronRight className="h-4 w-4 text-slate-300 shrink-0" />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default ImportWizardSteps;
