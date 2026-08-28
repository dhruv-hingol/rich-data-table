// Accessible industrial button primitive supporting prefix/suffix icons with dynamic color inheritance.
import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'text';
  size?: 'sm' | 'md' | 'lg';
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  prefixIcon,
  suffixIcon,
  className = '',
  children,
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-colors focus:outline-none focus:ring-0 focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none cursor-pointer [&>svg]:transition-colors [&>svg]:shrink-0';
  
  const variants = {
    primary: 'bg-[#ff6600] hover:bg-[#e55c00] text-white font-semibold shadow-2xs',
    secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-semibold',
    outline: 'border border-slate-300 text-slate-800 bg-white hover:border-[#ff6600] hover:text-[#ff6600] hover:bg-orange-50/50 font-semibold shadow-2xs',
    danger: 'bg-rose-600 hover:bg-rose-500 text-white font-semibold',
    ghost: 'hover:bg-slate-100 text-slate-600',
    text: 'bg-transparent text-[#ff6600] hover:text-[#e55c00] hover:bg-orange-50/50 font-semibold border-none shadow-none p-0 h-auto',
  };

  const sizes = {
    sm: 'h-9 px-3.5 text-xs',
    md: 'h-10 px-4 text-sm',
    lg: 'h-11 px-6 text-base',
  };

  const appliedSize = variant === 'text' ? '' : sizes[size];

  return (
    <button className={`${base} ${variants[variant]} ${appliedSize} ${className}`} {...props}>
      {prefixIcon}
      {children && <span>{children}</span>}
      {suffixIcon}
    </button>
  );
}

export default Button;
