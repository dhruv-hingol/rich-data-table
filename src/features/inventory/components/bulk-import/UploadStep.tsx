import { UploadCloud } from "lucide-react";

export interface UploadStepProps {
  isParsing: boolean;
  onFileSelected: (file: File) => void;
}

export function UploadStep({ isParsing, onFileSelected }: UploadStepProps) {
  return (
    <div className="space-y-6 text-center py-6">
      <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 hover:border-[#ff6600] transition-colors cursor-pointer bg-slate-50">
        <input
          type="file"
          accept=".csv"
          id="csv-file-input"
          className="hidden"
          onChange={(e) =>
            e.target.files?.[0] && onFileSelected(e.target.files[0])
          }
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
