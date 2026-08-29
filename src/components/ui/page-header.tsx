// Reusable PageHeader component supporting title, back navigation text, back arrow, subtitle, custom actions, sticky positioning, and children elements.
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export interface PageHeaderProps {
  title: React.ReactNode;
  backText?: string;
  onBack?: () => void;
  backHref?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  sticky?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  backText,
  onBack,
  backHref = "/",
  subtitle,
  actions,
  sticky = false,
  children,
  className = "",
}: PageHeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(backHref);
    }
  };

  const stickyClasses = sticky
    ? "sticky top-0 bg-white z-30 pt-5 pb-3 border-b border-slate-200 mb-8"
    : "pt-2 pb-6";

  return (
    <div className={`${stickyClasses} ${className}`}>
      {backText && (
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 hover:text-[#ff6600] transition-colors cursor-pointer mb-2 group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1 text-slate-900" />
          <span>{backText}</span>
        </button>
      )}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>
      {children && <div className="mt-3">{children}</div>}
    </div>
  );
}

export default PageHeader;
