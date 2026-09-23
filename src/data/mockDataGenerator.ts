import { SKUMaster, CategoryType, InventorySnapshot, RiskAnalysisResult, BacktestResult, WeeklyDemand } from '../types';

const CATEGORIES: CategoryType[] = [
  'Furnishings & Seating',
  'Lighting & Small Appliances',
  'Dining & Tableware',
  'Bedding & Bath',
  'Home Decor & Rugs'
];

const SUBCATEGORIES: Record<CategoryType, string[]> = {
  'Furnishings & Seating': ['Armchairs & Loungers', 'Dining Tables', 'Sofas & Couches', 'Study Desks', 'Accent Stools'],
  'Lighting & Small Appliances': ['Table Lamps', 'Pendant Lights', 'Coffee Makers', 'Air Purifiers', 'Standing Lamps'],
  'Dining & Tableware': ['Ceramic Dinnerware', 'Glassware Sets', 'Cutlery Collections', 'Serving Bowls', 'Table Runners'],
  'Bedding & Bath': ['Cotton Duvet Sets', 'Memory Foam Pillows', 'Bath Towel Bundles', 'Bed Sheets', 'Quilts'],
  'Home Decor & Rugs': ['Jute Area Rugs', 'Wall Mirrors', 'Ceramic Vases', 'Scented Candles', 'Canvas Wall Art']
};

const SKU_PREFIXES: Record<CategoryType, string> = {
  'Furnishings & Seating': 'FUR',
  'Lighting & Small Appliances': 'LGT',
  'Dining & Tableware': 'DNG',
  'Bedding & Bath': 'BED',
  'Home Decor & Rugs': 'DEC'
};

// Seedable pseudo-random generator
function seededRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export function generateSKUMasterList(): SKUMaster[] {
  const skus: SKUMaster[] = [];
  let idCounter = 1;

  CATEGORIES.forEach((cat) => {
    const subcats = SUBCATEGORIES[cat];
    const skuCountPerCat = 40; // Total 200 SKUs

    for (let i = 0; i < skuCountPerCat; i++) {
      const subcat = subcats[i % subcats.length];
      const prefix = SKU_PREFIXES[cat];
      const skuId = `${prefix}-${100 + idCounter}`;
      idCounter++;

      const seed = idCounter * 17;
      const r1 = seededRandom(seed);
      const r2 = seededRandom(seed + 1);

      // Price ranges based on category
      let listPrice = 0;
      if (cat === 'Furnishings & Seating') listPrice = Math.round((12000 + r1 * 48000) / 100) * 100;
      else if (cat === 'Lighting & Small Appliances') listPrice = Math.round((2500 + r1 * 15000) / 100) * 100;
      else if (cat === 'Dining & Tableware') listPrice = Math.round((1500 + r1 * 8000) / 100) * 100;
      else if (cat === 'Bedding & Bath') listPrice = Math.round((2000 + r1 * 10000) / 100) * 100;
      else listPrice = Math.round((1800 + r1 * 14000) / 100) * 100;

      const marginPct = Math.round((0.38 + r2 * 0.28) * 100) / 100; // 38% to 66% margin
      const unitCost = Math.round(listPrice * (1 - marginPct));

      // ABC classification distribution
      let abc: 'A' | 'B' | 'C' = 'C';
      if (i < 8) abc = 'A';       // Top 20%
      else if (i < 20) abc = 'B'; // Next 30%

      let velocity: 'Fast' | 'Medium' | 'Slow' | 'Dead' = 'Medium';
      if (abc === 'A') velocity = 'Fast';
      else if (i > 32) velocity = r2 > 0.4 ? 'Slow' : 'Dead';

      const skuName = `${subcat.slice(0, -1)} - Model ${String.fromCharCode(65 + (i % 26))}${i + 1}`;

      skus.push({
        sku_id: skuId,
        sku_name: skuName,
        category: cat,
        subcategory: subcat,
        launch_date: '2024-03-15',
        unit_cost: unitCost,
        list_price: listPrice,
        margin_percentage: marginPct,
        is_active: velocity !== 'Dead' || r1 > 0.3,
        abc_classification: abc,
        abc_velocity: velocity
      });
    }
  });

  return skus;
}

