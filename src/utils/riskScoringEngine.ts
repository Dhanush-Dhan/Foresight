import { RiskAnalysisResult, QuadrantType, RiskLevel } from '../types';

export function formatINR(amount: number, compact: boolean = true): string {
  if (isNaN(amount) || amount === 0) return '₹0';

  if (!compact) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  }

  const absAmount = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';

  if (absAmount >= 10000000) {
    // 1 Crore = 10,000,000
    const cr = (absAmount / 10000000).toFixed(2);
    return `${sign}₹${cr} Cr`;
  } else if (absAmount >= 100000) {
    // 1 Lakh = 100,000
    const lakh = (absAmount / 100000).toFixed(2);
    return `${sign}₹${lakh} L`;
  } else if (absAmount >= 1000) {
    const k = (absAmount / 1000).toFixed(1);
    return `${sign}₹${k} K`;
  }

  return `${sign}₹${Math.round(absAmount)}`;
}

export function getQuadrantLabel(quadrant: QuadrantType): { label: string; bg: string; text: string; badgeBg: string; border: string } {
  switch (quadrant) {
    case 'REORDER_NOW':
      return {
        label: 'Reorder Now',
        bg: 'bg-rose-50 hover:bg-rose-100',
        text: 'text-rose-700',
        badgeBg: 'bg-rose-100 text-rose-800 border-rose-200',
        border: 'border-rose-300'
      };
    case 'MARKDOWN_CLEAR':
      return {
        label: 'Markdown / Clear',
        bg: 'bg-amber-50 hover:bg-amber-100',
        text: 'text-amber-800',
        badgeBg: 'bg-amber-100 text-amber-900 border-amber-200',
        border: 'border-amber-300'
      };
    case 'WATCH_VOLATILE':
      return {
        label: 'Watch / Volatile',
        bg: 'bg-purple-50 hover:bg-purple-100',
        text: 'text-purple-700',
        badgeBg: 'bg-purple-100 text-purple-800 border-purple-200',
        border: 'border-purple-300'
      };
    case 'HEALTHY':
    default:
      return {
        label: 'Healthy',
        bg: 'bg-emerald-50 hover:bg-emerald-100',
        text: 'text-emerald-700',
        badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        border: 'border-emerald-300'
      };
  }
}

export function getRiskLevelBadge(level: RiskLevel): string {
  switch (level) {
    case 'High':
      return 'bg-rose-100 text-rose-800 border-rose-300';
    case 'Medium':
      return 'bg-amber-100 text-amber-800 border-amber-300';
    case 'Low':
      return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'Healthy':
    default:
      return 'bg-emerald-100 text-emerald-800 border-emerald-300';
  }
}

export function filterRiskResults(
  data: RiskAnalysisResult[],
  categoryFilter: string,
  quadrantFilter: string,
  searchQuery: string
): RiskAnalysisResult[] {
  return data.filter((item) => {
    if (categoryFilter !== 'All' && item.category !== categoryFilter) return false;
    if (quadrantFilter !== 'All' && item.quadrant !== quadrantFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = item.sku_name.toLowerCase().includes(q);
      const matchId = item.sku_id.toLowerCase().includes(q);
      const matchSub = item.subcategory.toLowerCase().includes(q);
      if (!matchName && !matchId && !matchSub) return false;
    }
    return true;
  });
}
