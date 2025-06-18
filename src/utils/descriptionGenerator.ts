export interface MetricDescription {
  description: string;
  whyItMatters: string;
  category: string;
}

export function generateMetricDescription(metricName: string, target: string): MetricDescription {
  const lowerMetric = metricName.toLowerCase();
  
  // Security Metrics
  if (containsAny(lowerMetric, ['encrypt', 'encryption', 'encrypted'])) {
    return {
      description: `Percentage of ${extractSubject(lowerMetric, 'encrypt')} with encryption enabled to protect data at rest and in transit.`,
      whyItMatters: "Encryption prevents unauthorized access to sensitive data and ensures compliance with data protection regulations.",
      category: "Data Security"
    };
  }
  
  if (containsAny(lowerMetric, ['compliance', 'compliant'])) {
    return {
      description: `Percentage of ${extractSubject(lowerMetric, 'compliance')} meeting established compliance requirements and standards.`,
      whyItMatters: "Compliance reduces regulatory risk, avoids penalties, and demonstrates adherence to industry best practices.",
      category: "Compliance"
    };
  }
  
  if (containsAny(lowerMetric, ['security', 'secure']) && containsAny(lowerMetric, ['score', 'rating'])) {
    return {
      description: "Overall security posture score based on multiple security controls and risk factors.",
      whyItMatters: "Provides a comprehensive view of organizational security health and helps prioritize security investments.",
      category: "Overall Security"
    };
  }
  
  if (containsAny(lowerMetric, ['training', 'awareness']) && containsAny(lowerMetric, ['security', 'cyber'])) {
    return {
      description: "Percentage of employees who have completed required security awareness training programs.",
      whyItMatters: "Human error is a leading cause of security incidents. Regular training reduces risk of social engineering attacks.",
      category: "Security Training"
    };
  }
  
  if (containsAny(lowerMetric, ['password', 'pwd']) && containsAny(lowerMetric, ['health', 'score', 'strength'])) {
    return {
      description: "Assessment of password strength and security practices across the organization.",
      whyItMatters: "Strong passwords are the first line of defense against unauthorized access and credential-based attacks.",
      category: "Identity Security"
    };
  }
  
  if (containsAny(lowerMetric, ['vulnerability', 'vulnerabilities', 'vuln', 'cve'])) {
    return {
      description: "Tracking of identified security vulnerabilities and their remediation status.",
      whyItMatters: "Unpatched vulnerabilities are common attack vectors. Rapid remediation reduces exposure to threats.",
      category: "Vulnerability Management"
    };
  }
  
  if (containsAny(lowerMetric, ['pentest', 'penetration', 'pen test']) && containsAny(lowerMetric, ['finding', 'issue', 'critical', 'high'])) {
    return {
      description: "Percentage of critical and high-severity findings from penetration testing that have been remediated.",
      whyItMatters: "Pentest findings represent real attack paths. Prompt remediation prevents potential security breaches.",
      category: "Security Testing"
    };
  }
  
  if (containsAny(lowerMetric, ['device', 'endpoint', 'computer']) && containsAny(lowerMetric, ['compliance', 'compliant'])) {
    return {
      description: "Percentage of managed devices that meet organizational security policies and configurations.",
      whyItMatters: "Non-compliant devices create security gaps and increase risk of malware infections and data breaches.",
      category: "Endpoint Security"
    };
  }
  
  if (containsAny(lowerMetric, ['microsoft', 'office', '365', 'm365']) && containsAny(lowerMetric, ['secure', 'security'])) {
    return {
      description: "Microsoft 365 security configuration score measuring implementation of recommended security controls.",
      whyItMatters: "Proper M365 security configuration protects against email threats, data loss, and unauthorized access.",
      category: "Cloud Security"
    };
  }
  
  // Performance Metrics  
  if (containsAny(lowerMetric, ['uptime', 'availability'])) {
    return {
      description: "Percentage of time systems and services are operational and accessible to users.",
      whyItMatters: "High availability ensures business continuity and prevents revenue loss from system downtime.",
      category: "System Performance"
    };
  }
  
  if (containsAny(lowerMetric, ['response', 'latency']) && containsAny(lowerMetric, ['time', 'speed'])) {
    return {
      description: "Average time taken for systems to respond to user requests or process transactions.",
      whyItMatters: "Fast response times improve user experience and operational efficiency.",
      category: "System Performance"
    };
  }
  
  // Quality Metrics
  if (containsAny(lowerMetric, ['defect', 'bug', 'error']) && containsAny(lowerMetric, ['rate', 'count', 'density'])) {
    return {
      description: "Rate of defects or errors identified in products, services, or processes.",
      whyItMatters: "Lower defect rates indicate higher quality output and reduce costs associated with rework and customer issues.",
      category: "Quality Assurance"
    };
  }
  
  if (containsAny(lowerMetric, ['customer', 'client']) && containsAny(lowerMetric, ['satisfaction', 'happy', 'nps'])) {
    return {
      description: "Measure of customer satisfaction with products, services, or support interactions.",
      whyItMatters: "Customer satisfaction drives retention, referrals, and long-term business growth.",
      category: "Customer Experience"
    };
  }
  
  // Financial Metrics
  if (containsAny(lowerMetric, ['cost', 'expense', 'budget']) && containsAny(lowerMetric, ['reduction', 'saving', 'efficiency'])) {
    return {
      description: "Measurement of cost reductions or efficiency improvements in operations or processes.",
      whyItMatters: "Cost optimization improves profitability and allows reinvestment in growth initiatives.",
      category: "Financial Performance"
    };
  }
  
  if (containsAny(lowerMetric, ['revenue', 'sales', 'income'])) {
    return {
      description: "Tracking of revenue generation and sales performance metrics.",
      whyItMatters: "Revenue growth is essential for business sustainability and expansion.",
      category: "Financial Performance"
    };
  }
  
  // Generic fallbacks based on target type
  if (target.includes('%')) {
    return {
      description: `Percentage-based measurement of ${getMetricSubject(metricName)} performance or compliance.`,
      whyItMatters: "Tracking this percentage helps monitor progress toward organizational goals and identify areas for improvement.",
      category: "Performance Metric"
    };
  }
  
  if (containsAny(lowerMetric, ['score', 'rating', 'index'])) {
    return {
      description: `Calculated score or rating that evaluates ${getMetricSubject(metricName)} performance.`,
      whyItMatters: "Scoring systems provide standardized measurement and enable benchmarking against targets or industry standards.",
      category: "Performance Score"
    };
  }
  
  if (containsAny(lowerMetric, ['count', 'number', 'total'])) {
    return {
      description: `Numerical count or total of ${getMetricSubject(metricName)} items or occurrences.`,
      whyItMatters: "Counting key items or events helps track volume, capacity, and operational metrics.",
      category: "Volume Metric"
    };
  }
  
  // Ultimate fallback
  return {
    description: `Measurement tracking ${metricName.toLowerCase()} to monitor organizational performance.`,
    whyItMatters: "Regular monitoring of this metric helps ensure alignment with business objectives and identifies improvement opportunities.",
    category: "Business Metric"
  };
}