export function generateRiskAnalysis(skus: SKUMaster[]): RiskAnalysisResult[] {
  return skus.map((sku, index) => {
    const seed = index * 31 + 101;
    const r1 = seededRandom(seed);
    const r2 = seededRandom(seed + 1);
    const r3 = seededRandom(seed + 2);

    // Base demand per week based on ABC
    let baseWeeklyDemand = 10;
    if (sku.abc_classification === 'A') baseWeeklyDemand = 80 + Math.round(r1 * 120);
    else if (sku.abc_classification === 'B') baseWeeklyDemand = 25 + Math.round(r1 * 40);
    else baseWeeklyDemand = Math.max(1, Math.round(r1 * 15));

    const forecast6w = baseWeeklyDemand * 6;
    const leadTimeDays = Math.round(14 + r2 * 28); // 14 to 42 days lead time
    const safetyStock = Math.round(baseWeeklyDemand * (leadTimeDays / 7) * 0.4);
    const reorderPoint = Math.round(baseWeeklyDemand * (leadTimeDays / 7) + safetyStock);

    // Force varied quadrant scenarios for rich analytics display
    let onHandUnits = 0;
    let onOrderUnits = 0;

    // Distribute among quadrants deterministically for clean demo experience
    const quadSelector = index % 10;

    if (quadSelector < 3) {
      // Quadrant: REORDER_NOW (High Stockout Risk, Low Overstock)
      onHandUnits = Math.round(baseWeeklyDemand * (leadTimeDays / 7) * 0.25); // very low stock
      onOrderUnits = r3 > 0.5 ? Math.round(baseWeeklyDemand * 1) : 0;
    } else if (quadSelector < 6) {
      // Quadrant: MARKDOWN_CLEAR (High Overstock Risk, Low Stockout)
      onHandUnits = Math.round(forecast6w * 3.5 + 50); // huge excess
      onOrderUnits = 0;
    } else if (quadSelector < 7) {
      // Quadrant: WATCH_VOLATILE (High Stockout & High Overstock risk due to erratic surge)
      onHandUnits = Math.round(forecast6w * 0.9);
      onOrderUnits = Math.round(forecast6w * 1.2);
    } else {
      // Quadrant: HEALTHY
      onHandUnits = Math.round(reorderPoint * 1.5);
      onOrderUnits = Math.round(baseWeeklyDemand * 2);
    }

    const totalAvailable = onHandUnits + onOrderUnits;
    const daysOfSupply = Math.round((totalAvailable / (baseWeeklyDemand / 7 || 1)));
    const daysToStockout = Math.max(0, Math.round((onHandUnits / (baseWeeklyDemand / 7 || 1))));

    // Calculate Stockout Risk Score (0 to 1)
    let stockoutScore = 0;
    if (daysToStockout <= leadTimeDays) {
      stockoutScore = Math.min(1, Math.round((1 - daysToStockout / leadTimeDays) * 100) / 100);
    } else if (daysToStockout <= leadTimeDays * 1.5) {
      stockoutScore = 0.35;
    } else {
      stockoutScore = 0.05;
    }

    // Calculate Overstock Risk Score (0 to 1)
    let overstockScore = 0;
    const excessWeeks = (onHandUnits / (baseWeeklyDemand || 1)) - 6; // beyond 6 weeks horizon
    if (excessWeeks > 12) overstockScore = 0.95;
    else if (excessWeeks > 6) overstockScore = 0.75;
    else if (excessWeeks > 2) overstockScore = 0.45;
    else overstockScore = 0.1;

    // Determine Quadrant & Risk Level
    let quadrant: RiskAnalysisResult['quadrant'] = 'HEALTHY';
    let riskLevel: RiskAnalysisResult['risk_level'] = 'Healthy';
    let action = 'Maintain current stock monitoring';

    if (stockoutScore >= 0.5 && overstockScore >= 0.5) {
      quadrant = 'WATCH_VOLATILE';
      riskLevel = 'High';
      action = 'Investigate demand volatility; review forecast and buffer stock';
    } else if (stockoutScore >= 0.5) {
      quadrant = 'REORDER_NOW';
      riskLevel = 'High';
      action = `Urgent Reorder: Raise PO for ${Math.round(baseWeeklyDemand * 8)} units immediately`;
    } else if (overstockScore >= 0.5) {
      quadrant = 'MARKDOWN_CLEAR';
      riskLevel = 'Medium';
      action = `Promote / Markdown: Initiate 20-30% discount or bundle campaign`;
    } else {
      quadrant = 'HEALTHY';
      riskLevel = 'Healthy';
      action = 'Stock optimal. Scheduled for routine replenishment in 4 weeks';
    }

    // Rupees at stake
    let salesAtRisk = 0;
    if (stockoutScore >= 0.4) {
      const lostUnits = Math.max(0, Math.round(baseWeeklyDemand * 4 - totalAvailable));
      salesAtRisk = lostUnits * sku.list_price;
    }

    let lockedCapital = 0;
    if (overstockScore >= 0.4) {
      const excessUnits = Math.max(0, onHandUnits - Math.round(forecast6w));
      lockedCapital = excessUnits * sku.unit_cost;
    }

    const reorderUnits = quadrant === 'REORDER_NOW' || stockoutScore >= 0.4
      ? Math.round(reorderPoint * 2 - totalAvailable)
      : 0;

    return {
      sku_id: sku.sku_id,
      sku_name: sku.sku_name,
      category: sku.category,
      subcategory: sku.subcategory,
      unit_cost: sku.unit_cost,
      list_price: sku.list_price,
      on_hand_units: onHandUnits,
      on_order_units: onOrderUnits,
      lead_time_days: leadTimeDays,
      reorder_point: reorderPoint,
      safety_stock: safetyStock,
      forecast_demand_6w: forecast6w,
      avg_weekly_demand: baseWeeklyDemand,
      days_of_supply: daysOfSupply,
      days_to_stockout: daysToStockout,
      stockout_risk_score: stockoutScore,
      overstock_risk_score: overstockScore,
      risk_level: riskLevel,
      quadrant: quadrant,
      recommended_action: action,
      sales_at_risk_rupees: salesAtRisk,
      locked_capital_rupees: lockedCapital,
      recommended_reorder_units: Math.max(0, reorderUnits),
      recommended_reorder_cost_rupees: Math.max(0, reorderUnits * sku.unit_cost)
    };
  });
}

