import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { Metric, RawMetricData, MetricDataPoint } from '../types/metrics';
import { parseMetricValue } from './calculations';

export function isDateColumn(columnName: string): boolean {
  const datePattern = /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-\d{2}$/i;
  return datePattern.test(columnName);
}

export function parseDate(dateStr: string): Date {
  const [month, year] = dateStr.split('-');
  const monthMap: { [key: string]: number } = {
    'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3,
    'May': 4, 'Jun': 5, 'Jul': 6, 'Aug': 7,
    'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
  };
  
  const monthNum = monthMap[month];
  const yearNum = 2000 + parseInt(year);
  
  return new Date(yearNum, monthNum);
}

export function transformRawData(rawData: RawMetricData[]): Metric[] {
  return rawData.map(row => {
    const dataPoints: MetricDataPoint[] = [];
    
    Object.entries(row).forEach(([key, value]) => {
      if (isDateColumn(key)) {
        dataPoints.push({
          month: key,
          value: parseMetricValue(value)
        });
      }
    });
    
    dataPoints.sort((a, b) => {
      const dateA = parseDate(a.month);
      const dateB = parseDate(b.month);
      return dateA.getTime() - dateB.getTime();
    });
    
    return {
      metric: row.Metric,
      target: row.Target || '',
      reference: row.Reference,
      data: dataPoints
    };
  });
}

export async function parseCSVFile(file: File): Promise<Metric[]> {
  return new Promise((resolve, reject) => {
    Papa.parse<RawMetricData>(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const metrics = transformRawData(results.data);
          resolve(metrics);
        } catch (error) {
          reject(new Error('Failed to parse CSV data: ' + (error as Error).message));
        }
      },
      error: (error) => {
        reject(new Error('Failed to read CSV file: ' + error.message));
      }
    });
  });
}

export async function parseExcelFile(file: File): Promise<Metric[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        const jsonData = XLSX.utils.sheet_to_json<RawMetricData>(worksheet);
        
        const metrics = transformRawData(jsonData);
        resolve(metrics);
      } catch (error) {
        reject(new Error('Failed to parse Excel file: ' + (error as Error).message));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read Excel file'));
    };
    
    reader.readAsArrayBuffer(file);
  });
}

export async function parseFile(file: File): Promise<Metric[]> {
  const extension = file.name.split('.').pop()?.toLowerCase();
  
  if (extension === 'csv') {
    return parseCSVFile(file);
  } else if (extension === 'xlsx' || extension === 'xls') {
    return parseExcelFile(file);
  } else {
    throw new Error('Unsupported file type. Please upload a CSV or Excel file.');
  }
}