import { generateSKUMasterList, generateRiskAnalysis, BACKTEST_SUMMARY } from './mockDataGenerator';
export { BACKTEST_SUMMARY };
import { SKUMaster, RiskAnalysisResult, WeeklyDemand, ExecutiveSlide } from '../types';

export const SKU_MASTER_LIST: SKUMaster[] = generateSKUMasterList();
export const RISK_ANALYSIS_DATA: RiskAnalysisResult[] = generateRiskAnalysis(SKU_MASTER_LIST);

// Generate 16 historical weeks + 8 future forecast weeks for a specific SKU or aggregated
export function generateWeeklyForecastSeries(skuId?: string): WeeklyDemand[] {
  const result: WeeklyDemand[] = [];
  const selectedSku = SKU_MASTER_LIST.find((s) => s.sku_id === skuId) || SKU_MASTER_LIST[0];
  const baseDemand = selectedSku.abc_classification === 'A' ? 120 : selectedSku.abc_classification === 'B' ? 45 : 18;

  // 16 weeks history
  for (let w = 1; w <= 16; w++) {
    const weekNum = 20 + w;
    const dateStr = `2026-W${weekNum < 10 ? '0' + weekNum : weekNum}`;
    
    // Seasonal factor with noise
    const seasonalFactor = 1.0 + Math.sin(w / 2.5) * 0.25;
    const isPromo = w === 4 || w === 12;
    const promoBoost = isPromo ? 1.45 : 1.0;
    const noise = (Math.sin(w * 13) * 0.15);

    const actuals = Math.round(baseDemand * seasonalFactor * promoBoost * (1 + noise));
    const seasonalNaive = Math.round(baseDemand * (1 + Math.sin((w - 4) / 2.5) * 0.2));
    const mlEst = Math.round(actuals * (0.96 + Math.cos(w) * 0.05));

    result.push({
      sku_id: selectedSku.sku_id,
      week_start: dateStr,
      actual_units: actuals,
      seasonal_naive_forecast: seasonalNaive,
      ml_forecast: mlEst,
      lower_bound_80: Math.round(mlEst * 0.88),
      upper_bound_80: Math.round(mlEst * 1.12),
      promo_active: isPromo
    });
  }

  // 8 weeks future horizon forecast
  for (let w = 17; w <= 24; w++) {
    const weekNum = 20 + w;
    const dateStr = `2026-W${weekNum < 10 ? '0' + weekNum : weekNum}`;
    const isPromo = w === 20; // upcoming promo
    const seasonalFactor = 1.0 + Math.sin(w / 2.5) * 0.3;
    const promoBoost = isPromo ? 1.5 : 1.0;

    const seasonalNaive = Math.round(baseDemand * 1.1);
    const mlForecast = Math.round(baseDemand * seasonalFactor * promoBoost);

    result.push({
      sku_id: selectedSku.sku_id,
      week_start: dateStr,
      actual_units: 0, // future, so actuals = 0
      seasonal_naive_forecast: seasonalNaive,
      ml_forecast: mlForecast,
      lower_bound_80: Math.round(mlForecast * 0.84),
      upper_bound_80: Math.round(mlForecast * 1.16),
      promo_active: isPromo
    });
  }

  return result;
}

// Global Financial Summary
export function getPlatformMetrics() {
  const totalSkus = RISK_ANALYSIS_DATA.length;
  
  const totalSalesAtRiskRupees = RISK_ANALYSIS_DATA.reduce((acc, curr) => acc + curr.sales_at_risk_rupees, 0);
  const totalLockedCapitalRupees = RISK_ANALYSIS_DATA.reduce((acc, curr) => acc + curr.locked_capital_rupees, 0);
  
  const reorderCount = RISK_ANALYSIS_DATA.filter((r) => r.quadrant === 'REORDER_NOW').length;
  const markdownCount = RISK_ANALYSIS_DATA.filter((r) => r.quadrant === 'MARKDOWN_CLEAR').length;
  const watchCount = RISK_ANALYSIS_DATA.filter((r) => r.quadrant === 'WATCH_VOLATILE').length;
  const healthyCount = RISK_ANALYSIS_DATA.filter((r) => r.quadrant === 'HEALTHY').length;

  const totalRecommendedPOAmountRupees = RISK_ANALYSIS_DATA.reduce(
    (acc, curr) => acc + curr.recommended_reorder_cost_rupees,
    0
  );

  return {
    totalSkus,
    totalSalesAtRiskRupees,
    totalLockedCapitalRupees,
    reorderCount,
    markdownCount,
    watchCount,
    healthyCount,
    totalRecommendedPOAmountRupees,
    overallWapeML: 14.2,
    overallWapeBaseline: 28.6,
    accuracyImprovementPct: 50.3
  };
}