export const BACKTEST_SUMMARY: BacktestResult[] = [
  {
    category: 'All Categories',
    model_name: 'LightGBM + XGBoost Ensemble',
    wape: 14.2,
    mape: 16.5,
    bias: -0.8,
    rmse: 12.4,
    baseline_wape: 28.6,
    improvement_pct: 50.3
  },
  {
    category: 'Furnishings & Seating',
    model_name: 'LightGBM + XGBoost Ensemble',
    wape: 12.8,
    mape: 15.1,
    bias: -0.4,
    rmse: 18.2,
    baseline_wape: 26.4,
    improvement_pct: 51.5
  },
  {
    category: 'Lighting & Small Appliances',
    model_name: 'LightGBM + XGBoost Ensemble',
    wape: 15.4,
    mape: 18.2,
    bias: +1.1,
    rmse: 14.6,
    baseline_wape: 31.0,
    improvement_pct: 50.3
  },
  {
    category: 'Dining & Tableware',
    model_name: 'LightGBM + XGBoost Ensemble',
    wape: 13.9,
    mape: 16.0,
    bias: -0.5,
    rmse: 9.8,
    baseline_wape: 27.8,
    improvement_pct: 50.0
  },
  {
    category: 'Bedding & Bath',
    model_name: 'LightGBM + XGBoost Ensemble',
    wape: 14.1,
    mape: 16.4,
    bias: +0.2,
    rmse: 11.2,
    baseline_wape: 29.2,
    improvement_pct: 51.7
  },
  {
    category: 'Home Decor & Rugs',
    model_name: 'LightGBM + XGBoost Ensemble',
    wape: 15.1,
    mape: 17.8,
    bias: -1.4,
    rmse: 8.9,
    baseline_wape: 28.8,
    improvement_pct: 47.6
  }
];
