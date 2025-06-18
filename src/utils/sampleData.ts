import { Metric } from '../types/metrics';

export const generateSampleData = (): Metric[] => {
  const months = ['Jan-25', 'Feb-25', 'Mar-25', 'Apr-25', 'May-25', 'Jun-25'];
  
  return [
    {
      metric: 'Performance Score',
      target: '90+',
      reference: 'https://example.com/performance',
      data: months.map((month, i) => ({
        month,
        value: 88 + Math.sin(i) * 3 + Math.random() * 2
      }))
    },
    {
      metric: 'Compliance Rate',
      target: '85%',
      reference: 'https://example.com/compliance',
      data: months.map((month, i) => ({
        month,
        value: 75 + i * 2 + Math.random() * 2
      }))
    },
    {
      metric: 'Quality Score',
      target: '75%',
      reference: 'https://example.com/quality',
      data: months.map((month, i) => ({
        month,
        value: 65 + i * 1.5 + Math.random() * 3
      }))
    },
    {
      metric: 'Uptime Percentage',
      target: '98%',
      reference: 'https://example.com/uptime',
      data: months.map((month, i) => ({
        month,
        value: 93 + i * 0.8 + Math.random() * 1
      }))
    },
    {
      metric: 'Issue Resolution Rate',
      target: '100%',
      reference: 'https://example.com/issues',
      data: months.map((month, i) => ({
        month,
        value: Math.min(100, 85 + i * 3 + Math.random() * 2)
      }))
    },
    {
      metric: 'Training Completion',
      target: '75%',
      reference: 'https://example.com/training',
      data: months.map((month, i) => ({
        month,
        value: 60 + i * 2.5 + Math.random() * 3
      }))
    },
    {
      metric: 'Customer Satisfaction',
      target: '70+',
      reference: 'https://example.com/satisfaction',
      data: months.map((month, i) => ({
        month,
        value: 62 + i * 1.3 + Math.random() * 2
      }))
    },
    {
      metric: 'Adoption Rate',
      target: '80',
      reference: 'https://example.com/adoption',
      data: months.map((month, i) => ({
        month,
        value: 73 + i * 1.2 + Math.random() * 1.5
      }))
    },
    {
      metric: 'User Engagement',
      target: '80%',
      reference: 'https://example.com/engagement',
      data: months.map((month, i) => ({
        month,
        value: 70 + i * 1.8 + Math.random() * 2
      }))
    },
    {
      metric: 'Error Count',
      target: '50',
      reference: 'https://example.com/errors',
      data: months.map((month, i) => ({
        month,
        value: Math.max(45, 70 - i * 4 - Math.random() * 3)
      }))
    }
  ];
};