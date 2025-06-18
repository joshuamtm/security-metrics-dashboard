import React, { useState, useEffect } from 'react';
import { Upload, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { FileUpload } from './FileUpload';
import { ExecutiveSummary } from './ExecutiveSummary';
import { MetricCard } from './MetricCard';
import { TrendChart } from './TrendChart';
import { ExecutiveInsights } from './ExecutiveInsights';
import { Metric, DashboardData } from '../types/metrics';
import { getMetricSummary, calculateOverallScore } from '../utils/calculations';
import { generateExecutiveInsights } from '../utils/insights';

export const Dashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string>('');
  const [showUpload, setShowUpload] = useState(true);
  
  useEffect(() => {
    if (metrics.length > 0) {
      const summaries = metrics.map(getMetricSummary);
      
      const summary = {
        totalMetrics: metrics.length,
        onTrack: summaries.filter(s => s.status === 'on-track').length,
        atRisk: summaries.filter(s => s.status === 'at-risk').length,
        offTrack: summaries.filter(s => s.status === 'off-track').length,
        unknown: summaries.filter(s => s.status === 'unknown').length,
        overallScore: calculateOverallScore(metrics)
      };
      
      setDashboardData({
        metrics,
        lastUpdated: new Date(),
        summary
      });
    }
  }, [metrics]);
  
  const handleDataLoaded = (loadedMetrics: Metric[]) => {
    console.log('Dashboard received metrics:', loadedMetrics);
    setMetrics(loadedMetrics);
    setShowUpload(false);
    setError('');
  };
  
  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };
  
  const handleNewUpload = () => {
    setShowUpload(true);
    setMetrics([]);
    setDashboardData(null);
    setError('');
  };
  
  if (showUpload || !dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Metrics Dashboard
            </h1>
            <p className="mt-2 text-gray-600">
              Upload your metrics data to view insights and trends
            </p>
          </header>
          
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          
          <FileUpload onDataLoaded={handleDataLoaded} onError={handleError} />
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Metrics Dashboard
              </h1>
              <div className="mt-2 flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-1" />
                Last updated: {format(dashboardData.lastUpdated, 'PPpp')}
              </div>
            </div>
            <button
              onClick={handleNewUpload}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload New Data
            </button>
          </div>
        </header>
        
        <ExecutiveSummary data={dashboardData} />
        
        <div className="mb-8">
          <ExecutiveInsights insights={generateExecutiveInsights(metrics)} />
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Individual Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {metrics.map((metric) => {
              const summary = getMetricSummary(metric);
              return (
                <MetricCard
                  key={metric.metric}
                  summary={summary}
                  data={metric.data}
                  reference={metric.reference}
                  metric={metric}
                />
              );
            })}
          </div>
        </div>
        
        <TrendChart metrics={metrics} />
      </div>
    </div>
  );
};