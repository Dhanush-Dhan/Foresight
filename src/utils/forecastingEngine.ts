import { WeeklyDemand } from '../types';

export function calculateWAPE(actuals: number[], forecasts: number[]): number {
  if (actuals.length === 0 || actuals.length !== forecasts.length) return 0;
  
  let totalAbsError = 0;
  let totalActualDemand = 0;

  for (let i = 0; i < actuals.length; i++) {
    totalAbsError += Math.abs(actuals[i] - forecasts[i]);
    totalActualDemand += actuals[i];
  }

  if (totalActualDemand === 0) return 0;
  return Math.round((totalAbsError / totalActualDemand) * 1000) / 10; // Percentage with 1 decimal
}

export function calculateMAPE(actuals: number[], forecasts: number[]): number {
  if (actuals.length === 0 || actuals.length !== forecasts.length) return 0;

  let sumPercentageError = 0;
  let validCount = 0;

  for (let i = 0; i < actuals.length; i++) {
    if (actuals[i] > 0) {
      sumPercentageError += Math.abs(actuals[i] - forecasts[i]) / actuals[i];
      validCount++;
    }
  }

  if (validCount === 0) return 0;
  return Math.round((sumPercentageError / validCount) * 1000) / 10;
}

export function calculateBias(actuals: number[], forecasts: number[]): number {
  if (actuals.length === 0 || actuals.length !== forecasts.length) return 0;

  let totalError = 0;
  for (let i = 0; i < actuals.length; i++) {
    totalError += (forecasts[i] - actuals[i]);
  }

  return Math.round((totalError / actuals.length) * 10) / 10;
}

export function applyWhatIfSimulation(
  series: WeeklyDemand[],
  demandMultiplier: number, // e.g. 1.25 for +25% demand surge
  leadTimeMultiplier: number
): WeeklyDemand[] {
  return series.map((item) => {
    if (item.actual_units === 0) {
      // Future forecast
      const adjustedForecast = Math.round(item.ml_forecast * demandMultiplier);
      const spread = adjustedForecast * 0.15 * leadTimeMultiplier;

      return {
        ...item,
        ml_forecast: adjustedForecast,
        lower_bound_80: Math.max(0, Math.round(adjustedForecast - spread)),
        upper_bound_80: Math.round(adjustedForecast + spread)
      };
    }
    return item;
  });
}
