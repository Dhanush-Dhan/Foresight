import React, { useState } from 'react';
import {
  Boxes,
  AlertTriangle,
  Download,
  Search,
  Filter,
  DollarSign,
  ArrowRight,
  ShoppingCart,
  Tag,
  CheckCircle2
} from 'lucide-react';
import { RISK_ANALYSIS_DATA } from '../data/foresightData';
import { formatINR, filterRiskResults } from '../utils/riskScoringEngine';
import { CategoryType, QuadrantType } from '../types';

export const InventoryDashboardTab: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedQuadrant, setSelectedQuadrant] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeSubTab, setActiveSubTab] = useState<'reorder' | 'markdown'>('reorder');

  const filteredItems = filterRiskResults(
    RISK_ANALYSIS_DATA,
    selectedCategory,
    selectedQuadrant,
    searchQuery
  );

  const reorderList = filteredItems.filter((r) => r.quadrant === 'REORDER_NOW' || r.stockout_risk_score >= 0.4);
  const markdownList = filteredItems.filter((r) => r.quadrant === 'MARKDOWN_CLEAR' || r.overstock_risk_score >= 0.4);

  // CSV Export Handler
  const handleExportCSV = () => {
    const listToExport = activeSubTab === 'reorder' ? reorderList : markdownList;
    const headers = ['SKU_ID', 'SKU_Name', 'Category', 'On_Hand', 'Lead_Time_Days', 'Days_To_Stockout', 'Sales_At_Risk_INR', 'Recommended_Reorder_Units', 'Reorder_Cost_INR'];
    const rows = listToExport.map((item) => [
      item.sku_id,
      `"${item.sku_name}"`,
      item.category,
      item.on_hand_units,
      item.lead_time_days,
      item.days_to_stockout,
      item.sales_at_risk_rupees,
      item.recommended_reorder_units,
      item.recommended_reorder_cost_rupees
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `NorthBay_Living_${activeSubTab}_list.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="bg-[#1E293B] rounded-xl p-6 border border-slate-700/50 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-700/50 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 rounded-full">
                Deliverable D5 Planning Dashboard
              </span>
              <span className="text-xs text-slate-400">• Inventory Position & PO Trigger Engine</span>
            </div>
            <h2 className="text-xl font-bold text-slate-100 mt-1">
              Inventory & Reorder Planning Engine
            </h2>
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-semibold transition shadow-sm"
          >
            <Download className="w-4 h-4 text-slate-200" />
            <span>Export {activeSubTab === 'reorder' ? 'Reorder POs' : 'Markdown List'} (.CSV)</span>
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search SKU ID, Product Name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0F172A] border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Categories (200 SKUs)</option>
              <option value="Furnishings & Seating">Furnishings & Seating</option>
              <option value="Lighting & Small Appliances">Lighting & Small Appliances</option>
              <option value="Dining & Tableware">Dining & Tableware</option>
              <option value="Bedding & Bath">Bedding & Bath</option>
              <option value="Home Decor & Rugs">Home Decor & Rugs</option>
            </select>
          </div>

          {/* Quadrant Filter */}
          <div>
            <select
              value={selectedQuadrant}
              onChange={(e) => setSelectedQuadrant(e.target.value)}
              className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Risk Quadrants</option>
              <option value="REORDER_NOW">Reorder Now (Stockout Risk)</option>
              <option value="MARKDOWN_CLEAR">Markdown / Clear (Overstock Risk)</option>
              <option value="WATCH_VOLATILE">Watch / Volatile (Erratic)</option>
              <option value="HEALTHY">Healthy Stock</option>
            </select>
          </div>
        </div>

        {/* Sub-Tab Navigation: Reorder List vs Markdown List */}
        <div className="flex space-x-2 mt-6 border-b border-slate-700/50">
          <button
            onClick={() => setActiveSubTab('reorder')}
            className={`pb-3 text-xs font-bold flex items-center space-x-2 border-b-2 transition ${
              activeSubTab === 'reorder'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Urgent Reorder PO List ({reorderList.length} SKUs)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('markdown')}
            className={`pb-3 text-xs font-bold flex items-center space-x-2 border-b-2 transition ${
              activeSubTab === 'markdown'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Markdown Clearance List ({markdownList.length} SKUs)</span>
          </button>
        </div>
      </div>

      {/* Main Table Display */}
      {activeSubTab === 'reorder' ? (
        <div className="bg-[#1E293B] rounded-xl border border-slate-700/50 shadow-sm overflow-hidden">
          <div className="p-4 bg-rose-500/10 border-b border-rose-500/20 flex justify-between items-center text-xs">
            <span className="font-semibold text-rose-300">
              Showing {reorderList.length} Prioritized Replenishment Orders
            </span>
            <span className="font-bold text-rose-400">
              Total Recommended PO Value: {formatINR(reorderList.reduce((a, b) => a + b.recommended_reorder_cost_rupees, 0))}
            </span>
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
                  <th className="py-3 px-4 text-right">Suggested PO Qty</th>
                  <th className="py-3 px-4 text-right">PO Amount (₹)</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/30 text-slate-300">
                {reorderList.map((item) => (
                  <tr key={item.sku_id} className="hover:bg-slate-700/20 transition">
                    <td className="py-3 px-4 font-mono font-bold text-indigo-400">{item.sku_id}</td>
                    <td className="py-3 px-4 font-medium text-slate-200">{item.sku_name}</td>
                    <td className="py-3 px-4 text-slate-400">{item.category}</td>
                    <td className="py-3 px-4 text-center font-bold text-rose-400">{item.on_hand_units}</td>
                    <td className="py-3 px-4 text-center text-slate-400">{item.lead_time_days} days</td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-full font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        {item.days_to_stockout} days
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-rose-400">{formatINR(item.sales_at_risk_rupees)}</td>
                    <td className="py-3 px-4 text-right font-bold text-indigo-400">{item.recommended_reorder_units} units</td>
                    <td className="py-3 px-4 text-right font-bold text-indigo-300">{formatINR(item.recommended_reorder_cost_rupees)}</td>
                    <td className="py-3 px-4 text-center">
                      <button className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[10px] font-semibold transition">
                        Release PO
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-[#1E293B] rounded-xl border border-slate-700/50 shadow-sm overflow-hidden">
          <div className="p-4 bg-amber-500/10 border-b border-amber-500/20 flex justify-between items-center text-xs">
            <span className="font-semibold text-amber-300">
              Showing {markdownList.length} Overstocked & Stagnant SKUs
            </span>
            <span className="font-bold text-amber-400">
              Total Locked Capital to Release: {formatINR(markdownList.reduce((a, b) => a + b.locked_capital_rupees, 0))}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/50 text-slate-400 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-700/50">
                <tr>
                  <th className="py-3 px-4">SKU Code</th>
                  <th className="py-3 px-4">Product Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-center">On Hand</th>
                  <th className="py-3 px-4 text-center">Days of Supply</th>
                  <th className="py-3 px-4 text-right">Unit Cost</th>
                  <th className="py-3 px-4 text-right">Locked Capital (₹)</th>
                  <th className="py-3 px-4 text-center">Campaign</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/30 text-slate-300">
                {markdownList.map((item) => (
                  <tr key={item.sku_id} className="hover:bg-slate-700/20 transition">
                    <td className="py-3 px-4 font-mono font-bold text-indigo-400">{item.sku_id}</td>
                    <td className="py-3 px-4 font-medium text-slate-200">{item.sku_name}</td>
                    <td className="py-3 px-4 text-slate-400">{item.category}</td>
                    <td className="py-3 px-4 text-center font-bold text-slate-200">{item.on_hand_units}</td>
                    <td className="py-3 px-4 text-center font-bold text-amber-400">{item.days_of_supply} days</td>
                    <td className="py-3 px-4 text-right text-slate-400">{formatINR(item.unit_cost)}</td>
                    <td className="py-3 px-4 text-right font-bold text-amber-400">{formatINR(item.locked_capital_rupees)}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        25% Discount
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-[10px] font-semibold transition">
                        Push Promo
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
