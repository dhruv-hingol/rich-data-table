// Top application header component with breadcrumb and user profile menu.
import React from 'react';

export function Header() {
  return (
    <header className="px-8 py-4 bg-white border-b border-slate-200 flex items-center justify-between sticky top-0 z-10">
      {/* Left Breadcrumb */}
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded flex items-center justify-center text-[#ff6600]">
          🏢
        </div>
        <span className="text-base font-bold text-[#ff6600]">Company</span>
      </div>

      {/* Right User Options */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-slate-800 hover:text-slate-900">
          <span>Dhruv Engineering</span>
          <span className="text-slate-400 text-xs">∨</span>
        </div>

        <div className="relative cursor-pointer text-slate-500 hover:text-slate-700">
          <span className="text-lg">🔔</span>
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
        </div>

        <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden border border-slate-300">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
            alt="User Avatar"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  );
}
