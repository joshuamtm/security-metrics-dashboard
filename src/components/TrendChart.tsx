import React, { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { Metric } from '../types/metrics';
import { MetricSelector } from './MetricSelector';
import { parseTargetValue } from '../utils/calculations';

interface TrendChartProps {
  metrics: Metric[];
}

const CHART_COLORS = [
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
  '#ec4899', '#14b8a6', '#f97316', '#6366f1', '#84cc16'
];

export const TrendChart: React.FC<TrendChartProps> = ({ metrics }) => {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<number>(6);
  
  const metricNames = metrics.map(m => m.metric);
  
  const chartData = useMemo(() => {
    if (selectedMetrics.length === 0) return [];
    
    const selectedMetricsData = metrics.filter(m => selectedMetrics.includes(m.metric));
    const allDates = new Set<string>();
    
    selectedMetricsData.forEach(metric => {
      metric.data.forEach(point => {
        allDates.add(point.month);
      });
    });
    
    const sortedDates = Array.from(allDates).sort((a, b) => {
      const [monthA, yearA] = a.split('-');
      const [monthB, yearB] = b.split('-');
      const dateA = new Date(2000 + parseInt(yearA), getMonthNumber(monthA));
      const dateB = new Date(2000 + parseInt(yearB), getMonthNumber(monthB));
      return dateA.getTime() - dateB.getTime();
    });
    
    const recentDates = sortedDates.slice(-dateRange);
    
    return recentDates.map(date => {
      const dataPoint: any = { month: date };
      
      selectedMetricsData.forEach(metric => {
        const point = metric.data.find(p => p.month === date);
        dataPoint[metric.metric] = point?.value ?? null;
      });
      
      return dataPoint;
    });
  }, [metrics, selectedMetrics, dateRange]);
  
  const handleToggleMetric = (metric: string) => {
    setSelectedMetrics(prev =>
      prev.includes(metric)
        ? prev.filter(m => m !== metric)
        : [...prev, metric]
    );
  };
  
  const targetLines = useMemo(() => {
    return metrics
      .filter(m => selectedMetrics.includes(m.metric))
      .map(m => ({
        metric: m.metric,
        value: parseTargetValue(m.target)
      }))
      .filter(t => t.value !== null);
  }, [metrics, selectedMetrics]);
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Trend Analysis</h2>
        <div className="flex items-center space-x-4">
          <label className="text-sm text-gray-600">
            Date Range:
            <select
              className="ml-2 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={dateRange}
              onChange={(e) => setDateRange(Number(e.target.value))}
            >
              <option value={3}>Last 3 months</option>
              <option value={6}>Last 6 months</option>
              <option value={12}>Last 12 months</option>
            </select>
          </label>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <MetricSelector
            metrics={metricNames}
            selectedMetrics={selectedMetrics}
            onToggleMetric={handleToggleMetric}
          />
        </div>
        
        <div className="lg:col-span-3">
          {selectedMetrics.length === 0 ? (
            <div className="h-96 flex items-center justify-center text-gray-500">
              Select metrics to display trends
            </div>
          ) : (
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip
                    formatter={(value: any) => {
                      if (value === null) return 'N/A';
                      return typeof value === 'number' ? value.toFixed(1) : value;
                    }}
                  />
                  <Legend />
                  
                  {selectedMetrics.map((metric, index) => (
                    <Line
                      key={metric}
                      type="monotone"
                      dataKey={metric}
                      stroke={CHART_COLORS[index % CHART_COLORS.length]}
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      connectNulls
                    />
                  ))}
                  
                  {targetLines.map((target, index) => (
                    target.value !== null && (
                      <ReferenceLine
                        key={`target-${target.metric}`}
                        y={target.value}
                        stroke={CHART_COLORS[selectedMetrics.indexOf(target.metric) % CHART_COLORS.length]}
                        strokeDasharray="8 8"
                        label={`${target.metric} Target`}
                      />
                    )
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function getMonthNumber(monthName: string): number {
  const months: { [key: string]: number } = {
    'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3,
    'May': 4, 'Jun': 5, 'Jul': 6, 'Aug': 7,
    'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
  };
  return months[monthName] || 0;
}