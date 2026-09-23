import React from 'react';
import { Sparkles, AlertTriangle, Package, Layers, ShieldCheck, Zap } from 'lucide-react';
import { getPlatformMetrics } from '../data/foresightData';
import { formatINR } from '../utils/riskScoringEngine';

interface HeaderProps {
  onOpenAiCopilot: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAiCopilot }) => {
  const metrics = getPlatformMetrics();

  return (
    <header className="bg-[#1E293B]/80 backdrop-blur-md border-b border-slate-700/50 text-white px-6 py-3.5 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Brand & Project Identity */}
        <div className="flex items-center space-x-3.5">
          <div className="w-9 h-9 rounded-lg bg-indigo-500 flex items-center justify-center font-bold text-white text-lg shadow-lg shadow-indigo-500/20">
            F
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-bold text-lg tracking-tight text-white">FORESIGHT</h1>
              <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 rounded-full">
                Enterprise v1.0
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center space-x-1.5">
              <span>Client: <strong className="text-slate-300 font-medium">NorthBay Living</strong></span>
              <span>•</span>
              <span className="text-emerald-400 flex items-center gap-1 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                200 Active SKUs
              </span>
            </p>
          </div>
        </div>

        {/* Live Top Metrics Summary */}
        <div className="hidden xl:flex items-center space-x-4 text-xs">
          <div className="bg-[#0F172A]/80 border border-slate-700/50 rounded-xl px-3.5 py-1.5 flex items-center space-x-2.5">
            <div className="p-1 rounded bg-rose-500/20 text-rose-400">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-slate-400 text-[10px] uppercase font-semibold tracking-wider">Sales at Risk</p>
              <p className="font-bold text-rose-400">{formatINR(metrics.totalSalesAtRiskRupees)}</p>
            </div>
          </div>

          <div className="bg-[#0F172A]/80 border border-slate-700/50 rounded-xl px-3.5 py-1.5 flex items-center space-x-2.5">
            <div className="p-1 rounded bg-amber-500/20 text-amber-400">
              <Package className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-slate-400 text-[10px] uppercase font-semibold tracking-wider">Locked Capital</p>
              <p className="font-bold text-amber-400">{formatINR(metrics.totalLockedCapitalRupees)}</p>
            </div>
          </div>

          <div className="bg-[#0F172A]/80 border border-slate-700/50 rounded-xl px-3.5 py-1.5 flex items-center space-x-2.5">
            <div className="p-1 rounded bg-emerald-500/20 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-slate-400 text-[10px] uppercase font-semibold tracking-wider">ML Accuracy</p>
              <p className="font-bold text-emerald-400">{metrics.overallWapeML}% WAPE <span className="text-[10px] text-slate-400 font-normal">(vs 28.6% base)</span></p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenAiCopilot}
            className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/20 transition duration-150 border border-indigo-400/30"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-200 animate-pulse" />
            <span>AI Core Assistant</span>
          </button>
        </div>
      </div>
    </header>
  );
};
