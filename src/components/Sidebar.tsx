import React from 'react';
import {
  LayoutDashboard,
  BarChart3,
  LineChart,
  Boxes,
  Grid,
  Search,
  Presentation,
  Terminal,
  ChevronRight
} from 'lucide-react';
import { ActiveTab } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

interface NavItem {
  id: ActiveTab;
  label: string;
  badge?: string;
  badgeColor?: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const navItems: NavItem[] = [
    { id: 'overview', label: 'Executive Dashboard', icon: LayoutDashboard },
    { id: 'eda', label: 'Sales Analytics & EDA', icon: BarChart3, badge: 'Insights' },
    { id: 'forecast', label: 'Forecast & Backtest', icon: LineChart, badge: 'WAPE 14.2%' },
    { id: 'inventory', label: 'Inventory & Reorder', icon: Boxes, badge: 'Reorder' },
    { id: 'decisioning', label: 'Risk Matrix Grid', icon: Grid, badge: '4 Quadrants' },
    { id: 'product-details', label: 'SKU Deep-Dive', icon: Search },
    { id: 'executive-presentation', label: 'Executive Readout', icon: Presentation, badge: '10 Slides' },
    { id: 'api-service', label: 'Scoring Service API', icon: Terminal, badge: 'REST' }
  ];

  return (
    <aside className="w-full lg:w-64 bg-[#1E293B] border-r border-slate-700/50 text-slate-300 p-4 flex flex-col justify-between shrink-0">
      <div>
        <div className="px-3 py-2 text-[10px] font-bold text-slate-400 tracking-wider uppercase">
          Navigation
        </div>
        
        <nav className="mt-1 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition duration-150 ${
                  isActive
                    ? 'bg-indigo-500/10 text-indigo-400 font-semibold border border-indigo-500/30'
                    : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                      isActive
                        ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                        : 'bg-slate-800 text-slate-400 border border-slate-700/50'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Project Status Info Footer */}
      <div className="mt-8 pt-4 border-t border-slate-700/50 px-1">
        <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/40">
          <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1.5">Project Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <span className="text-xs font-semibold text-slate-200">Active Pipeline</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">NorthBay Living • 200 SKUs</p>
        </div>
      </div>
    </aside>
  );
};
