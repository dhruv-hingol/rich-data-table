// Accessible industrial button primitive with LAMDA FLOW primary orange (#FF6600).
import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ variant = 'primary', size = 'md', className = '', ...props }: ButtonProps) {
  const base =
    'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#ff6600] disabled:opacity-50 disabled:pointer-events-none cursor-pointer';
  const variants = {
    primary: 'bg-[#ff6600] hover:bg-[#e55c00] text-white font-semibold shadow-xs',
    secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200',
    outline: 'border border-slate-200 hover:bg-slate-50 text-slate-700 bg-white shadow-xs',
    danger: 'bg-rose-600 hover:bg-rose-500 text-white font-semibold',
    ghost: 'hover:bg-slate-100 text-slate-600',
  };
  const sizes = {
    sm: 'h-9 px-3.5 text-xs',
    md: 'h-10 px-4 text-sm',
    lg: 'h-11 px-6 text-base',
  };
  return <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props} />;
}
