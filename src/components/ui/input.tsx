// Industrial text input primitive formatted for LAMDA FLOW light theme.
import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className = '', error, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={`h-10 w-full rounded-lg border bg-white px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-0 focus-visible:outline-none transition-colors ${
        error ? 'border-rose-500' : 'border-slate-300 focus:border-[#ff6600] hover:border-slate-400'
      } ${className}`}
      {...props}
    />
  );
});
Input.displayName = 'Input';
