import React from 'react';
import { CheckCircle2, XCircle, AlertTriangle, FileCheck } from 'lucide-react';

const QualityControl = () => {
  const qualityMetrics = [
    {
      title: 'Pending Reviews',
      value: '5',
      icon: FileCheck,
      color: 'bg-yellow-500',
      detail: 'Including 2 stability studies'
    },
    {
      title: 'Release Rate',
      value: '98.5%',
      icon: CheckCircle2,
      color: 'bg-green-500',
      detail: 'Above target of 98%'
    },
    {
      title: 'Open Deviations',
      value: '3',
      icon: XCircle,
      color: 'bg-red-500',
      detail: '1 critical, 2 major'
    },
    {
      title: 'Stability Studies',
      value: '12',
      icon: AlertTriangle,
      color: 'bg-orange-500',
      detail: '4 accelerated, 8 long-term'
    }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quality Control</h1>
        <div className="space-x-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Review Batch
          </button>
        </div>
      </div>

      {/* QA Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {qualityMetrics.map((stat) => (
          <div key={stat.title} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.detail}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Batches Pending Review */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Batches Pending Review</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Batch ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completion Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deviations
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[
                { id: 'B001', product: 'Product A', date: '2024-03-15', deviations: 0, status: 'Pending Review' },
                { id: 'B002', product: 'Product B', date: '2024-03-15', deviations: 2, status: 'Under Investigation' },
                { id: 'B003', product: 'Product C', date: '2024-03-14', deviations: 1, status: 'Pending Review' },
              ].map((batch) => (
                <tr key={batch.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {batch.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {batch.product}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {batch.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${batch.deviations === 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {batch.deviations}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${batch.status === 'Pending Review' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                      {batch.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-4">
                    <button className="text-blue-600 hover:text-blue-800">
                      Review
                    </button>
                    <button className="text-green-600 hover:text-green-800">
                      Approve
                    </button>
                    <button className="text-red-600 hover:text-red-800">
                      Reject
                    </button>
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

export default QualityControl;