function containsAny(text: string, keywords: string[]): boolean {
  return keywords.some(keyword => text.includes(keyword));
}

function extractSubject(text: string, keyword: string): string {
  // Try to extract the subject (e.g., "endpoints", "devices", "systems")
  const words = text.split(/[\s-_]+/);
  
  // Look for common subjects
  const subjects = ['endpoint', 'device', 'system', 'server', 'computer', 'laptop', 'mobile', 'asset'];
  const foundSubject = words.find(word => subjects.some(subject => word.includes(subject)));
  
  if (foundSubject) {
    return foundSubject.includes('endpoint') ? 'endpoints' : 
           foundSubject.includes('device') ? 'devices' :
           foundSubject.includes('system') ? 'systems' :
           foundSubject.includes('server') ? 'servers' :
           foundSubject.includes('computer') ? 'computers' :
           foundSubject.includes('laptop') ? 'laptops' :
           foundSubject.includes('mobile') ? 'mobile devices' :
           'assets';
  }
  
  return 'systems';
}

function getMetricSubject(metricName: string): string {
  const lowerMetric = metricName.toLowerCase();
  
  // Extract meaningful subject from metric name
  if (containsAny(lowerMetric, ['endpoint', 'device', 'computer'])) return 'endpoint';
  if (containsAny(lowerMetric, ['employee', 'user', 'staff'])) return 'employee';
  if (containsAny(lowerMetric, ['system', 'service', 'application'])) return 'system';
  if (containsAny(lowerMetric, ['security', 'cyber'])) return 'security';
  if (containsAny(lowerMetric, ['customer', 'client'])) return 'customer';
  if (containsAny(lowerMetric, ['process', 'workflow'])) return 'process';
  if (containsAny(lowerMetric, ['project', 'initiative'])) return 'project';
  
  // Extract first meaningful word
  const words = metricName.split(/[\s-_]+/).filter(word => word.length > 2);
  return words[0]?.toLowerCase() || 'metric';
}