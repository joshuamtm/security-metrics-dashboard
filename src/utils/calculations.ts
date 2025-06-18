import { Metric, MetricStatus, MetricSummary } from '../types/metrics';

export function parseTargetValue(target: string): number | null {
  if (!target) return null;
  
  const cleanTarget = target.replace(/[%+]/g, '').trim();
  const value = parseFloat(cleanTarget);
  
  return isNaN(value) ? null : value;
}

export function parseMetricValue(value: string | number | null | undefined): number | null {
  if (value === null || value === undefined || value === 'Unknown' || value === '') {
    return null;
  }
  
  if (typeof value === 'number') {
    // If it's a number between 0 and 1, likely a decimal percentage, convert to percentage
    if (value > 0 && value < 1) {
      return value * 100;
    }
    return value;
  }
  
  const cleanValue = value.toString().replace('%', '').trim();
  const numValue = parseFloat(cleanValue);
  
  if (isNaN(numValue)) {
    return null;
  }
  
  // If it's a decimal between 0 and 1, convert to percentage
  if (numValue > 0 && numValue < 1) {
    return numValue * 100;
  }
  
  return numValue;
}

export function calculateStatus(currentValue: number | null, targetValue: number | null, isDecreasing: boolean = false): MetricStatus {
  if (currentValue === null || targetValue === null) {
    return 'unknown';
  }
  
  const percentage = isDecreasing 
    ? (targetValue / currentValue) * 100 
    : (currentValue / targetValue) * 100;
  
  if (percentage >= 100) return 'on-track';
  if (percentage >= 80) return 'at-risk';
  return 'off-track';
}

export function calculateTrend(currentValue: number | null, previousValue: number | null): 'up' | 'down' | 'stable' | 'unknown' {
  if (currentValue === null || previousValue === null) {
    return 'unknown';
  }
  
  const diff = currentValue - previousValue;
  if (Math.abs(diff) < 0.5) return 'stable';
  return diff > 0 ? 'up' : 'down';
}

export function calculateTrendPercentage(currentValue: number | null, previousValue: number | null): number | null {
  if (currentValue === null || previousValue === null || previousValue === 0) {
    return null;
  }
  
  return ((currentValue - previousValue) / previousValue) * 100;
}

export function getMetricSummary(metric: Metric): MetricSummary {
  const sortedData = [...metric.data].sort((a, b) => {
    const dateA = new Date(a.month);
    const dateB = new Date(b.month);
    return dateB.getTime() - dateA.getTime();
  });
  
  const currentValue = sortedData[0]?.value ?? null;
  const previousValue = sortedData[1]?.value ?? null;
  const targetValue = parseTargetValue(metric.target);
  
  // Check if metric name suggests it should decrease (e.g., contains words like 'risk', 'incidents', 'vulnerabilities')
  const isDecreasing = /\b(risk|incident|vulnerabilit|threat|breach|attack|error|failure|downtime|exposure|defect|issue|problem)\b/i.test(metric.metric);
  
  return {
    metric: metric.metric,
    currentValue,
    previousValue,
    target: metric.target,
    targetValue,
    status: calculateStatus(currentValue, targetValue, isDecreasing),
    trend: calculateTrend(currentValue, previousValue),
    trendPercentage: calculateTrendPercentage(currentValue, previousValue)
  };
}

export function calculateOverallScore(metrics: Metric[]): number | null {
  const summaries = metrics.map(getMetricSummary);
  const validScores = summaries
    .filter(s => s.currentValue !== null && s.targetValue !== null)
    .map(s => {
      // Check if metric name suggests it should decrease
      const isDecreasing = /\b(risk|incident|vulnerabilit|threat|breach|attack|error|failure|downtime|exposure|defect|issue|problem)\b/i.test(s.metric);
      if (isDecreasing) {
        return s.targetValue! <= s.currentValue! ? 100 : (s.targetValue! / s.currentValue!) * 100;
      }
      return (s.currentValue! / s.targetValue!) * 100;
    });
  
  if (validScores.length === 0) return null;
  
  const average = validScores.reduce((sum, score) => sum + Math.min(score, 100), 0) / validScores.length;
  return Math.round(average * 10) / 10;
}