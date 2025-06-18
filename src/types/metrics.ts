export interface MetricDataPoint {
  month: string;
  value: number | null;
}

export interface Metric {
  metric: string;
  target: string;
  reference?: string;
  data: MetricDataPoint[];
}

export interface RawMetricData {
  Metric: string;
  Target: string;
  Reference?: string;
  [key: string]: string | number | undefined;
}

export type MetricStatus = 'on-track' | 'at-risk' | 'off-track' | 'unknown';

export interface MetricSummary {
  metric: string;
  currentValue: number | null;
  previousValue: number | null;
  target: string;
  targetValue: number | null;
  status: MetricStatus;
  trend: 'up' | 'down' | 'stable' | 'unknown';
  trendPercentage: number | null;
}

export interface DashboardData {
  metrics: Metric[];
  lastUpdated: Date;
  summary: {
    totalMetrics: number;
    onTrack: number;
    atRisk: number;
    offTrack: number;
    unknown: number;
    overallScore: number | null;
  };
}