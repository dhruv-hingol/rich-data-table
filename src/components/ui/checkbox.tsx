import React from "react";

export const Checkbox = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className = "", ...props }, ref) => {
  return (
    <input
      type="checkbox"
      ref={ref}
      className={`h-4 w-4 rounded border-slate-700 bg-slate-900 text-amber-600 focus:ring-amber-500 focus:ring-offset-slate-900 ${className}`}
      {...props}
    />
  );
});
Checkbox.displayName = "Checkbox";
