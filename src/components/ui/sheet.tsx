// Slide-over side sheet panel primitive matching Screenshot 2 Inventory Filters drawer.
import React from 'react';

export function Sheet({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white border-l border-slate-200 w-full max-w-md h-full p-6 text-slate-900 flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 text-lg font-bold">
            ✕
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
