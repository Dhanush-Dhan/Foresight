/**
 * Project FORESIGHT - Data Types & Interfaces
 * Client: NorthBay Living (D2C Home & Lifestyle)
 */

export type CategoryType = 
  | 'Furnishings & Seating'
  | 'Lighting & Small Appliances'
  | 'Dining & Tableware'
  | 'Bedding & Bath'
  | 'Home Decor & Rugs';

export type RiskLevel = 'High' | 'Medium' | 'Low' | 'Healthy';

export type QuadrantType = 
  | 'REORDER_NOW'       // High stockout, Low overstock
  | 'MARKDOWN_CLEAR'     // High overstock, Low stockout
  | 'WATCH_VOLATILE'     // High stockout, High overstock (erratic demand)
  | 'HEALTHY';          // Low stockout, Low overstock

export interface SKUMaster {
  sku_id: string;
  sku_name: string;
  category: CategoryType;
  subcategory: string;
  launch_date: string;
  unit_cost: number;      // Cost price in INR (₹)
  list_price: number;     // Selling price in INR (₹)
  margin_percentage: number;
  is_active: boolean;
  abc_classification: 'A' | 'B' | 'C'; // Revenue tier
  abc_velocity: 'Fast' | 'Medium' | 'Slow' | 'Dead';
}

export interface DailySales {
  date: string;
  sku_id: string;
  units_sold: number;
  revenue: number;
  unit_price: number;
  promo_flag: number; // 0 or 1
  stockout_flag: number; // 1 if lost sales occurred due to 0 stock
}

export interface InventorySnapshot {
  snapshot_date: string;
  sku_id: string;
  on_hand_units: number;
  on_order_units: number;
  lead_time_days: number;
  reorder_point: number;
  safety_stock: number;
  holding_cost_per_unit_per_year: number;
}

export interface CalendarEvent {
  date: string;
  week: number;
  month: number;
  year: number;
  season: 'Spring' | 'Summer' | 'Festive/Autumn' | 'Winter';
  is_holiday: boolean;
  promo_event: string | null; // e.g. "Diwali Sale", "Festive Prep", "Summer Flash", "Cyber Week"
}

export interface WeeklyDemand {
  sku_id: string;
  week_start: string;
  actual_units: number;
  seasonal_naive_forecast: number;
  ml_forecast: number;
  lower_bound_80: number;
  upper_bound_80: number;
  promo_active: boolean;
}

export interface BacktestResult {
  category: CategoryType | 'All Categories';
  model_name: string;
  wape: number; // Weighted Absolute Percentage Error (%)
  mape: number; // Mean Absolute Percentage Error (%)
  bias: number; // Mean Signed Forecast Error
  rmse: number;
  baseline_wape: number;
  improvement_pct: number;
}

export interface RiskAnalysisResult {
  sku_id: string;
  sku_name: string;
  category: CategoryType;
  subcategory: string;
  unit_cost: number;
  list_price: number;
  on_hand_units: number;
  on_order_units: number;
  lead_time_days: number;
  reorder_point: number;
  safety_stock: number;
  
  // Forecast metrics over horizon (6 weeks)
  forecast_demand_6w: number;
  avg_weekly_demand: number;
  days_of_supply: number;
  days_to_stockout: number;
  
  // Risk scores (0 to 1.0)
  stockout_risk_score: number;
  overstock_risk_score: number;
  
  risk_level: RiskLevel;
  quadrant: QuadrantType;
  recommended_action: string;
  
  // Financial impact in INR ₹
  sales_at_risk_rupees: number;
  locked_capital_rupees: number;
  recommended_reorder_units: number;
  recommended_reorder_cost_rupees: number;
}

export interface ExecutiveSlide {
  id: number;
  title: string;
  subtitle: string;
  content_type: 'metrics' | 'chart' | 'text' | 'table' | 'recommendation';
  summary_bullets: string[];
  key_metric_label?: string;
  key_metric_value?: string;
  key_metric_subtext?: string;
  speaker_notes: string;
}

export type ActiveTab = 
  | 'overview'
  | 'eda'
  | 'forecast'
  | 'inventory'
  | 'decisioning'
  | 'product-details'
  | 'executive-presentation'
  | 'api-service';
