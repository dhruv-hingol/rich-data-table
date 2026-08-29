import React from "react";
import { Check } from "lucide-react";

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className = "",
      checked,
      defaultChecked,
      onChange,
      disabled,
      id,
      label,
      ...props
    },
    ref,
  ) => {
    const inputId =
      id ||
      (label
        ? `checkbox-${label.replace(/\s+/g, "-").toLowerCase()}`
        : undefined);

    const isChecked = checked ?? defaultChecked;

    return (
      <label
        htmlFor={inputId}
        className={`inline-flex items-center gap-2 select-none ${
          disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
        }`}
      >
        <div className="relative inline-flex items-center justify-center shrink-0">
          <input
            type="checkbox"
            id={inputId}
            ref={ref}
            checked={checked}
            defaultChecked={defaultChecked}
            onChange={onChange}
            disabled={disabled}
            className={`peer appearance-none h-4 w-4 rounded border border-slate-300 bg-white checked:bg-[#ff6600] checked:border-[#ff6600] focus:outline-hidden focus:ring-2 focus:ring-[#ff6600]/30 focus:ring-offset-1 transition-all cursor-pointer ${className}`}
            {...props}
          />
          <Check
            className={`w-3 h-3 text-white stroke-[3.5] absolute pointer-events-none transition-opacity ${
              isChecked ? "opacity-100" : "opacity-0 peer-checked:opacity-100"
            }`}
          />
        </div>
        {label && (
          <span className="text-sm font-medium text-slate-800">{label}</span>
        )}
      </label>
    );
  },
);

Checkbox.displayName = "Checkbox";
export default Checkbox;
