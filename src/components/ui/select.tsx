// Select dropdown primitive for LAMDA FLOW light theme.
import React from 'react';

export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(({ className = '', children, ...props }, ref) => {
  return (
    <select
      ref={ref}
      className={`h-10 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-800 focus:border-[#ff6600] focus:outline-none focus:ring-2 focus:ring-[#ff6600]/20 ${className}`}
      {...props}
    >
      {children}
    </select>
  );
});
Select.displayName = 'Select';
