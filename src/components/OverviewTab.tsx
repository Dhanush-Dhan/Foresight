import React from 'react';
import {
  AlertTriangle,
  Package,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  Boxes,
  CheckCircle2,
  DollarSign,
  PieChart as PieIcon,
  RefreshCcw
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend
} from 'recharts';
import { getPlatformMetrics, RISK_ANALYSIS_DATA } from '../data/foresightData';
import { formatINR, getQuadrantLabel } from '../utils/riskScoringEngine';
import { ActiveTab } from '../types';

interface OverviewTabProps {
  onNavigate: (tab: ActiveTab) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ onNavigate }) => {
  const metrics = getPlatformMetrics();

  const quadrantData = [
    { name: 'Reorder Now', value: metrics.reorderCount, color: '#f43f5e', sub: 'High Stockout Risk' },
    { name: 'Markdown / Clear', value: metrics.markdownCount, color: '#f59e0b', sub: 'High Overstock Risk' },
    { name: 'Watch / Volatile', value: metrics.watchCount, color: '#a855f7', sub: 'Erratic Demand' },
    { name: 'Healthy Stock', value: metrics.healthyCount, color: '#10b981', sub: 'Optimal Balance' }
  ];

  const wapeComparisonData = [
    { category: 'Furnishings', Baseline: 26.4, FORESIGHT_ML: 12.8 },
    { category: 'Lighting', Baseline: 31.0, FORESIGHT_ML: 15.4 },
    { category: 'Dining', Baseline: 27.8, FORESIGHT_ML: 13.9 },
    { category: 'Bedding', Baseline: 29.2, FORESIGHT_ML: 14.1 },
    { category: 'Home Decor', Baseline: 28.8, FORESIGHT_ML: 15.1 }
  ];

  const urgentReorders = RISK_ANALYSIS_DATA.filter((r) => r.quadrant === 'REORDER_NOW')
    .sort((a, b) => b.sales_at_risk_rupees - a.sales_at_risk_rupees)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Top Banner Context */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white border border-indigo-900/50 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 text-[11px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full uppercase tracking-wider">
                Project FORESIGHT Overview
              </span>
              <span className="text-xs text-slate-400">• NorthBay Living Demand Intelligence</span>
            </div>
            <h2 className="text-2xl font-bold mt-2 tracking-tight text-white">
              Executive Inventory & Demand Intelligence Dashboard
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Real-time risk scoring, 6-week SKU forecasting, and financial impact quantification for 200 active SKUs. Machine learning forecast achieves <strong className="text-emerald-400 font-semibold">14.2% WAPE</strong> compared to 28.6% seasonal-naive baseline.
            </p>
          </div>

          <button
            onClick={() => onNavigate('decisioning')}
            className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl text-xs font-semibold transition duration-150 shadow-lg shadow-indigo-600/30 shrink-0"
          >
            <span>Explore 4-Quadrant Matrix</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4 Core Financial & Model KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#1E293B] rounded-xl p-5 border border-slate-700/50 shadow-sm transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Sales at Risk</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-rose-400">{formatINR(metrics.totalSalesAtRiskRupees)}</h3>
            <p className="text-xs text-rose-300 font-medium mt-1 flex items-center gap-1">
              <span>{metrics.reorderCount} SKUs facing imminent stockouts</span>
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-700/50 flex justify-between text-[11px] text-slate-400">
            <span>Lead Time Window</span>
            <span className="font-semibold text-slate-200">6 Weeks Horizon</span>
          </div>
        </div>

        <div className="bg-[#1E293B] rounded-xl p-5 border border-slate-700/50 shadow-sm transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Locked Capital</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-amber-400">{formatINR(metrics.totalLockedCapitalRupees)}</h3>
            <p className="text-xs text-amber-300 font-medium mt-1 flex items-center gap-1">
              <span>{metrics.markdownCount} SKUs overstocked & stagnant</span>
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-700/50 flex justify-between text-[11px] text-slate-400">
            <span>Action Required</span>
            <span className="font-semibold text-slate-200">Markdown / Bundling</span>
          </div>
        </div>

        <div className="bg-[#1E293B] rounded-xl p-5 border border-slate-700/50 shadow-sm transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Forecast Accuracy</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-emerald-400">{metrics.overallWapeML}% WAPE</h3>
            <p className="text-xs text-emerald-300 font-medium mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{metrics.accuracyImprovementPct}% error reduction vs baseline</span>
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-700/50 flex justify-between text-[11px] text-slate-400">
            <span>Seasonal Naive Error</span>
            <span className="font-semibold text-slate-200">28.6% WAPE</span>
          </div>
        </div>

        <div className="bg-[#1E293B] rounded-xl p-5 border border-slate-700/50 shadow-sm transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Recommended POs</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-indigo-400">{formatINR(metrics.totalRecommendedPOAmountRupees)}</h3>
            <p className="text-xs text-indigo-300 font-medium mt-1">
              Purchase orders ready for release
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-700/50 flex justify-between text-[11px] text-slate-400">
            <span>Healthy SKUs</span>
            <span className="font-semibold text-emerald-400">{metrics.healthyCount} SKUs (30%)</span>
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quadrant Distribution Donut */}
        <div className="bg-[#1E293B] rounded-xl p-6 border border-slate-700/50 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-200">Inventory Risk Distribution</h3>
              <p className="text-xs text-slate-400">200 SKUs categorized into 4 operational quadrants</p>
            </div>
            <button
              onClick={() => onNavigate('decisioning')}
              className="text-xs text-indigo-400 font-semibold hover:underline flex items-center gap-1"
            >
              <span>View Matrix</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={quadrantData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {quadrantData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [`${val} SKUs`, 'Count']}
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#F1F5F9' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
            {quadrantData.map((q) => (
              <div key={q.name} className="flex items-center space-x-2.5 p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/40">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: q.color }}></span>
                <div className="truncate">
                  <p className="font-semibold text-slate-200">{q.name}</p>
                  <p className="text-[10px] text-slate-400">{q.value} SKUs ({Math.round((q.value / 200) * 100)}%)</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Forecast Accuracy WAPE vs Seasonal-Naive Baseline */}
        <div className="bg-[#1E293B] rounded-xl p-6 border border-slate-700/50 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-200">Model Error (WAPE %) by Category</h3>
              <p className="text-xs text-slate-400">Comparing Seasonal-Naive Baseline vs FORESIGHT ML Model</p>
            </div>
            <button
              onClick={() => onNavigate('forecast')}
              className="text-xs text-indigo-400 font-semibold hover:underline flex items-center gap-1"
            >
              <span>Backtest Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={wapeComparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                <XAxis dataKey="category" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis unit="%" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip formatter={(val: any) => [`${val}%`, 'WAPE Error']} contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#F1F5F9' }} />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px', color: '#94a3b8' }} />
                <Bar dataKey="Baseline" fill="#64748b" name="Seasonal-Naive Baseline (WAPE)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="FORESIGHT_ML" fill="#6366f1" name="FORESIGHT ML Model (WAPE)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-xs text-indigo-300 flex items-center justify-between">
            <span className="font-medium">Average Error Reduction Across All Categories:</span>
            <strong className="text-indigo-400 text-sm font-bold">50.3% Error Reduction</strong>
          </div>
        </div>
      </div>

      {/* Top Urgent Reorder Action Table */}
      <div className="bg-[#1E293B] rounded-xl border border-slate-700/50 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-700/50 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>Top Urgent Reorder Priorities (High Stockout Risk)</span>
            </h3>
            <p className="text-xs text-slate-400">Items projected to run out before lead time arrival</p>
          </div>
          <button
            onClick={() => onNavigate('inventory')}
            className="text-xs bg-indigo-500/10 text-indigo-400 font-semibold px-3 py-1.5 rounded-lg border border-indigo-500/30 hover:bg-indigo-500/20 transition"
          >
            View Full Reorder List
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/50 text-slate-400 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-700/50">
              <tr>
                <th className="py-3 px-4">SKU Code</th>
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-center">On Hand</th>
                <th className="py-3 px-4 text-center">Lead Time</th>
                <th className="py-3 px-4 text-center">Days to Stockout</th>
                <th className="py-3 px-4 text-right">Sales at Risk</th>
                <th className="py-3 px-4 text-right">Recommended PO</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30 text-slate-300">
              {urgentReorders.map((item) => (
                <tr key={item.sku_id} className="hover:bg-slate-700/20 transition">
                  <td className="py-3 px-4 font-mono font-medium text-indigo-400">{item.sku_id}</td>
                  <td className="py-3 px-4 font-medium text-slate-200">{item.sku_name}</td>
                  <td className="py-3 px-4 text-slate-400">{item.category}</td>
                  <td className="py-3 px-4 text-center font-semibold text-rose-400">{item.on_hand_units} units</td>
                  <td className="py-3 px-4 text-center text-slate-400">{item.lead_time_days} days</td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 rounded-full font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                      {item.days_to_stockout} days
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-rose-400">{formatINR(item.sales_at_risk_rupees)}</td>
                  <td className="py-3 px-4 text-right font-bold text-indigo-400">
                    {item.recommended_reorder_units} units ({formatINR(item.recommended_reorder_cost_rupees)})
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
