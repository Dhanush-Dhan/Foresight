import React, { useState } from 'react';
import {
  Grid,
  AlertTriangle,
  Package,
  ShieldCheck,
  Eye,
  Filter,
  DollarSign,
  Info
} from 'lucide-react';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ReferenceLine
} from 'recharts';
import { RISK_ANALYSIS_DATA } from '../data/foresightData';
import { formatINR, getQuadrantLabel } from '../utils/riskScoringEngine';
import { QuadrantType, RiskAnalysisResult } from '../types';

export const DecisioningGridTab: React.FC = () => {
  const [selectedQuadrant, setSelectedQuadrant] = useState<QuadrantType | 'ALL'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSku, setSelectedSku] = useState<RiskAnalysisResult | null>(null);

  // Prepare Scatter Plot Data
  const scatterData = RISK_ANALYSIS_DATA
    .filter((r) => selectedCategory === 'All' || r.category === selectedCategory)
    .map((sku) => {
      let color = '#10b981';
      if (sku.quadrant === 'REORDER_NOW') color = '#f43f5e';
      else if (sku.quadrant === 'MARKDOWN_CLEAR') color = '#f59e0b';
      else if (sku.quadrant === 'WATCH_VOLATILE') color = '#a855f7';

      const revenueAtStake = Math.max(
        sku.sales_at_risk_rupees,
        sku.locked_capital_rupees,
        sku.list_price * 10
      );

      return {
        ...sku,
        x: sku.overstock_risk_score,
        y: sku.stockout_risk_score,
        z: Math.min(250, Math.max(40, revenueAtStake / 25000)), // bubble radius sizing
        fillColor: color
      };
    });

  const displayList = scatterData.filter(
    (item) => selectedQuadrant === 'ALL' || item.quadrant === selectedQuadrant
  );

  return (
    <div className="space-y-6">
      {/* Header & Quadrant Selector */}
      <div className="bg-[#1E293B] rounded-xl p-6 border border-slate-700/50 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-700/50 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 rounded-full">
                Deliverable D4 Risk Matrix
              </span>
              <span className="text-xs text-slate-400">• 4-Quadrant Decisioning Grid</span>
            </div>
            <h2 className="text-xl font-bold text-slate-100 mt-1">
              Stockout vs Overstock Risk Matrix (200 SKUs)
            </h2>
          </div>

          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-[#0F172A] border border-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Categories (200 SKUs)</option>
              <option value="Furnishings & Seating">Furnishings & Seating</option>
              <option value="Lighting & Small Appliances">Lighting & Small Appliances</option>
              <option value="Dining & Tableware">Dining & Tableware</option>
              <option value="Bedding & Bath">Bedding & Bath</option>
              <option value="Home Decor & Rugs">Home Decor & Rugs</option>
            </select>
          </div>
        </div>

        {/* 4 Quadrant Interactive Selector Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
          <button
            onClick={() => setSelectedQuadrant(selectedQuadrant === 'REORDER_NOW' ? 'ALL' : 'REORDER_NOW')}
            className={`p-4 rounded-xl text-left border transition ${
              selectedQuadrant === 'REORDER_NOW'
                ? 'bg-rose-600 text-white border-rose-500 shadow-lg shadow-rose-500/20'
                : 'bg-rose-500/10 text-slate-200 border-rose-500/20 hover:bg-rose-500/20'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider">Reorder Now</span>
              <AlertTriangle className={`w-4 h-4 ${selectedQuadrant === 'REORDER_NOW' ? 'text-white' : 'text-rose-400'}`} />
            </div>
            <p className={`text-2xl font-bold mt-2 ${selectedQuadrant === 'REORDER_NOW' ? 'text-white' : 'text-rose-400'}`}>
              60 SKUs
            </p>
            <p className={`text-[11px] mt-1 ${selectedQuadrant === 'REORDER_NOW' ? 'text-rose-100' : 'text-slate-400'}`}>
              High Stockout Risk • Raise PO
            </p>
          </button>

          <button
            onClick={() => setSelectedQuadrant(selectedQuadrant === 'MARKDOWN_CLEAR' ? 'ALL' : 'MARKDOWN_CLEAR')}
            className={`p-4 rounded-xl text-left border transition ${
              selectedQuadrant === 'MARKDOWN_CLEAR'
                ? 'bg-amber-600 text-white border-amber-500 shadow-lg shadow-amber-500/20'
                : 'bg-amber-500/10 text-slate-200 border-amber-500/20 hover:bg-amber-500/20'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider">Markdown / Clear</span>
              <Package className={`w-4 h-4 ${selectedQuadrant === 'MARKDOWN_CLEAR' ? 'text-white' : 'text-amber-400'}`} />
            </div>
            <p className={`text-2xl font-bold mt-2 ${selectedQuadrant === 'MARKDOWN_CLEAR' ? 'text-white' : 'text-amber-400'}`}>
              58 SKUs
            </p>
            <p className={`text-[11px] mt-1 ${selectedQuadrant === 'MARKDOWN_CLEAR' ? 'text-amber-100' : 'text-slate-400'}`}>
              High Overstock • Promote & Discount
            </p>
          </button>

          <button
            onClick={() => setSelectedQuadrant(selectedQuadrant === 'WATCH_VOLATILE' ? 'ALL' : 'WATCH_VOLATILE')}
            className={`p-4 rounded-xl text-left border transition ${
              selectedQuadrant === 'WATCH_VOLATILE'
                ? 'bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-500/20'
                : 'bg-purple-500/10 text-slate-200 border-purple-500/20 hover:bg-purple-500/20'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider">Watch / Volatile</span>
              <Eye className={`w-4 h-4 ${selectedQuadrant === 'WATCH_VOLATILE' ? 'text-white' : 'text-purple-400'}`} />
            </div>
            <p className={`text-2xl font-bold mt-2 ${selectedQuadrant === 'WATCH_VOLATILE' ? 'text-white' : 'text-purple-400'}`}>
              22 SKUs
            </p>
            <p className={`text-[11px] mt-1 ${selectedQuadrant === 'WATCH_VOLATILE' ? 'text-purple-100' : 'text-slate-400'}`}>
              High Both • Manual Audit
            </p>
          </button>

          <button
            onClick={() => setSelectedQuadrant(selectedQuadrant === 'HEALTHY' ? 'ALL' : 'HEALTHY')}
            className={`p-4 rounded-xl text-left border transition ${
              selectedQuadrant === 'HEALTHY'
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-500/20'
                : 'bg-emerald-500/10 text-slate-200 border-emerald-500/20 hover:bg-emerald-500/20'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider">Healthy Stock</span>
              <ShieldCheck className={`w-4 h-4 ${selectedQuadrant === 'HEALTHY' ? 'text-white' : 'text-emerald-400'}`} />
            </div>
            <p className={`text-2xl font-bold mt-2 ${selectedQuadrant === 'HEALTHY' ? 'text-white' : 'text-emerald-400'}`}>
              60 SKUs
            </p>
            <p className={`text-[11px] mt-1 ${selectedQuadrant === 'HEALTHY' ? 'text-emerald-100' : 'text-slate-400'}`}>
              Optimal Stock • Maintain
            </p>
          </button>
        </div>
      </div>

      {/* 4-Quadrant Bubble Grid Chart */}
      <div className="bg-[#1E293B] rounded-xl p-6 border border-slate-700/50 shadow-sm relative">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Grid className="w-4 h-4 text-indigo-400" />
              <span>Interactive Decision Matrix (Bubble Size = Value at Stake ₹)</span>
            </h3>
            <p className="text-xs text-slate-400">
              Y-Axis: Stockout Risk Score (0-1.0) | X-Axis: Overstock Risk Score (0-1.0)
            </p>
          </div>
          {selectedQuadrant !== 'ALL' && (
            <button
              onClick={() => setSelectedQuadrant('ALL')}
              className="text-xs text-indigo-400 font-semibold bg-indigo-500/10 px-3 py-1 rounded-lg border border-indigo-500/30 hover:bg-indigo-500/20"
            >
              Reset Quadrant Filter
            </button>
          )}
        </div>

        <div className="h-96 w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis
                type="number"
                dataKey="x"
                name="Overstock Risk"
                domain={[0, 1.0]}
                unit=""
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                label={{ value: 'Overstock Risk Score →', position: 'bottom', offset: 0, fontSize: 11, fill: '#94a3b8' }}
              />
              <YAxis
                type="number"
                dataKey="y"
                name="Stockout Risk"
                domain={[0, 1.0]}
                unit=""
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                label={{ value: '↑ Stockout Risk Score', angle: -90, position: 'insideLeft', fontSize: 11, fill: '#94a3b8' }}
              />
              <ReferenceLine x={0.5} stroke="#475569" strokeDasharray="4 4" />
              <ReferenceLine y={0.5} stroke="#475569" strokeDasharray="4 4" />

              <Tooltip
                cursor={{ strokeDasharray: '3 3' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as RiskAnalysisResult;
                    return (
                      <div className="bg-[#0F172A] text-slate-100 p-3 rounded-xl text-xs space-y-1 shadow-xl border border-slate-700">
                        <p className="font-bold text-slate-100">{data.sku_id} - {data.sku_name}</p>
                        <p className="text-slate-400">Category: {data.category}</p>
                        <p className="text-indigo-400 font-semibold">
                          Quadrant: {getQuadrantLabel(data.quadrant).label}
                        </p>
                        <p className="text-rose-400">
                          Sales at Risk: {formatINR(data.sales_at_risk_rupees)}
                        </p>
                        <p className="text-amber-400">
                          Locked Capital: {formatINR(data.locked_capital_rupees)}
                        </p>
                        <p className="text-slate-400 text-[10px] italic mt-1">{data.recommended_action}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              <Scatter
                data={scatterData}
                onClick={(entry) => setSelectedSku(entry as any)}
                cursor="pointer"
              >
                {scatterData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.fillColor}
                    fillOpacity={0.85}
                    stroke={selectedSku?.sku_id === entry.sku_id ? '#fff' : '#1e293b'}
                    strokeWidth={selectedSku?.sku_id === entry.sku_id ? 3 : 1}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filtered SKU Table Matching Quadrant Selection */}
      <div className="bg-[#1E293B] rounded-xl border border-slate-700/50 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-800/50 border-b border-slate-700/50 flex justify-between items-center text-xs">
          <span className="font-bold text-slate-200">
            Showing {displayList.length} SKUs in {selectedQuadrant === 'ALL' ? 'All Quadrants' : getQuadrantLabel(selectedQuadrant as QuadrantType).label}
          </span>
          <span className="text-slate-400">Click any row for operational details</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/80 text-slate-400 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-700/50">
              <tr>
                <th className="py-3 px-4">SKU Code</th>
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-center">Quadrant</th>
                <th className="py-3 px-4 text-center">Stockout Score</th>
                <th className="py-3 px-4 text-center">Overstock Score</th>
                <th className="py-3 px-4 text-right">Value at Stake</th>
                <th className="py-3 px-4">Recommended Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30 text-slate-300">
              {displayList.slice(0, 15).map((item) => {
                const quadStyle = getQuadrantLabel(item.quadrant);
                return (
                  <tr
                    key={item.sku_id}
                    onClick={() => setSelectedSku(item)}
                    className="hover:bg-slate-700/30 cursor-pointer transition"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-indigo-400">{item.sku_id}</td>
                    <td className="py-3 px-4 font-medium text-slate-200">{item.sku_name}</td>
                    <td className="py-3 px-4 text-slate-400">{item.category}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${quadStyle.badgeBg}`}>
                        {quadStyle.label}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-rose-400">
                      {(item.stockout_risk_score * 100).toFixed(0)}%
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-amber-400">
                      {(item.overstock_risk_score * 100).toFixed(0)}%
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-slate-100">
                      {formatINR(Math.max(item.sales_at_risk_rupees, item.locked_capital_rupees))}
                    </td>
                    <td className="py-3 px-4 text-slate-300 truncate max-w-xs">{item.recommended_action}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
