// Industrial text input primitive formatted for LAMDA FLOW light theme with integrated label and error message support.
import React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  labelClassName?: string;
  error?: boolean | string;
  errorMessage?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className = "",
      label,
      labelClassName = "",
      error,
      errorMessage,
      ...props
    },
    ref,
  ) => {
    const errorText = typeof error === "string" ? error : errorMessage;
    const hasError = Boolean(error || errorMessage);
    const isRequired = props.required || (typeof label === "string" && label.includes("*"));
    const cleanLabel = typeof label === "string" ? label.replace(/\s*\*/g, "").trim() : label;

    const inputElement = (
      <input
        ref={ref}
        className={`h-10 w-full rounded-lg border bg-white px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-0 focus-visible:outline-none transition-colors ${
          hasError
            ? "border-rose-500"
            : "border-slate-300 focus:border-[#ff6600] hover:border-slate-400"
        } ${className}`}
        {...props}
      />
    );

    if (!label && !errorText) {
      return inputElement;
    }

    return (
      <div>
        {label && (
          <label
            className={`block text-xs font-medium text-slate-700 mb-1.5 ${labelClassName}`}
          >
            {cleanLabel}
            {isRequired && (
              <span className="text-rose-500 font-bold ml-0.5">*</span>
            )}
          </label>
        )}
        {inputElement}
        {errorText && (
          <p className="text-[11px] text-rose-500 mt-1">{errorText}</p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
