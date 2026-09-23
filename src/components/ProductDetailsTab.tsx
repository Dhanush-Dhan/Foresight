import React, { useState } from 'react';
import {
  Search,
  Box,
  TrendingUp,
  AlertTriangle,
  Clock,
  ShieldCheck,
  DollarSign,
  Layers,
  LineChart as LineChartIcon,
  RefreshCw,
  Sliders
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { SKU_MASTER_LIST, RISK_ANALYSIS_DATA, generateWeeklyForecastSeries } from '../data/foresightData';
import { formatINR, getQuadrantLabel } from '../utils/riskScoringEngine';

export const ProductDetailsTab: React.FC = () => {
  const [selectedSkuId, setSelectedSkuId] = useState<string>(SKU_MASTER_LIST[0].sku_id);
  const [leadTimeOverride, setLeadTimeOverride] = useState<number>(21);
  const [safetyBufferMultiplier, setSafetyBufferMultiplier] = useState<number>(1.2);

  const master = SKU_MASTER_LIST.find((s) => s.sku_id === selectedSkuId) || SKU_MASTER_LIST[0];
  const risk = RISK_ANALYSIS_DATA.find((r) => r.sku_id === selectedSkuId) || RISK_ANALYSIS_DATA[0];

  const chartSeries = generateWeeklyForecastSeries(selectedSkuId);
  const quadStyle = getQuadrantLabel(risk.quadrant);

  // Recalculate reorder point based on interactive sliders
  const adjustedLeadTime = leadTimeOverride;
  const avgDailyDemand = risk.avg_weekly_demand / 7 || 1;
  const adjustedSafetyStock = Math.round(avgDailyDemand * adjustedLeadTime * 0.3 * safetyBufferMultiplier);
  const adjustedReorderPoint = Math.round(avgDailyDemand * adjustedLeadTime + adjustedSafetyStock);
  const isReorderTriggered = (risk.on_hand_units + risk.on_order_units) <= adjustedReorderPoint;

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="bg-[#1E293B] rounded-xl p-6 border border-slate-700/50 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-700/50 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 rounded-full">
                SKU 360 Deep-Dive
              </span>
              <span className="text-xs text-slate-400">• Product Level Demand & Inventory Inspector</span>
            </div>
            <h2 className="text-xl font-bold text-slate-100 mt-1">
              {master.sku_id} – {master.sku_name}
            </h2>
          </div>

          <div className="w-full md:w-80">
            <select
              value={selectedSkuId}
              onChange={(e) => {
                setSelectedSkuId(e.target.value);
                const found = RISK_ANALYSIS_DATA.find((r) => r.sku_id === e.target.value);
                if (found) setLeadTimeOverride(found.lead_time_days);
              }}
              className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {SKU_MASTER_LIST.map((s) => (
                <option key={s.sku_id} value={s.sku_id}>
                  {s.sku_id} - {s.sku_name} ({s.category})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Top SKU Overview Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5">
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/40">
            <p className="text-[10px] uppercase font-bold text-slate-400">Category & Tier</p>
            <p className="text-sm font-bold text-slate-100 mt-1">{master.category}</p>
            <p className="text-xs text-indigo-400 font-semibold mt-0.5">Tier-{master.abc_classification} • {master.abc_velocity} Velocity</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/40">
            <p className="text-[10px] uppercase font-bold text-slate-400">Unit Price & Margin</p>
            <p className="text-sm font-bold text-slate-100 mt-1">{formatINR(master.list_price)}</p>
            <p className="text-xs text-emerald-400 font-semibold mt-0.5">{(master.margin_percentage * 100).toFixed(0)}% Profit Margin</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/40">
            <p className="text-[10px] uppercase font-bold text-slate-400">Current Stock Position</p>
            <p className="text-sm font-bold text-slate-100 mt-1">{risk.on_hand_units} Units On-Hand</p>
            <p className="text-xs text-slate-400 mt-0.5">{risk.on_order_units} Units On-Order</p>
          </div>

          <div className={`p-4 rounded-xl border ${quadStyle.badgeBg}`}>
            <p className="text-[10px] uppercase font-bold opacity-80">Risk Quadrant</p>
            <p className="text-sm font-bold mt-1">{quadStyle.label}</p>
            <p className="text-xs font-medium opacity-90 mt-0.5">{risk.recommended_action}</p>
          </div>
        </div>
      </div>

      {/* Demand Time Series & Forecast */}
      <div className="bg-[#1E293B] rounded-xl p-6 border border-slate-700/50 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-200 mb-1 flex items-center gap-2">
          <LineChartIcon className="w-4 h-4 text-indigo-400" />
          <span>24-Week Demand Profile: Historical Demand vs 8-Week Forecast Curve</span>
        </h3>
        <p className="text-xs text-slate-400 mb-4">Shaded band shows 80% prediction interval for future demand</p>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartSeries} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="week_start" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip formatter={(v: any) => [`${v} units`, 'Demand']} contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#F1F5F9' }} />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px', color: '#94a3b8' }} />

              <Area type="monotone" dataKey="upper_bound_80" stroke="none" fill="#818cf8" fillOpacity={0.25} name="Upper Bound (80%)" />
              <Area type="monotone" dataKey="lower_bound_80" stroke="none" fill="#1e293b" fillOpacity={1.0} name="Lower Bound (80%)" />

              <Line type="monotone" dataKey="actual_units" stroke="#f8fafc" strokeWidth={2.5} name="Actuals" dot={{ r: 3 }} />
              <Line type="monotone" dataKey="ml_forecast" stroke="#6366f1" strokeWidth={3} name="FORESIGHT ML Forecast" dot={{ r: 4 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Reorder Parameter What-If Calculator */}
      <div className="bg-[#1E293B] rounded-xl p-6 border border-slate-700/50 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-200 mb-1 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-indigo-400" />
          <span>Interactive Replenishment & Safety Stock Calculator</span>
        </h3>
        <p className="text-xs text-slate-400 mb-4">Simulate supplier delays and safety stock buffers to evaluate reorder point triggers</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-800/40 p-5 rounded-xl border border-slate-700/40">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-300">Supplier Lead Time (Days)</label>
              <span className="text-xs font-bold text-indigo-400">{leadTimeOverride} Days</span>
            </div>
            <input
              type="range"
              min="7"
              max="60"
              value={leadTimeOverride}
              onChange={(e) => setLeadTimeOverride(parseInt(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-300">Safety Stock Buffer Multiplier</label>
              <span className="text-xs font-bold text-indigo-400">{safetyBufferMultiplier.toFixed(1)}x Buffer</span>
            </div>
            <input
              type="range"
              min="0.8"
              max="2.0"
              step="0.1"
              value={safetyBufferMultiplier}
              onChange={(e) => setSafetyBufferMultiplier(parseFloat(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/40 text-xs">
            <span className="text-slate-400">Calculated Safety Stock:</span>
            <p className="font-bold text-slate-100 text-sm mt-0.5">{adjustedSafetyStock} Units</p>
          </div>

          <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/40 text-xs">
            <span className="text-slate-400">Calculated Reorder Point:</span>
            <p className="font-bold text-indigo-400 text-sm mt-0.5">{adjustedReorderPoint} Units</p>
          </div>

          <div className={`p-3 rounded-xl border text-xs ${isReorderTriggered ? 'bg-rose-500/10 border-rose-500/20 text-rose-300' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'}`}>
            <span className="opacity-80">Reorder Trigger Status:</span>
            <p className="font-bold text-sm mt-0.5">
              {isReorderTriggered ? '⚠️ REORDER TRIGGERED' : '✅ STOCK SUFFICIENT'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
