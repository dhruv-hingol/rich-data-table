import React from "react";

export const Checkbox = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className = "", ...props }, ref) => {
  return (
    <input
      type="checkbox"
      ref={ref}
      className={`h-4 w-4 rounded border-slate-300 bg-white text-[#ff6600] accent-[#ff6600] focus:ring-[#ff6600] focus:ring-offset-1 cursor-pointer transition-colors ${className}`}
      {...props}
    />
  );
});
Checkbox.displayName = "Checkbox";
