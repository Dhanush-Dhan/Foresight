import React, { useState } from 'react';
import { ActiveTab } from './types';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { OverviewTab } from './components/OverviewTab';
import { SalesAnalyticsTab } from './components/SalesAnalyticsTab';
import { ForecastStudioTab } from './components/ForecastStudioTab';
import { InventoryDashboardTab } from './components/InventoryDashboardTab';
import { DecisioningGridTab } from './components/DecisioningGridTab';
import { ProductDetailsTab } from './components/ProductDetailsTab';
import { ExecutivePresentationTab } from './components/ExecutivePresentationTab';
import { ScoringServiceApiTab } from './components/ScoringServiceApiTab';
import { AiCopilotModal } from './components/AiCopilotModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-200 font-sans flex flex-col antialiased">
      {/* Top Navigation Header */}
      <Header onOpenAiCopilot={() => setIsAiModalOpen(true)} />

      {/* Main Layout Body */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col lg:flex-row">
        {/* Streamlit-Style Sidebar Navigation */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Dynamic Main Workspace Tab View */}
        <main className="flex-1 p-4 sm:p-6 overflow-x-hidden">
          {activeTab === 'overview' && (
            <OverviewTab onNavigate={(tab) => setActiveTab(tab)} />
          )}
          {activeTab === 'eda' && <SalesAnalyticsTab />}
          {activeTab === 'forecast' && <ForecastStudioTab />}
          {activeTab === 'inventory' && <InventoryDashboardTab />}
          {activeTab === 'decisioning' && <DecisioningGridTab />}
          {activeTab === 'product-details' && <ProductDetailsTab />}
          {activeTab === 'executive-presentation' && <ExecutivePresentationTab />}
          {activeTab === 'api-service' && <ScoringServiceApiTab />}
        </main>
      </div>

      {/* AI Co-Pilot Modal Drawer */}
      <AiCopilotModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />
    </div>
  );
}
