import React from 'react';
import { FileText, Download, Table, File } from 'lucide-react';

interface OrderReportProps {
  orders: any[];
  onExport: (format: 'pdf' | 'csv' | 'excel') => void;
}

export const OrderReport: React.FC<OrderReportProps> = ({ orders, onExport }) => {
  const reportFormats = [
    {
      name: 'PDF Report',
      format: 'pdf' as const,
      icon: File,
      description: 'Detailed report with charts and analysis'
    },
    {
      name: 'Excel Export',
      format: 'excel' as const,
      icon: Table,
      description: 'Complete dataset for analysis'
    },
    {
      name: 'CSV Export',
      format: 'csv' as const,
      icon: FileText,
      description: 'Raw data in CSV format'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Export Reports</h3>
            <p className="text-sm text-gray-500">Download order data in various formats</p>
          </div>
          <span className="text-sm text-gray-500">{orders.length} orders available</span>
        </div>
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {reportFormats.map((format) => (
          <div
            key={format.format}
            className="border rounded-lg p-4 hover:border-blue-500 cursor-pointer transition-colors"
            onClick={() => onExport(format.format)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <format.icon className="h-6 w-6 text-blue-500" />
                <div>
                  <h4 className="font-medium text-gray-900">{format.name}</h4>
                  <p className="text-sm text-gray-500">{format.description}</p>
                </div>
              </div>
              <Download className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
