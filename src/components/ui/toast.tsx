// Toast helper functions matching exact screenshot design: light green tint bg, green border, checkmark icon, and top-center positioning.
import { toast as sonnerToast } from "sonner";
import { CheckCircle2, AlertCircle, Info } from "lucide-react";

export const showToast = {
  success: (message: string) => {
    sonnerToast.custom(() => (
      <div className="bg-[#ecfdf5] border border-[#10b981] text-slate-900 px-4 py-2 rounded-xl shadow-md inline-flex items-center gap-2.5 text-xs sm:text-sm font-medium pointer-events-auto">
        <CheckCircle2 className="h-4.5 w-4.5 text-[#10b981] shrink-0 fill-[#10b981] text-white" />
        <span>{message}</span>
      </div>
    ));
  },

  error: (message: string) => {
    sonnerToast.custom(() => (
      <div className="bg-[#fef2f2] border border-[#f43f5e] text-slate-900 px-4 py-2 rounded-xl shadow-md inline-flex items-center gap-2.5 text-xs sm:text-sm font-medium pointer-events-auto">
        <AlertCircle className="h-4.5 w-4.5 text-[#f43f5e] shrink-0 fill-[#f43f5e] text-white" />
        <span>{message}</span>
      </div>
    ));
  },

  info: (message: string) => {
    sonnerToast.custom(() => (
      <div className="bg-[#eff6ff] border border-[#3b82f6] text-slate-900 px-4 py-2 rounded-xl shadow-md inline-flex items-center gap-2.5 text-xs sm:text-sm font-medium pointer-events-auto">
        <Info className="h-4.5 w-4.5 text-[#3b82f6] shrink-0" />
        <span>{message}</span>
      </div>
    ));
  },
};

export default showToast;
