import React from "react";
import { Modal } from "./modal";
import { Button } from "./button";
import { AlertTriangle, Trash2, Info, Loader2 } from "lucide-react";

export interface ConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  loadingText?: string;
  variant?: "danger" | "warning" | "primary";
  icon?: React.ReactNode;
  isLoading?: boolean;
}

export function ConfirmationModal({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  loadingText,
  variant = "primary",
  icon,
  isLoading = false,
}: ConfirmationModalProps) {
  const variantStyles = {
    danger: {
      iconBg: "bg-rose-50 text-rose-600 border-rose-100",
      confirmBtn: "",
      defaultIcon: <Trash2 className="w-6 h-6" />,
      loaderColor: "text-rose-600",
    },
    warning: {
      iconBg: "bg-amber-50 text-amber-600 border-amber-100",
      confirmBtn: "bg-amber-600 hover:bg-amber-700 text-white border-amber-600",
      defaultIcon: <AlertTriangle className="w-6 h-6" />,
      loaderColor: "text-amber-600",
    },
    primary: {
      iconBg: "bg-orange-50 text-[#ff6600] border-orange-100",
      confirmBtn: "bg-[#ff6600] hover:bg-[#e55c00] text-white border-[#ff6600]",
      defaultIcon: <Info className="w-6 h-6" />,
      loaderColor: "text-[#ff6600]",
    },
  };

  const currentVariant = variantStyles[variant];

  return (
    <Modal open={open} onClose={onClose} size="sm" preventClose={isLoading}>
      <div className="flex flex-col items-center text-center p-2">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 border transition-all duration-300 ${currentVariant.iconBg}`}
        >
          {isLoading ? (
            <Loader2
              className={`w-6 h-6 animate-spin ${currentVariant.loaderColor}`}
            />
          ) : (
            icon || currentVariant.defaultIcon
          )}
        </div>

        <h3 className="text-lg font-bold text-slate-900 tracking-tight">
          {isLoading ? (
            <span className="flex items-center gap-2 justify-center">
              Deleting Selected Records...
            </span>
          ) : (
            title
          )}
        </h3>

        <div className="text-xs text-slate-500 mt-2 leading-relaxed max-w-xs">
          {isLoading ? (
            <div className="flex flex-col items-center gap-2.5 py-1">
              <p className="font-medium text-slate-600">
                Please wait while all selected records are being permanently
                deleted.
              </p>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
                <div className="bg-rose-500 h-full w-full animate-pulse rounded-full" />
              </div>
            </div>
          ) : (
            description
          )}
        </div>

        <div className="flex items-center justify-center gap-3 w-full mt-6 pt-4 border-t border-slate-100">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1"
          >
            {cancelText}
          </Button>
          <Button
            variant={variant === "danger" ? "danger" : "primary"}
            size="sm"
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 ${currentVariant.confirmBtn}`}
            prefixIcon={
              isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : undefined
            }
          >
            {isLoading ? loadingText || "Deleting..." : confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default ConfirmationModal;
