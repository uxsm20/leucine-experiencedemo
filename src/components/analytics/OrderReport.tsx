import React from 'react';
import { FileText, Table, File } from 'lucide-react';

interface Order {
  id: string;
  customer: string;
  product: string;
  quantity: number;
  dueDate: string;
  status: 'In-Progress' | 'At-Risk' | 'Completed' | 'Delayed';
  otifScore: number;
}

interface OrderReportProps {
  orders: Order[];
  onExport: (format: 'pdf' | 'csv' | 'excel') => void;
}

export const OrderReport: React.FC<OrderReportProps> = ({ orders, onExport }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Export Reports</h3>
          <p className="text-sm text-gray-500">Download order data in various formats</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => onExport('pdf')}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            <File className="h-4 w-4 text-red-500" />
            PDF Report
          </button>
          <button
            onClick={() => onExport('excel')}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            <Table className="h-4 w-4 text-green-500" />
            Excel Report
          </button>
          <button
            onClick={() => onExport('csv')}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            <FileText className="h-4 w-4 text-blue-500" />
            CSV Export
          </button>
        </div>
      </div>

      <div className="mt-4">
        <div className="text-sm text-gray-500">
          Report will include:
          <ul className="mt-2 list-disc list-inside space-y-1">
            <li>Order details and status</li>
            <li>Customer information</li>
            <li>Production metrics</li>
            <li>OTIF performance data</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
