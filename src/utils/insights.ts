import { Metric, MetricSummary } from '../types/metrics';
import { getMetricSummary } from './calculations';

export interface MetricInsight {
  metric: string;
  type: 'positive' | 'concern' | 'neutral' | 'critical';
  title: string;
  message: string;
  recommendation?: string;
}

export interface ExecutiveInsight {
  title: string;
  message: string;
  type: 'positive' | 'concern' | 'neutral' | 'critical';
  priority: 'high' | 'medium' | 'low';
  affectedMetrics?: string[];
}

export function generateMetricInsight(metric: Metric): MetricInsight {
  const summary = getMetricSummary(metric);
  
  const formatValue = (value: number | null): string => {
    if (value === null) return 'N/A';
    
    if (metric.target.includes('%')) {
      return `${Math.round(value * 10) / 10}%`;
    }
    
    if (value % 1 !== 0) {
      return (Math.round(value * 10) / 10).toString();
    }
    
    return value.toString();
  };
  
  if (summary.status === 'on-track') {
    return {
      metric: metric.metric,
      type: 'positive',
      title: 'Meeting Target',
      message: `${metric.metric} is performing well at ${formatValue(summary.currentValue)}, meeting the target of ${summary.target}.`,
      recommendation: getPositiveRecommendation(metric.metric, summary)
    };
  }
  
  if (summary.status === 'at-risk') {
    return {
      metric: metric.metric,
      type: 'concern',
      title: 'Approaching Target',
      message: `${metric.metric} is at ${formatValue(summary.currentValue)}, approaching but not yet meeting the target of ${summary.target}.`,
      recommendation: getAtRiskRecommendation(metric.metric, summary)
    };
  }
  
  if (summary.status === 'off-track') {
    return {
      metric: metric.metric,
      type: 'critical',
      title: 'Below Target',
      message: `${metric.metric} is significantly below target at ${formatValue(summary.currentValue)} vs. target of ${summary.target}.`,
      recommendation: getCriticalRecommendation(metric.metric, summary)
    };
  }
  
  return {
    metric: metric.metric,
    type: 'neutral',
    title: 'Insufficient Data',
    message: `${metric.metric} requires additional data to assess performance against target.`,
    recommendation: 'Ensure consistent data collection and reporting for this metric.'
  };
}

export function generateExecutiveInsights(metrics: Metric[]): ExecutiveInsight[] {
  const summaries = metrics.map(getMetricSummary);
  const insights: ExecutiveInsight[] = [];
  
  // Overall performance analysis
  const onTrackCount = summaries.filter(s => s.status === 'on-track').length;
  const offTrackCount = summaries.filter(s => s.status === 'off-track').length;
  
  if (onTrackCount >= metrics.length * 0.8) {
    insights.push({
      title: 'Strong Performance',
      message: `${onTrackCount} of ${metrics.length} metrics are meeting targets, indicating strong overall performance.`,
      type: 'positive',
      priority: 'low'
    });
  } else if (offTrackCount >= metrics.length * 0.3) {
    insights.push({
      title: 'Performance Needs Attention',
      message: `${offTrackCount} metrics are significantly below target, requiring immediate attention.`,
      type: 'critical',
      priority: 'high',
      affectedMetrics: summaries.filter(s => s.status === 'off-track').map(s => s.metric)
    });
  }
  
  // Critical metrics analysis
  const criticalMetrics = summaries.filter(s => s.status === 'off-track');
  if (criticalMetrics.length >= 2) {
    insights.push({
      title: 'Multiple Critical Metrics',
      message: `${criticalMetrics.length} metrics are critically below target and require immediate intervention.`,
      type: 'critical',
      priority: 'high',
      affectedMetrics: criticalMetrics.map(s => s.metric)
    });
  }
  
  // Trending analysis
  const isDecreasingMetric = (metric: string) => /\b(risk|incident|vulnerabilit|threat|breach|attack|error|failure|downtime|exposure|defect|issue|problem)\b/i.test(metric);
  const improvingMetrics = summaries.filter(s => 
    (s.trend === 'up' && !isDecreasingMetric(s.metric)) || 
    (s.trend === 'down' && isDecreasingMetric(s.metric))
  );
  const decliningMetrics = summaries.filter(s => 
    (s.trend === 'down' && !isDecreasingMetric(s.metric)) || 
    (s.trend === 'up' && isDecreasingMetric(s.metric))
  );
  
  if (improvingMetrics.length >= 3) {
    insights.push({
      title: 'Positive Trends',
      message: `${improvingMetrics.length} metrics show improvement over the previous period, indicating effective initiatives.`,
      type: 'positive',
      priority: 'low',
      affectedMetrics: improvingMetrics.map(s => s.metric)
    });
  }
  
  if (decliningMetrics.length >= 2) {
    insights.push({
      title: 'Declining Metrics',
      message: `${decliningMetrics.length} metrics show declining performance, requiring investigation and corrective action.`,
      type: 'concern',
      priority: 'high',
      affectedMetrics: decliningMetrics.map(s => s.metric)
    });
  }
  
  return insights.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
}

function getPositiveRecommendation(metric: string, summary: MetricSummary): string {
  return 'Continue current practices and monitor for sustained performance.';
}

function getAtRiskRecommendation(metric: string, summary: MetricSummary): string {
  return 'Implement corrective measures to improve performance toward target.';
}

function getCriticalRecommendation(metric: string, summary: MetricSummary): string {
  return 'URGENT: Immediate action required to address critical gap and meet target performance.';
}