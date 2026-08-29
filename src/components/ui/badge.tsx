import React from "react";

export function Badge({
  children,
  variant = "default",
  className = "",
}: {
  children: React.ReactNode;
  variant?: "default" | "low" | "healthy" | "overstock" | "discontinued";
  className?: string;
}) {
  const styles = {
    default: "bg-slate-100 text-slate-700 border-slate-200",
    low: "bg-rose-50 text-rose-700 border-rose-200",
    healthy: "bg-emerald-50 text-emerald-700 border-emerald-200",
    overstock: "bg-blue-50 text-blue-700 border-blue-200",
    discontinued: "bg-slate-100 text-slate-500 border-slate-200",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
