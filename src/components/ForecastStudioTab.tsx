import React, { useState } from 'react';
import {
  LineChart as LineChartIcon,
  ShieldCheck,
  TrendingUp,
  Sliders,
  CheckCircle2,
  HelpCircle,
  BarChart,
  RefreshCw,
  Sparkles
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
import { SKU_MASTER_LIST, BACKTEST_SUMMARY, generateWeeklyForecastSeries } from '../data/foresightData';
import { applyWhatIfSimulation } from '../utils/forecastingEngine';

export const ForecastStudioTab: React.FC = () => {
  const [selectedSkuId, setSelectedSkuId] = useState<string>(SKU_MASTER_LIST[0].sku_id);
  const [demandSurge, setDemandSurge] = useState<number>(1.0); // 1.0 = normal, 1.25 = +25%
  const [leadTimeFactor, setLeadTimeFactor] = useState<number>(1.0);

  const selectedSku = SKU_MASTER_LIST.find((s) => s.sku_id === selectedSkuId) || SKU_MASTER_LIST[0];
  const rawSeries = generateWeeklyForecastSeries(selectedSkuId);
  const chartData = applyWhatIfSimulation(rawSeries, demandSurge, leadTimeFactor);

  return (
    <div className="space-y-6">
      {/* Top Banner & Model Validation Card */}
      <div className="bg-[#1E293B] rounded-xl p-6 border border-slate-700/50 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-700/50 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/30">
                Deliverable D3 Model Engine
              </span>
              <span className="text-xs text-slate-400">• Rolling-Origin Cross Validation</span>
            </div>
            <h2 className="text-xl font-bold text-slate-100 mt-1">
              Demand Forecast Engine & Rolling-Origin Backtest
            </h2>
          </div>

          <div className="flex items-center space-x-3 bg-emerald-500/10 border border-emerald-500/30 px-4 py-2.5 rounded-xl text-xs text-emerald-300">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <p className="font-bold">ML Model Beats Baseline by 50.3%</p>
              <p className="text-[11px] text-emerald-400/80">FORESIGHT WAPE 14.2% vs Seasonal-Naive 28.6%</p>
            </div>
          </div>
        </div>

        {/* Controls Bar: SKU Picker + What-If Sliders */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-800/50 p-4 rounded-xl border border-slate-700/40">
          {/* SKU Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Select SKU for Demand Analysis
            </label>
            <select
              value={selectedSkuId}
              onChange={(e) => setSelectedSkuId(e.target.value)}
              className="w-full bg-[#0F172A] border border-slate-700 rounded-lg px-3 py-2 text-xs font-medium text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              {SKU_MASTER_LIST.slice(0, 30).map((sku) => (
                <option key={sku.sku_id} value={sku.sku_id}>
                  {sku.sku_id} - {sku.sku_name} ({sku.category})
                </option>
              ))}
            </select>
          </div>

          {/* Demand Surge Slider */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-300">
                What-If: Promo/Demand Surge
              </label>
              <span className="text-xs font-bold text-indigo-400">
                +{Math.round((demandSurge - 1.0) * 100)}% Surge
              </span>
            </div>
            <input
              type="range"
              min="1.0"
              max="1.5"
              step="0.05"
              value={demandSurge}
              onChange={(e) => setDemandSurge(parseFloat(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>

          {/* Lead Time / Uncertainty Multiplier */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-300">
                Uncertainty Spread Factor
              </label>
              <span className="text-xs font-bold text-indigo-400">
                {leadTimeFactor.toFixed(1)}x Band
              </span>
            </div>
            <input
              type="range"
              min="0.8"
              max="1.8"
              step="0.1"
              value={leadTimeFactor}
              onChange={(e) => setLeadTimeFactor(parseFloat(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Primary Forecast Time Series Chart */}
      <div className="bg-[#1E293B] rounded-xl p-6 border border-slate-700/50 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
          <div>
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <LineChartIcon className="w-4 h-4 text-indigo-400" />
              <span>
                Weekly SKU Demand: Actual History, Seasonal-Naive Baseline, & FORESIGHT Forecast
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Showing 16 historical weeks (2026-W21 to W36) + 8-week future forecast horizon (W37 to W44)
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <span className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded-lg font-medium border border-slate-700/50">
              Category: {selectedSku.category}
            </span>
            <span className="px-2.5 py-1 bg-indigo-500/10 text-indigo-400 rounded-lg font-medium border border-indigo-500/30">
              Tier-{selectedSku.abc_classification} Velocity
            </span>
          </div>
        </div>

        {/* Recharts Composed Forecast Plot */}
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="week_start" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} label={{ value: 'Units / Week', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: '11px', fill: '#94a3b8' } }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#F1F5F9' }}
                formatter={(val: any, name: string) => {
                  if (val === 0 && name === 'Actual Demand') return ['Future Horizon', 'Actuals'];
                  return [`${val} units`, name];
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px', color: '#94a3b8' }} />

              {/* 80% Confidence Interval Shaded Band */}
              <Area
                type="monotone"
                dataKey="upper_bound_80"
                stroke="none"
                fill="#818cf8"
                fillOpacity={0.25}
                name="80% Prediction Upper Bound"
              />
              <Area
                type="monotone"
                dataKey="lower_bound_80"
                stroke="none"
                fill="#1e293b"
                fillOpacity={1.0}
                name="80% Prediction Lower Bound"
              />

              {/* Actual Historical Demand */}
              <Line
                type="monotone"
                dataKey="actual_units"
                stroke="#f8fafc"
                strokeWidth={2.5}
                dot={{ r: 3, fill: '#f8fafc' }}
                name="Actual Demand (History)"
              />

              {/* Seasonal Naive Baseline */}
              <Line
                type="monotone"
                dataKey="seasonal_naive_forecast"
                stroke="#64748b"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={false}
                name="Seasonal-Naive Baseline"
              />

              {/* FORESIGHT ML Forecast */}
              <Line
                type="monotone"
                dataKey="ml_forecast"
                stroke="#6366f1"
                strokeWidth={3}
                dot={{ r: 4, fill: '#6366f1' }}
                name="FORESIGHT ML Forecast"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-indigo-500/10 p-3 rounded-xl border border-indigo-500/20">
          <div>
            <span className="text-slate-400">6-Week Cumulative ML Forecast:</span>
            <p className="font-bold text-slate-100 text-sm">{chartData.filter(d=>d.actual_units===0).reduce((a,b)=>a+b.ml_forecast,0)} Units</p>
          </div>
          <div>
            <span className="text-slate-400">Peak Demand Week:</span>
            <p className="font-bold text-indigo-400 text-sm">2026-W40 (Festive Surge)</p>
          </div>
          <div>
            <span className="text-slate-400">Model Confidence Band:</span>
            <p className="font-bold text-slate-100 text-sm">±14% Margin at 80% Interval</p>
          </div>
        </div>
      </div>

      {/* Backtest Evaluation Table */}
      <div className="bg-[#1E293B] rounded-xl border border-slate-700/50 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-700/50">
          <h3 className="text-sm font-semibold text-slate-200">
            Rolling-Origin Backtest Performance (WAPE & MAPE vs Baseline)
          </h3>
          <p className="text-xs text-slate-400">
            Evaluated on 12-week backtest folds using LightGBM + XGBoost Ensemble without future data leakage
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/50 text-slate-400 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-700/50">
              <tr>
                <th className="py-3 px-4">Category Grain</th>
                <th className="py-3 px-4">Model Architecture</th>
                <th className="py-3 px-4 text-center">Baseline WAPE</th>
                <th className="py-3 px-4 text-center">ML Model WAPE</th>
                <th className="py-3 px-4 text-center">MAPE (%)</th>
                <th className="py-3 px-4 text-center">Bias</th>
                <th className="py-3 px-4 text-right">WAPE Improvement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30 text-slate-300">
              {BACKTEST_SUMMARY.map((row, idx) => (
                <tr key={idx} className={row.category === 'All Categories' ? 'bg-indigo-500/10 font-semibold' : 'hover:bg-slate-700/20'}>
                  <td className="py-3 px-4 font-medium text-slate-100">{row.category}</td>
                  <td className="py-3 px-4 text-slate-400">{row.model_name}</td>
                  <td className="py-3 px-4 text-center text-slate-400 font-medium">{row.baseline_wape}%</td>
                  <td className="py-3 px-4 text-center font-bold text-indigo-400">{row.wape}%</td>
                  <td className="py-3 px-4 text-center text-slate-300">{row.mape}%</td>
                  <td className="py-3 px-4 text-center text-slate-400">{row.bias > 0 ? `+${row.bias}` : row.bias}</td>
                  <td className="py-3 px-4 text-right">
                    <span className="px-2.5 py-1 rounded-full font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      +{row.improvement_pct}%
                    </span>
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
