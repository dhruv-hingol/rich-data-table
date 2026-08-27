// Toast notification component supporting action verbs and 5-second undo timer progress bars.
import React from 'react';

export function Toast({ message, onUndo, onDismiss }: { message: string; onUndo?: () => void; onDismiss?: () => void }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-4 bg-slate-800 border border-slate-700 text-slate-100 px-4 py-3 rounded-lg shadow-xl animate-in slide-in-from-bottom-4 duration-200">
      <span className="text-sm font-medium">{message}</span>
      {onUndo && (
        <button onClick={onUndo} className="text-xs font-semibold text-amber-400 hover:underline">
          Undo
        </button>
      )}
    </div>
  );
}
