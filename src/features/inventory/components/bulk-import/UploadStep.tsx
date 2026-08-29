import { useState } from "react";
import { UploadCloud } from "lucide-react";

export interface UploadStepProps {
  isParsing: boolean;
  onFileSelected: (file: File) => void;
}

export function UploadStep({ isParsing, onFileSelected }: UploadStepProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.name.endsWith(".csv")) {
        onFileSelected(file);
      }
    }
  };

  return (
    <div className="space-y-6 text-center py-6">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-8 transition-colors cursor-pointer ${
          isDragOver
            ? "border-[#ff6600] bg-orange-50/50"
            : "border-slate-200 hover:border-[#ff6600] bg-slate-50"
        }`}
      >
        <input
          type="file"
          accept=".csv"
          id="csv-file-input"
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              const file = e.target.files[0];
              e.target.value = "";
              onFileSelected(file);
            }
          }}
        />
        <label
          htmlFor="csv-file-input"
          className="cursor-pointer flex flex-col items-center space-y-2"
        >
          <UploadCloud className="w-10 h-10 text-[#ff6600] mb-1" />
          <p className="text-sm font-semibold text-slate-800">
            Click or Drag & Drop CSV file to upload
          </p>
          <p className="text-xs text-slate-500">
            Supports files up to 50MB with SKU, Name, Barcode, Warehouse columns
          </p>
        </label>
      </div>
      {isParsing && (
        <p className="text-xs font-semibold text-[#ff6600] animate-pulse">
          Parsing CSV stream and validating schema rules...
        </p>
      )}
    </div>
  );
}

export default UploadStep;
