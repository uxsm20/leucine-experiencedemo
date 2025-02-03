import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, CheckCircle2, Clock, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';

interface Batch {
  id: string;
  product: string;
  quantity: number;
  startTime: string;
  priority: 'Normal' | 'Urgent' | 'Critical';
  status: 'Pending' | 'In Progress' | 'Completed';
  progress: number;
  steps: {
    name: string;
    status: 'pending' | 'in-progress' | 'completed';
  }[];
}

const OperatorDashboard = () => {
  const navigate = useNavigate();
  const [expandedBatch, setExpandedBatch] = useState<string | null>(null);

  const batches: Batch[] = [
    {
      id: 'B001',
      product: 'Amoxicillin 500mg Tablets',
      quantity: 500000,
      startTime: '08:00 AM',
      priority: 'Urgent',
      status: 'In Progress',
      progress: 45,
      steps: [
        { name: 'Raw Material Verification', status: 'completed' },
        { name: 'Granulation', status: 'in-progress' },
        { name: 'Drying', status: 'pending' },
        { name: 'Blending', status: 'pending' },
        { name: 'Compression', status: 'pending' },
        { name: 'Coating', status: 'pending' },
        { name: 'Quality Check', status: 'pending' }
      ]
    },
    {
      id: 'B002',
      product: 'Lisinopril 10mg Tablets',
      quantity: 300000,
      startTime: '10:30 AM',
      priority: 'Normal',
      status: 'Pending',
      progress: 0,
      steps: [
        { name: 'Raw Material Verification', status: 'pending' },
        { name: 'Granulation', status: 'pending' },
        { name: 'Drying', status: 'pending' },
        { name: 'Blending', status: 'pending' },
        { name: 'Compression', status: 'pending' },
        { name: 'Coating', status: 'pending' },
        { name: 'Quality Check', status: 'pending' }
      ]
    },
    {
      id: 'B003',
      product: 'Metformin 850mg Tablets',
      quantity: 750000,
      startTime: '02:00 PM',
      priority: 'Critical',
      status: 'Pending',
      progress: 0,
      steps: [
        { name: 'Raw Material Verification', status: 'pending' },
        { name: 'Granulation', status: 'pending' },
        { name: 'Drying', status: 'pending' },
        { name: 'Blending', status: 'pending' },
        { name: 'Compression', status: 'pending' },
        { name: 'Coating', status: 'pending' },
        { name: 'Quality Check', status: 'pending' }
      ]
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return 'bg-red-100 text-red-800';
      case 'Urgent':
        return 'bg-orange-100 text-orange-800';
      case 'Normal':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Pending':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const toggleBatchDetails = (batchId: string) => {
    setExpandedBatch(expandedBatch === batchId ? null : batchId);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Operator Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1">Manage and execute production batches</p>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: 'Active Batches', value: '2', icon: Play, color: 'bg-blue-500' },
          { title: 'Completed Today', value: '3', icon: CheckCircle2, color: 'bg-green-500' },
          { title: 'Upcoming', value: '4', icon: Clock, color: 'bg-yellow-500' },
          { title: 'Alerts', value: '1', icon: AlertTriangle, color: 'bg-red-500' },
        ].map((stat) => (
          <div key={stat.title} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Batches List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Assigned Batches</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {batches.map((batch) => (
            <div key={batch.id} className="hover:bg-gray-50">
              <div 
                className="px-6 py-4 cursor-pointer"
                onClick={() => toggleBatchDetails(batch.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {expandedBatch === batch.id ? (
                      <ChevronUp className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{batch.product}</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(batch.priority)}`}>
                          {batch.priority}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        Batch #{batch.id} • {batch.quantity} units
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(batch.status)}`}>
                      {batch.status}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/batch-execution/${batch.id}`);
                      }}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                      {batch.status === 'Pending' ? 'Start Batch' : 'Continue Batch'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Expanded View */}
              {expandedBatch === batch.id && (
                <div className="px-6 pb-4 bg-gray-50">
                  <div className="space-y-4">
                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Overall Progress</span>
                        <span>{batch.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${batch.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Steps */}
                    <div className="space-y-2">
                      {batch.steps.map((step, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-white rounded-lg border"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                step.status === 'completed'
                                  ? 'bg-green-500'
                                  : step.status === 'in-progress'
                                  ? 'bg-blue-500'
                                  : 'bg-gray-300'
                              }`}
                            ></div>
                            <span className="text-sm font-medium text-gray-900">
                              {step.name}
                            </span>
                          </div>
                          <span
                            className={`text-xs font-medium ${
                              step.status === 'completed'
                                ? 'text-green-600'
                                : step.status === 'in-progress'
                                ? 'text-blue-600'
                                : 'text-gray-500'
                            }`}
                          >
                            {step.status === 'completed'
                              ? 'Completed'
                              : step.status === 'in-progress'
                              ? 'In Progress'
                              : 'Pending'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OperatorDashboard;