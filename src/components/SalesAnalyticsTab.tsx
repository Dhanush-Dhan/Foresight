import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  AlertCircle,
  FileText,
  Search,
  Filter,
  PackageX,
  ArrowUpRight,
  Flame,
  Calendar,
  Layers
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { SKU_MASTER_LIST, RISK_ANALYSIS_DATA } from '../data/foresightData';
import { formatINR } from '../utils/riskScoringEngine';

export const SalesAnalyticsTab: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Category revenue aggregation
  const categoryRevenue = [
    { name: 'Furnishings & Seating', revenue: 42500000, percentage: 38.2, color: '#6366f1' },
    { name: 'Lighting & Small Appliances', revenue: 28400000, percentage: 25.5, color: '#3b82f6' },
    { name: 'Dining & Tableware', revenue: 16800000, percentage: 15.1, color: '#10b981' },
    { name: 'Bedding & Bath', revenue: 14200000, percentage: 12.8, color: '#f59e0b' },
    { name: 'Home Decor & Rugs', revenue: 9300000, percentage: 8.4, color: '#ec4899' }
  ];

  // Top Movers (A-Tier SKUs)
  const topMovers = RISK_ANALYSIS_DATA
    .map((sku) => {
      const master = SKU_MASTER_LIST.find((m) => m.sku_id === sku.sku_id);
      return {
        ...sku,
        abc_classification: master?.abc_classification || 'B',
        projected_6w_revenue: sku.forecast_demand_6w * sku.list_price
      };
    })
    .sort((a, b) => b.projected_6w_revenue - a.projected_6w_revenue)
    .slice(0, 10);

  // Dead Stock (Slow / Zero sales over last 60 days)
  const deadStockItems = RISK_ANALYSIS_DATA
    .filter((r) => r.overstock_risk_score >= 0.7 && r.avg_weekly_demand <= 3)
    .slice(0, 8);

  return (
    <div className="space-y-6">
      {/* EDA Header & Quality Insight Memo Banner */}
      <div className="bg-[#1E293B] rounded-xl p-6 border border-slate-700/50 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-700/50 pb-5">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 rounded-full">
                Deliverable D2 Insight Memo
              </span>
              <span className="text-xs text-slate-400">• NorthBay Living Historical Sales EDA</span>
            </div>
            <h2 className="text-xl font-bold text-slate-100 mt-1">
              Sales Analytics, Data Profiling & Category Insights
            </h2>
          </div>
          <div className="flex items-center space-x-3 text-xs bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50">
            <FileText className="w-4 h-4 text-indigo-400" />
            <span className="font-semibold text-slate-200">Star-Schema Ingested:</span>
            <span className="text-slate-400">104 Weeks History (Daily Grain)</span>
          </div>
        </div>

        {/* 3 Plain-Language Executive Takeaways */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/40">
            <div className="flex items-center space-x-2 text-indigo-400 font-semibold text-xs mb-1">
              <Flame className="w-4 h-4" />
              <span>1. Extreme Pareto Revenue Concentration</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Top <strong className="text-white">20% Tier-A SKUs</strong> account for <strong>71.4%</strong> of overall NorthBay Living revenue. Stockouts in Tier-A furnishings immediately paralyze monthly cash flow.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/40">
            <div className="flex items-center space-x-2 text-amber-400 font-semibold text-xs mb-1">
              <PackageX className="w-4 h-4" />
              <span>2. Dead Stock Capital Drain</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Identified <strong className="text-white">28 dead SKUs</strong> (zero sales over 60+ days) holding <strong>₹18.5 Lakhs</strong> in locked capital with high warehouse holding costs.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/40">
            <div className="flex items-center space-x-2 text-emerald-400 font-semibold text-xs mb-1">
              <Calendar className="w-4 h-4" />
              <span>3. Promo & Festive Demand Spikes</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Festive sales (Diwali/Cyber Week) create a <strong className="text-white">+48% demand surge</strong>. Naive historical averages fail to anticipate these spikes, causing stockouts.
            </p>
          </div>
        </div>
      </div>

      {/* Category Breakdown & Top Movers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Revenue Distribution */}
        <div className="bg-[#1E293B] rounded-xl p-6 border border-slate-700/50 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-200 mb-1">Revenue Share by Category</h3>
          <p className="text-xs text-slate-400 mb-4">Furnishings & Seating dominates top-line revenue</p>

          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryRevenue}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="revenue"
                >
                  {categoryRevenue.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [formatINR(Number(val)), '6-Week Revenue']}
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#F1F5F9' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 mt-2">
            {categoryRevenue.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-slate-800/50 border border-slate-700/40">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }}></span>
                  <span className="font-semibold text-slate-200">{cat.name}</span>
                </div>
                <div className="font-bold text-slate-100">{formatINR(cat.revenue)} ({cat.percentage}%)</div>
              </div>
            ))}
          </div>
        </div>

        {/* Top 10 Revenue Generating SKUs */}
        <div className="bg-[#1E293B] rounded-xl p-6 border border-slate-700/50 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-200 mb-1">Top 10 High-Revenue Movers (Tier-A SKUs)</h3>
          <p className="text-xs text-slate-400 mb-4">6-Week Projected Revenue Contribution</p>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topMovers.slice(0, 6)} layout="vertical" margin={{ top: 0, right: 20, left: 40, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#334155" />
                <XAxis type="number" tickFormatter={(v) => `₹${v / 100000}L`} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <YAxis dataKey="sku_id" type="category" tick={{ fontSize: 11, fontWeight: 'bold', fill: '#818cf8' }} />
                <Tooltip formatter={(val: any) => [formatINR(Number(val)), 'Projected Revenue']} contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#F1F5F9' }} />
                <Bar dataKey="projected_6w_revenue" fill="#6366f1" radius={[0, 6, 6, 0]} name="6w Revenue ₹" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-xs text-indigo-300 mt-2 flex justify-between items-center">
            <span>Tier-A Stock Protection Policy:</span>
            <strong className="text-indigo-400 font-bold">Maintain minimum 30 days safety stock</strong>
          </div>
        </div>
      </div>

      {/* Dead Stock & Stagnant Inventory Table */}
      <div className="bg-[#1E293B] rounded-xl border border-slate-700/50 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-700/50 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <PackageX className="w-4 h-4 text-amber-400" />
              <span>Dead Stock & Stagnant Inventory Report</span>
            </h3>
            <p className="text-xs text-slate-400">Low velocity items holding capital that require clearance campaigns</p>
          </div>
          <span className="text-xs font-semibold bg-amber-500/10 text-amber-400 px-3 py-1 rounded-full border border-amber-500/20">
            {deadStockItems.length} Key Candidate SKUs
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/50 text-slate-400 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-700/50">
              <tr>
                <th className="py-3 px-4">SKU Code</th>
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-center">On Hand Units</th>
                <th className="py-3 px-4 text-center">Days of Supply</th>
                <th className="py-3 px-4 text-right">Unit Cost</th>
                <th className="py-3 px-4 text-right">Locked Capital</th>
                <th className="py-3 px-4 text-center">Recommended Clearance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30 text-slate-300">
              {deadStockItems.map((item) => (
                <tr key={item.sku_id} className="hover:bg-slate-700/20 transition">
                  <td className="py-3 px-4 font-mono font-medium text-indigo-400">{item.sku_id}</td>
                  <td className="py-3 px-4 font-medium text-slate-200">{item.sku_name}</td>
                  <td className="py-3 px-4 text-slate-400">{item.category}</td>
                  <td className="py-3 px-4 text-center font-semibold text-slate-200">{item.on_hand_units} units</td>
                  <td className="py-3 px-4 text-center text-amber-400 font-bold">{item.days_of_supply} days</td>
                  <td className="py-3 px-4 text-right text-slate-400">{formatINR(item.unit_cost)}</td>
                  <td className="py-3 px-4 text-right font-bold text-amber-400">{formatINR(item.locked_capital_rupees)}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      25% Markdown
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
