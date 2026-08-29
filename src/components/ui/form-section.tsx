import React from "react";

export interface FormSectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
  showDivider?: boolean;
  className?: string;
}

export function FormSection({
  id,
  title,
  children,
  showDivider = true,
  className = "",
}: FormSectionProps) {
  return (
    <>
      <div id={id} className={`pt-2 scroll-mt-20 ${className}`}>
        <div className="flex flex-col md:flex-row gap-6 md:gap-12 pb-8">
          <div className="w-full md:w-52 shrink-0">
            <h3 className="text-base font-bold text-slate-900">{title}</h3>
          </div>
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {children}
          </div>
        </div>
      </div>
      {showDivider && (
        <div className="border-t border-dashed border-slate-200 my-6" />
      )}
    </>
  );
}

export default FormSection;
