import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Info, TrendingUp, ChevronDown, ChevronUp, Eye } from 'lucide-react';
import { ExecutiveInsight } from '../utils/insights';

interface ExecutiveInsightsProps {
  insights: ExecutiveInsight[];
}

export const ExecutiveInsights: React.FC<ExecutiveInsightsProps> = ({ insights }) => {
  const [expandedInsight, setExpandedInsight] = useState<number | null>(null);
  
  const getInsightIcon = (type: ExecutiveInsight['type']) => {
    switch (type) {
      case 'positive':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'critical':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'concern':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };
  
  const getInsightStyle = (type: ExecutiveInsight['type']) => {
    switch (type) {
      case 'positive':
        return 'border-green-200 bg-green-50';
      case 'critical':
        return 'border-red-200 bg-red-50';
      case 'concern':
        return 'border-yellow-200 bg-yellow-50';
      default:
        return 'border-blue-200 bg-blue-50';
    }
  };
  
  const getPriorityBadge = (priority: ExecutiveInsight['priority']) => {
    const styles = {
      high: 'bg-red-100 text-red-800 border-red-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-green-100 text-green-800 border-green-200'
    };
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${styles[priority]}`}>
        {priority.toUpperCase()} PRIORITY
      </span>
    );
  };
  
  if (insights.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <Eye className="w-5 h-5 mr-2" />
          Executive Insights
        </h2>
        <div className="text-center py-8">
          <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Upload security metrics data to generate executive insights and recommendations.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
        <Eye className="w-5 h-5 mr-2" />
        Executive Insights & Recommendations
      </h2>
      
      <div className="space-y-4">
        {insights.map((insight, index) => (
          <div
            key={index}
            className={`border rounded-lg p-4 transition-all duration-200 ${getInsightStyle(insight.type)}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                {getInsightIcon(insight.type)}
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {insight.title}
                    </h3>
                    {getPriorityBadge(insight.priority)}
                  </div>
                  <p className="text-gray-700 mb-3">
                    {insight.message}
                  </p>
                  
                  {insight.affectedMetrics && insight.affectedMetrics.length > 0 && (
                    <div className="mb-3">
                      <h4 className="text-sm font-medium text-gray-800 mb-2">Affected Metrics:</h4>
                      <div className="flex flex-wrap gap-1">
                        {insight.affectedMetrics.map((metric, metricIndex) => (
                          <span
                            key={metricIndex}
                            className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-white border border-gray-200 text-gray-700"
                          >
                            {metric}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <button
                onClick={() => setExpandedInsight(expandedInsight === index ? null : index)}
                className="text-gray-400 hover:text-gray-600 transition-colors ml-4"
              >
                {expandedInsight === index ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>
            </div>
            
            {expandedInsight === index && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800 mb-2">Recommended Actions:</h4>
                    <div className="bg-white p-3 rounded border">
                      {getRecommendedActions(insight)}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800 mb-2">Business Impact:</h4>
                    <div className="bg-white p-3 rounded border">
                      {getBusinessImpact(insight)}
                    </div>
                  </div>
                  
                  {insight.priority === 'high' && (
                    <div className="bg-red-50 border border-red-200 rounded p-3">
                      <h4 className="text-sm font-semibold text-red-800 mb-1">⚠️ Immediate Attention Required</h4>
                      <p className="text-sm text-red-700">
                        This issue requires immediate attention from the IT steering committee and should be addressed within the next 30 days.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

function getRecommendedActions(insight: ExecutiveInsight): React.ReactNode {
  const actions: { [key: string]: string[] } = {
    'Strong Security Posture': [
      'Continue current security investments and practices',
      'Consider expanding successful initiatives to other areas',
      'Document and share best practices across the organization',
      'Plan for security maturity assessment and roadmap updates'
    ],
    'Security Program Needs Attention': [
      'Establish emergency response team for critical metrics',
      'Allocate additional budget for security improvements',
      'Engage external security consultants for rapid remediation',
      'Implement weekly steering committee reviews until resolved'
    ],
    'Human Factor Security Gaps': [
      'Launch intensive security awareness campaign',
      'Implement mandatory security training with consequences',
      'Increase phishing simulation frequency',
      'Consider security culture assessment and improvement program'
    ],
    'Password Security Concerns': [
      'Mandate password manager adoption organization-wide',
      'Implement passwordless authentication where possible',
      'Enforce strong password policies with technical controls',
      'Provide dedicated IT support for password manager deployment'
    ],
    'Positive Security Trends': [
      'Recognize and reward teams driving improvements',
      'Document successful practices for replication',
      'Maintain current investment levels in successful initiatives',
      'Plan for sustained improvement momentum'
    ],
    'Declining Security Metrics': [
      'Conduct root cause analysis for declining metrics',
      'Reassess resource allocation and priorities',
      'Implement enhanced monitoring and alerting',
      'Consider emergency intervention measures'
    ]
  };
  
  const defaultActions = [
    'Review current security controls and processes',
    'Assess resource allocation and budget requirements',
    'Establish clear timelines and accountability measures',
    'Schedule follow-up review in 30 days'
  ];
  
  const relevantActions = actions[insight.title] || defaultActions;
  
  return (
    <ul className="space-y-1">
      {relevantActions.map((action, index) => (
        <li key={index} className="text-sm text-gray-700 flex items-start">
          <span className="text-blue-600 mr-2">•</span>
          {action}
        </li>
      ))}
    </ul>
  );
}

function getBusinessImpact(insight: ExecutiveInsight): React.ReactNode {
  const impacts: { [key: string]: string } = {
    'Strong Security Posture': 'Reduced cyber insurance premiums, improved customer trust, enhanced regulatory compliance, and lower risk of costly security incidents.',
    'Security Program Needs Attention': 'Increased risk of data breaches, potential regulatory fines, business disruption, and reputational damage. Immediate action required to prevent escalation.',
    'Human Factor Security Gaps': 'High vulnerability to phishing attacks, social engineering, and insider threats. Employee-related incidents account for 95% of successful cyber attacks.',
    'Password Security Concerns': 'Elevated risk of credential theft, account takeovers, and unauthorized access to sensitive systems and data.',
    'Positive Security Trends': 'Demonstrates return on security investments, improved organizational resilience, and reduced long-term security costs.',
    'Declining Security Metrics': 'Indicates potential security program degradation, increased attack surface, and elevated business risk requiring immediate investigation.'
  };
  
  const defaultImpact = 'Impacts organizational security posture and overall business risk profile. Regular monitoring and appropriate response actions are essential.';
  
  return (
    <p className="text-sm text-gray-700">
      {impacts[insight.title] || defaultImpact}
    </p>
  );
}