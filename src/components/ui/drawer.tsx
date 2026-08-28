import React, { useEffect, useRef, useState, useCallback } from "react";
import { X } from "lucide-react";

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  side?: "right" | "left";
  className?: string;
}

export function Drawer({
  open,
  onClose,
  title,
  children,
  side = "right",
  className = "",
}: DrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(open);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (open) {
      setIsVisible(true);
      const timer = setTimeout(() => setIsAnimating(true), 15);
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setIsVisible(false), 250);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const handleClose = useCallback(() => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
    }, 250);
  }, [onClose]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, handleClose]);

  if (!isVisible && !open) return null;

  const slideExitClass =
    side === "left" ? "-translate-x-full" : "translate-x-full";

  return (
    <div
      className={`fixed inset-0 z-50 flex ${
        side === "left" ? "justify-start" : "justify-end"
      } bg-slate-900/40 backdrop-blur-xs transition-opacity duration-250 ease-in-out cursor-pointer ${
        isAnimating ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleClose}
    >
      <div
        ref={panelRef}
        onClick={(e) => e.stopPropagation()}
        className={`relative bg-white border-l border-slate-200 w-full max-w-md h-full p-6 text-slate-900 flex flex-col shadow-2xl transition-transform duration-250 ease-in-out cursor-default ${
          isAnimating ? "translate-x-0" : slideExitClass
        } ${className}`}
      >
        {title && (
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6 shrink-0">
            <h3 className="text-lg font-bold text-slate-900">{title}</h3>
            <button
              type="button"
              onClick={handleClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Close drawer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

export default Drawer;