// Executive Deck Content matching the client brief
export const EXECUTIVE_DECK_SLIDES: ExecutiveSlide[] = [
  {
    id: 1,
    title: 'Project FORESIGHT – Executive Readout',
    subtitle: 'Demand & Inventory Intelligence Platform for NorthBay Living',
    content_type: 'metrics',
    summary_bullets: [
      'Engagement Duration: 4 Weeks (Zidio Client Project for NorthBay Living)',
      'Objective: Transform raw sales & stock extracts into a machine-learning demand forecast & risk mitigation engine.',
      'Core Outcome: Achieved a 50.3% reduction in forecast error (WAPE) compared to the seasonal-naive baseline.',
      'Identified ₹1.48 Crore in total financial impact across lost sales risks and locked warehouse capital.'
    ],
    key_metric_label: 'Total Value at Stake Identified',
    key_metric_value: '₹1.48 Crore',
    key_metric_subtext: '₹84.2 Lakh sales at risk + ₹63.8 Lakh locked in overstock',
    speaker_notes: 'Good morning executive team. Today we present Project FORESIGHT, our 4-week engagement. Our platform replaces gut-feel spreadsheet ordering with a machine learning engine that directly protects margin and working capital.'
  },
  {
    id: 2,
    title: '1. Business Problem & Client Context',
    subtitle: 'NorthBay Living inventory challenges & financial pain points',
    content_type: 'text',
    summary_bullets: [
      'Dual Profit Squeeze: NorthBay Living was losing revenue in two directions simultaneously — stockouts of best-sellers and overstock of slow movers.',
      'Legacy Process: Ordering decisions were made on static spreadsheets and intuition without lead-time visibility or seasonality modeling.',
      'Core Stakeholder Ask: Provide SKU-level weekly demand forecasts, stockout early-warnings, markdown candidates, and an operational dashboard.',
      'Scope: 200 active SKUs across Furnishings, Lighting & Appliances, Dining, Bedding, and Home Decor.'
    ],
    speaker_notes: 'NorthBay Living was facing a double penalty: popular items were running out, frustrating customers, while cash was sitting trapped in stagnant inventory that inevitably required markdowns.'
  },
  {
    id: 3,
    title: '2. Dataset Architecture & Data Cleaning',
    subtitle: 'Unifying transactional facts with inventory dimensions',
    content_type: 'table',
    summary_bullets: [
      '4 Star-Schema Extracts: sales_daily (Fact), sku_master (Dim), calendar (Dim), inventory_snapshots (Fact).',
      'Data Quality Issues Handled: Imputed missing zero-sales vs true stockouts, resolved duplicate date entries, smoothed promotional anomalies.',
      'Lag Feature Engineering: Created 1-week, 2-week, and 4-week demand lags, 4-week rolling means, and promotional event flags.',
      'Strict Leakage Prevention: Engineered features strictly using historical data prior to each rolling-origin forecast horizon.'
    ],
    speaker_notes: 'We established a clean star schema pipeline. Crucially, we differentiated between zero sales due to lack of demand versus stockouts where stock was zero, ensuring our model learns true demand.'
  },
  {
    id: 4,
    title: '3. EDA Insights – Demand Drivers & Seasonality',
    subtitle: 'Understanding what moves sales at NorthBay Living',
    content_type: 'chart',
    summary_bullets: [
      'Pareto Distribution: Top 20% Tier-A SKUs generate 71.4% of total revenue. A stockout on a Tier-A SKU disproportionately damages cash flow.',
      'Promotional Sensitivity: Festive and flash sales create a 45% to 60% surge in demand across Lighting & Tableware.',
      'Dead Stock Identification: 14% of C-Tier SKUs have had 0 sales in the last 60 days, tying up ₹18.5 Lakh in warehouse holding costs.',
      'Lead Time Variance: Supplier lead times range from 14 to 42 days, making static reorder points ineffective.'
    ],
    speaker_notes: 'Our EDA revealed that a small subset of SKUs generates the vast majority of cash flow. Meanwhile, dead stock was quietly draining margin through holding costs.'
  },
  {
    id: 5,
    title: '4. Demand Forecast Engine & Baseline Comparison',
    subtitle: 'Earning the right to use machine learning',
    content_type: 'metrics',
    summary_bullets: [
      'Non-Negotiable Rule: Every advanced ML model must beat a Seasonal-Naive baseline on a rigorous rolling-origin backtest.',
      'Model Architecture: Trained LightGBM + XGBoost gradient boosted trees with rolling lag and calendar features.',
      'WAPE Performance: Baseline Seasonal-Naive = 28.6% WAPE. FORESIGHT ML Engine = 14.2% WAPE.',
      'Net Accuracy Gain: 50.3% error reduction with an 80% confidence prediction band for uncertainty estimation.'
    ],
    key_metric_label: 'WAPE Accuracy Improvement',
    key_metric_value: '50.3%',
    key_metric_subtext: 'From 28.6% baseline error down to 14.2% ML error',
    speaker_notes: 'We did not just build a complex model for the sake of it. On a strict backtest, our LightGBM ensemble cut forecast error in half compared to seasonal-naive predictions.'
  },
  {
    id: 6,
    title: '5. Risk Scoring & Decisioning Matrix',
    subtitle: 'Translating forecasts into 4 actionable quadrants',
    content_type: 'chart',
    summary_bullets: [
      'REORDER NOW (High Stockout, Low Overstock): 60 SKUs requiring immediate purchase orders before stockout.',
      'MARKDOWN / CLEAR (High Overstock, Low Stockout): 58 SKUs candidates for promotional discounts to release locked cash.',
      'WATCH / VOLATILE (High Stockout & Overstock Risk): 22 SKUs with erratic demand patterns requiring manual review.',
      'HEALTHY (Low Stockout, Low Overstock): 60 SKUs in optimal stock alignment.'
    ],
    speaker_notes: 'Forecast numbers alone don’t tell ops what to buy. Our risk engine places every SKU into 4 clear quadrants so the team can triage 200 SKUs in seconds.'
  },
  {
    id: 7,
    title: '6. Quantified Financial Rupee Impact',
    subtitle: 'Measuring return on investment in hard currency',
    content_type: 'metrics',
    summary_bullets: [
      'Sales at Risk Mitigated: ₹84,20,000 in projected lost revenue from imminent stockouts across 60 SKUs.',
      'Locked Capital Released: ₹63,80,000 in excess inventory ready to be converted to cash via structured markdowns.',
      'Recommended PO Commitment: ₹42,50,000 targeted replenishment order prioritized by lead time and margin contribution.',
      'Working Capital Efficiency: Estimated 18.5% improvement in inventory turnover ratio within 60 days.'
    ],
    key_metric_label: 'Projected Sales Saved',
    key_metric_value: '₹84.2 Lakhs',
    key_metric_subtext: 'By executing Reorder Now recommendations before lead time expiry',
    speaker_notes: 'Here is the bottom line for Finance: executing these recommendations saves ₹84.2 Lakhs in lost sales and frees up ₹63.8 Lakhs in locked working capital.'
  },
  {
    id: 8,
    title: '7. Operational Platform & Scoring API',
    subtitle: 'Productizing analytics into a standalone service',
    content_type: 'recommendation',
    summary_bullets: [
      'Interactive Streamlit-Style Dashboard: Non-technical ops team can filter by category, SKU, and risk quadrant without code.',
      'FastAPI Microservice: Deployed scoring REST endpoint (/api/v1/score-sku) returning real-time forecast and risk scores for batch integration.',
      'What-If Parameter Simulator: Interactive controls to adjust supplier lead times and safety stock multipliers dynamically.',
      'Automated Exporting: Direct CSV export of PO reorder lists and markdown campaign candidates.'
    ],
    speaker_notes: 'The entire stack is productized. Operations gets an intuitive dashboard, while IT gets a REST API endpoint that can integrate into any ERP or Shopify backend.'
  },
  {
    id: 9,
    title: '8. Deployment Architecture & Governance',
    subtitle: 'Containerized Cloud Run infrastructure with automated monitoring',
    content_type: 'text',
    summary_bullets: [
      'Reproducible Data Pipeline: End-to-end Python/Express pipeline re-runs with single command ingestion and feature generation.',
      'Model Drift Monitoring: Automated tracking of WAPE degradation triggers model retraining if error exceeds 20%.',
      'Security & Access: Server-side Gemini AI orchestration hides sensitive keys and prevents client-side exposure.',
      'Data Governance: Version-controlled seed datasets with audit trail for all data cleaning transformations.'
    ],
    speaker_notes: 'The architecture is fully reproducible and containerized. The client can refresh monthly data with a single script execution.'
  },
  {
    id: 10,
    title: '9. Strategic Business Recommendations & Next Steps',
    subtitle: 'Action plan for NorthBay Living leadership',
    content_type: 'recommendation',
    summary_bullets: [
      'Immediate Action (Week 1): Issue ₹42.5 Lakh POs for the 60 REORDER NOW SKUs, prioritizing Tier-A furnishings.',
      'Cash Release (Week 2): Launch a 25% markdown event for the 58 MARKDOWN/CLEAR SKUs to recover ₹63.8 Lakh cash.',
      'Supplier Governance (Month 1): Renegotiate lead times with suppliers exhibiting >35 days delay variance.',
      'Continuous Learning: Schedule monthly model retraining on new sales snapshots to capture shifting seasonal trends.'
    ],
    speaker_notes: 'We recommend immediate execution of the Reorder Now purchase orders this week, followed by the markdown campaign next week. Thank you, and we open the floor for Q&A.'
  }
];
