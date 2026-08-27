// High-density initial loading skeleton animation placeholder for grid header and rows.
import React from 'react';

export function TableSkeleton() {
  return (
    <div className="w-full h-full flex flex-col gap-2 p-4 animate-pulse">
      <div className="h-10 bg-slate-800 rounded w-full"></div>
      <div className="h-8 bg-slate-800/60 rounded w-full"></div>
      <div className="h-8 bg-slate-800/60 rounded w-full"></div>
      <div className="h-8 bg-slate-800/60 rounded w-full"></div>
      <div className="h-8 bg-slate-800/60 rounded w-full"></div>
    </div>
  );
}
