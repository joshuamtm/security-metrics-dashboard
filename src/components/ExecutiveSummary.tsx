import React from 'react';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle } from 'lucide-react';
import { DashboardData } from '../types/metrics';

interface ExecutiveSummaryProps {
  data: DashboardData;
}

export const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({ data }) => {
  const { summary } = data;
  
  const cards = [
    {
      title: 'Overall Score',
      value: summary.overallScore !== null ? `${summary.overallScore}%` : 'N/A',
      icon: summary.overallScore !== null && summary.overallScore >= 80 
        ? <TrendingUp className="w-6 h-6" />
        : <TrendingDown className="w-6 h-6" />,
      color: summary.overallScore !== null && summary.overallScore >= 80 
        ? 'text-green-600' 
        : 'text-red-600',
      bgColor: summary.overallScore !== null && summary.overallScore >= 80 
        ? 'bg-green-100' 
        : 'bg-red-100'
    },
    {
      title: 'On Track',
      value: summary.onTrack,
      icon: <CheckCircle className="w-6 h-6" />,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      subtitle: 'metrics meeting targets'
    },
    {
      title: 'At Risk',
      value: summary.atRisk,
      icon: <AlertCircle className="w-6 h-6" />,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      subtitle: 'metrics near target'
    },
    {
      title: 'Off Track',
      value: summary.offTrack,
      icon: <TrendingDown className="w-6 h-6" />,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      subtitle: 'metrics below target'
    }
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wider">
                {card.title}
              </h3>
              {card.subtitle && (
                <p className="text-xs text-gray-500 mt-1">{card.subtitle}</p>
              )}
            </div>
            <div className={`${card.bgColor} ${card.color} p-2 rounded-lg`}>
              {card.icon}
            </div>
          </div>
          <div className={`text-3xl font-bold ${card.color}`}>
            {card.value}
          </div>
        </div>
      ))}
    </div>
  );
};