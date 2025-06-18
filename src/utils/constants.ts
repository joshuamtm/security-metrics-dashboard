// Removed predefined metrics - dashboard now accepts any metrics dynamically
// export const EXPECTED_METRICS = [...]
// export const METRIC_DESCRIPTIONS = {...}

export const STATUS_COLORS = {
  'on-track': '#10b981',
  'at-risk': '#f59e0b',
  'off-track': '#ef4444',
  'unknown': '#6b7280'
};

export const STATUS_BG_COLORS = {
  'on-track': 'bg-green-500',
  'at-risk': 'bg-yellow-500',
  'off-track': 'bg-red-500',
  'unknown': 'bg-gray-500'
};

export const STATUS_TEXT_COLORS = {
  'on-track': 'text-green-600',
  'at-risk': 'text-yellow-600',
  'off-track': 'text-red-600',
  'unknown': 'text-gray-600'
};

export const MONTHS_TO_SHOW = 6;