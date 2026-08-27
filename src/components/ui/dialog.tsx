// Accessible modal dialog primitive for light theme.
import React from 'react';

export function Dialog({ open, onClose, children, title }: { open: boolean; onClose: () => void; children: React.ReactNode; title?: string }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200 rounded-xl shadow-2xl max-w-xl w-full p-6 text-slate-900 relative max-h-[90vh] flex flex-col">
        {title && <h2 className="text-lg font-bold text-slate-900 mb-4">{title}</h2>}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
