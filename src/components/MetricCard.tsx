import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, HelpCircle, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { MetricSummary, MetricDataPoint } from '../types/metrics';
import { STATUS_BG_COLORS, STATUS_COLORS, MONTHS_TO_SHOW } from '../utils/constants';
import { generateMetricInsight } from '../utils/insights';

interface MetricCardProps {
  summary: MetricSummary;
  data: MetricDataPoint[];
  reference?: string;
  metric: {
    metric: string;
    target: string;
    reference?: string;
    data: MetricDataPoint[];
  };
}

export const MetricCard: React.FC<MetricCardProps> = ({ summary, data, reference, metric }) => {
  const [showDetails, setShowDetails] = useState(false);
  const recentData = data.slice(-MONTHS_TO_SHOW);
  const chartData = recentData.map(d => ({ value: d.value || 0 }));
  // Description removed - dashboard now accepts any metrics dynamically
  const insight = generateMetricInsight(metric);
  
  const getTrendIcon = () => {
    switch (summary.trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4" />;
      case 'down':
        return <TrendingDown className="w-4 h-4" />;
      case 'stable':
        return <Minus className="w-4 h-4" />;
      default:
        return <HelpCircle className="w-4 h-4" />;
    }
  };
  
  const formatValue = (value: number | null): string => {
    if (value === null) return 'N/A';
    
    if (summary.target.includes('%')) {
      // Round to 1 decimal place for percentages
      return `${Math.round(value * 10) / 10}%`;
    }
    
    // Round to 1 decimal place for other values if they have decimals
    if (value % 1 !== 0) {
      return (Math.round(value * 10) / 10).toString();
    }
    
    return value.toString();
  };
  
  const isImproving = () => {
    // Check if metric name suggests it should decrease (e.g., contains words like 'risk', 'incidents', etc.)
    const isDecreasing = /\b(risk|incident|vulnerabilit|threat|breach|attack|error|failure|downtime|exposure|defect|issue|problem)\b/i.test(summary.metric);
    return isDecreasing ? summary.trend === 'down' : summary.trend === 'up';
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="mb-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-lg font-semibold text-gray-800">
                  {summary.metric}
                </h3>
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  title="View details"
                >
                  <Info className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center space-x-4 text-sm mb-3">
                <span className="text-gray-600">
                  Current: <span className="font-medium">{formatValue(summary.currentValue)}</span>
                </span>
                <span className="text-gray-600">
                  Target: <span className="font-medium">{summary.target}</span>
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2 ml-4">
              {reference && (
                <a
                  href={reference}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700"
                  title="View reference"
                >
                  <HelpCircle className="w-5 h-5" />
                </a>
              )}
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
          </div>
        
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              STATUS_BG_COLORS[summary.status]
            } text-white`}
          >
            {summary.status.replace('-', ' ').toUpperCase()}
          </span>
          
          <div
            className={`flex items-center space-x-1 ${
              isImproving() ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {getTrendIcon()}
            {summary.trendPercentage !== null && (
              <span className="text-xs font-medium">
                {Math.abs(summary.trendPercentage).toFixed(1)}%
              </span>
            )}
          </div>
        </div>
      </div>
        
        <div className="h-16">
          {chartData.length > 0 && (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={STATUS_COLORS[summary.status]}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
      
      {showDetails && (
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-gray-800 mb-2">Current Assessment</h4>
              <div className={`p-3 rounded-lg border-l-4 ${
                insight.type === 'positive' ? 'bg-green-50 border-green-400' :
                insight.type === 'critical' ? 'bg-red-50 border-red-400' :
                insight.type === 'concern' ? 'bg-yellow-50 border-yellow-400' :
                'bg-blue-50 border-blue-400'
              }`}>
                <h5 className={`text-sm font-medium mb-1 ${
                  insight.type === 'positive' ? 'text-green-800' :
                  insight.type === 'critical' ? 'text-red-800' :
                  insight.type === 'concern' ? 'text-yellow-800' :
                  'text-blue-800'
                }`}>
                  {insight.title}
                </h5>
                <p className="text-sm text-gray-700 mb-2">{insight.message}</p>
                {insight.recommendation && (
                  <div>
                    <h6 className="text-xs font-medium text-gray-800 mb-1">Recommendation:</h6>
                    <p className="text-xs text-gray-600">{insight.recommendation}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};