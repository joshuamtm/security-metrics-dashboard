import React from 'react';
import { Check } from 'lucide-react';

interface MetricSelectorProps {
  metrics: string[];
  selectedMetrics: string[];
  onToggleMetric: (metric: string) => void;
}

export const MetricSelector: React.FC<MetricSelectorProps> = ({
  metrics,
  selectedMetrics,
  onToggleMetric
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-sm font-medium text-gray-700 mb-3">Select Metrics to Display</h3>
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {metrics.map((metric) => (
          <label
            key={metric}
            className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
          >
            <div className="relative">
              <input
                type="checkbox"
                className="sr-only"
                checked={selectedMetrics.includes(metric)}
                onChange={() => onToggleMetric(metric)}
              />
              <div
                className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                  selectedMetrics.includes(metric)
                    ? 'bg-blue-600 border-blue-600'
                    : 'bg-white border-gray-300'
                }`}
              >
                {selectedMetrics.includes(metric) && (
                  <Check className="w-3 h-3 text-white" />
                )}
              </div>
            </div>
            <span className="text-sm text-gray-700">{metric}</span>
          </label>
        ))}
      </div>
    </div>
  );
};