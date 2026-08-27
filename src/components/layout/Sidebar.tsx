// Left sidebar navigation matching the exact LAMDA FLOW layout architecture.
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export function Sidebar() {
  const location = useLocation();
  const [stockExpanded, setStockExpanded] = useState(true);

  const isInventoriesActive = location.pathname === '/' || location.pathname.startsWith('/inventory');

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between h-screen sticky top-0 z-20 shrink-0">
      <div className="flex flex-col flex-1 overflow-y-auto">
        {/* Brand Logo Header */}
        <div className="p-6 flex items-center gap-3">
          <div className="flex items-center">
            {/* LAMDA FLOW Logo Icon */}
            <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
              <path d="M6 24L14 8L18 16L12 24H6Z" fill="#0284c7" />
              <path d="M14 24L22 8L26 16L20 24H14Z" fill="#ff6600" />
            </svg>
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight text-slate-900 block leading-none">
              LAMDA
            </span>
            <span className="font-bold text-xs tracking-widest text-[#ff6600] uppercase block leading-none mt-1">
              FLOW
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="px-3 py-2 space-y-1 text-sm font-medium">
          {/* Dashboard */}
          <div className="flex items-center justify-between px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 cursor-pointer">
            <div className="flex items-center gap-3">
              <span className="text-slate-400">⊞</span>
              <span>Dashboard</span>
            </div>
          </div>

          {/* Sales */}
          <div className="flex items-center justify-between px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 cursor-pointer">
            <div className="flex items-center gap-3">
              <span className="text-slate-400">📋</span>
              <span>Sales</span>
            </div>
            <span className="text-slate-400 text-xs">›</span>
          </div>

          {/* Stock (Expanded) */}
          <div>
            <div
              onClick={() => setStockExpanded(!stockExpanded)}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                isInventoriesActive ? 'text-[#ff6600] font-semibold' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-[#ff6600]">📦</span>
                <span>Stock</span>
              </div>
              <span className="text-slate-400 text-xs">{stockExpanded ? '∨' : '›'}</span>
            </div>

            {stockExpanded && (
              <div className="ml-4 pl-3 border-l border-slate-200 space-y-1 mt-1">
                <Link
                  to="/"
                  className={`flex items-center gap-2 px-3 py-2 text-xs rounded-lg transition-colors relative ${
                    isInventoriesActive
                      ? 'text-[#ff6600] font-bold bg-orange-50/50'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {isInventoriesActive && (
                    <span className="absolute -left-[13px] top-1/2 -translate-y-1/2 w-1.5 h-5 bg-[#ff6600] rounded-r-full" />
                  )}
                  • Inventories
                </Link>
                <div className="px-3 py-2 text-xs text-slate-500 hover:text-slate-800 cursor-pointer">• Movements</div>
                <div className="px-3 py-2 text-xs text-slate-500 hover:text-slate-800 cursor-pointer">• Warehouses</div>
                <div className="px-3 py-2 text-xs text-slate-500 hover:text-slate-800 cursor-pointer">• Transactions</div>
              </div>
            )}
          </div>

          {/* Accounts */}
          <div className="flex items-center justify-between px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 cursor-pointer">
            <div className="flex items-center gap-3">
              <span className="text-slate-400">👤</span>
              <span>Accounts</span>
            </div>
            <span className="text-slate-400 text-xs">›</span>
          </div>

          {/* My Company */}
          <div className="flex items-center justify-between px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 cursor-pointer">
            <div className="flex items-center gap-3">
              <span className="text-slate-400">🏢</span>
              <span>My Company</span>
            </div>
            <span className="text-slate-400 text-xs">›</span>
          </div>

          {/* Products */}
          <div className="flex items-center justify-between px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 cursor-pointer">
            <div className="flex items-center gap-3">
              <span className="text-slate-400">🏷️</span>
              <span>Products</span>
            </div>
            <span className="text-slate-400 text-xs">›</span>
          </div>

          {/* Raw Materials */}
          <div className="flex items-center justify-between px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 cursor-pointer">
            <div className="flex items-center gap-3">
              <span className="text-slate-400">⚙️</span>
              <span>Raw Materials</span>
            </div>
            <span className="text-slate-400 text-xs">›</span>
          </div>

          {/* Reports */}
          <div className="flex items-center justify-between px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 cursor-pointer">
            <div className="flex items-center gap-3">
              <span className="text-slate-400">📊</span>
              <span>Reports</span>
            </div>
            <span className="text-slate-400 text-xs">›</span>
          </div>
        </nav>
      </div>

      {/* Bottom Current Plan Card */}
      <div className="p-4 border-t border-slate-100">
        <div className="p-3 bg-orange-50/60 border border-orange-100 rounded-xl flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#ff6600] text-white flex items-center justify-center font-bold text-xs">
            B360
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">CURRENT PLAN</span>
            <span className="text-xs font-bold text-slate-900 block">Bizz360</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
