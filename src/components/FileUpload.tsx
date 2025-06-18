import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileSpreadsheet } from 'lucide-react';
import { parseFile } from '../utils/dataParser';
import { Metric } from '../types/metrics';

interface FileUploadProps {
  onDataLoaded: (metrics: Metric[]) => void;
  onError: (error: string) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onDataLoaded, onError }) => {
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) {
      return;
    }
    
    const file = acceptedFiles[0];
    
    try {
      const metrics = await parseFile(file);
      
      if (metrics.length === 0) {
        onError('No data found in the uploaded file.');
        return;
      }
      
      onDataLoaded(metrics);
    } catch (error) {
      onError((error as Error).message);
    }
  }, [onDataLoaded, onError]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    multiple: false
  });
  
  return (
    <div className="w-full max-w-4xl mx-auto p-8">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-12 text-center cursor-pointer
          transition-all duration-200 ease-in-out
          ${isDragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }
        `}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center space-y-4">
          {isDragActive ? (
            <>
              <FileSpreadsheet className="w-16 h-16 text-blue-500" />
              <p className="text-lg font-medium text-blue-600">
                Drop your file here...
              </p>
            </>
          ) : (
            <>
              <Upload className="w-16 h-16 text-gray-400" />
              <div>
                <p className="text-lg font-medium text-gray-700">
                  Drag and drop your metrics file here
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  or click to select a file
                </p>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Supports CSV and Excel files (.csv, .xls, .xlsx)
              </p>
            </>
          )}
        </div>
      </div>
      
      <div className="mt-6 text-center space-y-2">
        <div>
          <button
            className="text-sm text-blue-600 hover:text-blue-700 underline mr-4"
            onClick={(e) => {
              e.stopPropagation();
              downloadSampleFile();
            }}
          >
            Download Quick Sample
          </button>
          <button
            className="text-sm text-blue-600 hover:text-blue-700 underline"
            onClick={(e) => {
              e.stopPropagation();
              downloadComprehensiveTemplate();
            }}
          >
            Download Full Template
          </button>
        </div>
        <p className="text-xs text-gray-400">
          Quick Sample: 3 months | Full Template: 18 months with realistic progression
        </p>
      </div>
    </div>
  );
};

function downloadSampleFile() {
  const sampleData = `Metric,Target,Reference,Jan-25,Feb-25,Mar-25
Performance Score,90+,https://example.com/metrics,91,89,92
Compliance Rate,85%,https://example.com/compliance,78%,80%,82%
Security Score,75%,https://example.com/security,68%,70%,72%
Uptime Percentage,98%,https://example.com/uptime,95%,96%,97%
Issue Resolution Rate,100%,https://example.com/issues,95%,98%,100%
Training Completion,75%,https://example.com/training,65%,68%,71%
Quality Score,70+,https://example.com/quality,65,67,69
User Satisfaction,80,https://example.com/satisfaction,75,77,78
Adoption Rate,80%,https://example.com/adoption,72%,75%,78%
Error Count,50,https://example.com/errors,65,62,58`;
  
  const blob = new Blob([sampleData], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'metrics_quick_sample.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

function downloadComprehensiveTemplate() {
  const comprehensiveData = `Metric,Target,Reference,Jan-24,Feb-24,Mar-24,Apr-24,May-24,Jun-24,Jul-24,Aug-24,Sep-24,Oct-24,Nov-24,Dec-24,Jan-25,Feb-25,Mar-25,Apr-25,May-25,Jun-25
Performance Score,90+,https://example.com/metrics,72,74,76,78,80,82,84,85,87,89,90,91,92,93,94,95,96,97
Compliance Rate,85%,https://example.com/compliance,45%,48%,52%,55%,58%,61%,64%,67%,70%,73%,76%,78%,80%,82%,84%,85%,86%,87%
Security Score,75%,https://example.com/security,35%,38%,42%,45%,48%,52%,55%,58%,61%,64%,67%,69%,71%,73%,75%,76%,77%,78%
Uptime Percentage,98%,https://example.com/uptime,78%,80%,82%,84%,86%,88%,90%,91%,92%,93%,94%,95%,96%,97%,98%,98%,98%,99%
Issue Resolution Rate,100%,https://example.com/issues,65%,68%,72%,75%,78%,82%,85%,88%,90%,92%,95%,97%,98%,99%,100%,100%,100%,100%
Training Completion,75%,https://example.com/training,35%,38%,42%,45%,48%,52%,55%,58%,61%,64%,67%,69%,71%,73%,75%,76%,77%,78%
Quality Score,70+,https://example.com/quality,45,47,49,52,54,56,58,60,62,64,66,68,69,70,71,72,73,74
User Satisfaction,80,https://example.com/satisfaction,55,57,59,61,63,65,67,69,71,73,75,76,77,78,79,80,81,82
Adoption Rate,80%,https://example.com/adoption,45%,48%,52%,55%,58%,61%,64%,67%,70%,73%,75%,77%,78%,79%,80%,81%,82%,83%
Error Count,25,https://example.com/errors,150,145,140,135,130,125,120,115,110,105,100,95,90,85,80,75,70,65`;
  
  const blob = new Blob([comprehensiveData], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'Metrics_Template.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}