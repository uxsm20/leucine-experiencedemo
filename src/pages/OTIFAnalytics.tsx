import React, { useState } from 'react';
import { 
  BarChart2, 
  TrendingUp, 
  Download, 
  Calendar, 
  Filter,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  AlertTriangle,
  FileText,
  Truck
} from 'lucide-react';

interface AnalyticsData {
  period: string;
  onTime: number;
  delayed: number;
  total: number;
}

const OTIFAnalytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('Last 30 Days');
  const [selectedRegion, setSelectedRegion] = useState('All Regions');
  const [selectedProduct, setSelectedProduct] = useState('All Products');

  const analyticsData: AnalyticsData[] = [
    { period: 'Week 1', onTime: 45, delayed: 5, total: 50 },
    { period: 'Week 2', onTime: 48, delayed: 2, total: 50 },
    { period: 'Week 3', onTime: 47, delayed: 3, total: 50 },
    { period: 'Week 4', onTime: 49, delayed: 1, total: 50 }
  ];

  const metrics = {
    currentOTIF: 94.5,
    trend: '+2.3%',
    targetOTIF: 95,
    averageDelay: '1.8 days',
    delayTrend: '-0.3 days',
    topDelayReasons: [
      { reason: 'Production Capacity', percentage: 45 },
      { reason: 'Material Shortage', percentage: 30 },
      { reason: 'Quality Holds', percentage: 15 },
      { reason: 'Other', percentage: 10 }
    ],
    productPerformance: [
      { product: 'Amoxicillin 500mg', otif: 96.5, trend: '+1.2%' },
      { product: 'Lisinopril 10mg', otif: 93.8, trend: '-0.5%' },
      { product: 'Metformin 850mg', otif: 95.2, trend: '+0.8%' }
    ]
  };

  const handleExportReport = () => {
    // In a real application, this would generate and download a report
    console.log('Exporting OTIF report...');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">OTIF Analytics</h1>
          <p className="text-sm text-gray-600 mt-1">
            Detailed analysis of On-Time In-Full performance
          </p>
        </div>
        <button
          onClick={handleExportReport}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          <Download className="h-4 w-4" />
          Export Report
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filters:</span>
        </div>
        
        <select 
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="border rounded-md px-3 py-1.5 text-sm"
        >
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
          <option>Last Quarter</option>
          <option>Last Year</option>
        </select>

        <select
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
          className="border rounded-md px-3 py-1.5 text-sm"
        >
          <option>All Regions</option>
          <option>North America</option>
          <option>Europe</option>
          <option>Asia Pacific</option>
        </select>

        <select
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
          className="border rounded-md px-3 py-1.5 text-sm"
        >
          <option>All Products</option>
          <option>Amoxicillin 500mg</option>
          <option>Lisinopril 10mg</option>
          <option>Metformin 850mg</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Current OTIF</p>
              <p className="text-2xl font-bold mt-1">{metrics.currentOTIF}%</p>
            </div>
            <div className="flex items-center gap-1 text-green-600">
              <ArrowUpRight className="h-4 w-4" />
              <span className="text-sm">{metrics.trend}</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Progress to Target</span>
              <span>{metrics.targetOTIF}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${(metrics.currentOTIF / metrics.targetOTIF) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Average Delay</p>
              <p className="text-2xl font-bold mt-1">{metrics.averageDelay}</p>
            </div>
            <div className="flex items-center gap-1 text-green-600">
              <ArrowDownRight className="h-4 w-4" />
              <span className="text-sm">{metrics.delayTrend}</span>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">Trending downward</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Orders At Risk</p>
              <p className="text-2xl font-bold mt-1">5</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-yellow-500" />
          </div>
          <div className="mt-4 flex items-center gap-2">
            <Clock className="h-4 w-4 text-yellow-500" />
            <span className="text-sm text-gray-600">Requires immediate attention</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Perfect Orders</p>
              <p className="text-2xl font-bold mt-1">89%</p>
            </div>
            <Truck className="h-8 w-8 text-blue-500" />
          </div>
          <div className="mt-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-blue-500" />
            <span className="text-sm text-gray-600">+3% vs last period</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* OTIF Trend Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-gray-500" />
            OTIF Performance Trend
          </h2>
          <div className="h-64 bg-gray-50 rounded-lg flex items-end justify-between p-4">
            {analyticsData.map((data, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                <div className="w-16 flex flex-col gap-1">
                  <div
                    className="bg-green-500 rounded-t"
                    style={{ height: `${(data.onTime / data.total) * 200}px` }}
                  />
                  <div
                    className="bg-red-500 rounded-b"
                    style={{ height: `${(data.delayed / data.total) * 200}px` }}
                  />
                </div>
                <span className="text-xs text-gray-600">{data.period}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded" />
              <span className="text-sm text-gray-600">On Time</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded" />
              <span className="text-sm text-gray-600">Delayed</span>
            </div>
          </div>
        </div>

        {/* Delay Reasons Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
            <PieChart className="h-5 w-5 text-gray-500" />
            Delay Reasons Breakdown
          </h2>
          <div className="space-y-4">
            {metrics.topDelayReasons.map((reason, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{reason.reason}</span>
                  <span className="font-medium">{reason.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      index === 0 ? 'bg-red-500' :
                      index === 1 ? 'bg-orange-500' :
                      index === 2 ? 'bg-yellow-500' :
                      'bg-gray-500'
                    }`}
                    style={{ width: `${reason.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Product Performance Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
            <FileText className="h-5 w-5 text-gray-500" />
            Product Performance
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  OTIF Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trend
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {metrics.productPerformance.map((product, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {product.product}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.otif}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`flex items-center gap-1 ${
                      product.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {product.trend.startsWith('+') ? (
                        <ArrowUpRight className="h-4 w-4" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4" />
                      )}
                      {product.trend}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      product.otif >= 95 ? 'bg-green-100 text-green-800' :
                      product.otif >= 90 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {product.otif >= 95 ? 'On Target' :
                       product.otif >= 90 ? 'Near Target' :
                       'Below Target'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OTIFAnalytics;