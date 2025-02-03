import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, AlertTriangle, ChevronDown, ChevronUp, Filter, Search } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

interface ProductionRequest {
  id: string;
  product: string;
  quantity: number;
  requestedDate: string;
  priority: 'Normal' | 'Urgent' | 'Critical';
  status: 'Pending' | 'In Review' | 'Scheduled';
  capacityStatus: 'Available' | 'Limited' | 'Overbooked';
  requester: string;
  submittedDate: string;
  regulatoryImpact?: string;
  qualityRisk?: string;
  marketPriority?: string;
}

const ProductionPlanning = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRequest, setExpandedRequest] = useState<string | null>(null);
  const [requests, setRequests] = useState<ProductionRequest[]>([
    {
      id: 'PR-AMX-2024-001',
      product: 'Amoxicillin 500mg Tablets',
      quantity: 1000000,
      requestedDate: '2024-03-25',
      priority: 'Urgent',
      status: 'Pending',
      capacityStatus: 'Available',
      requester: 'Global Supply Chain',
      submittedDate: '2024-03-15',
      regulatoryImpact: 'FDA market commitment',
      qualityRisk: 'Low',
      marketPriority: 'High-volume SKU'
    },
    {
      id: 'PR-LSP-2024-002',
      product: 'Lisinopril 10mg Tablets',
      quantity: 500000,
      requestedDate: '2024-03-28',
      priority: 'Critical',
      status: 'In Review',
      capacityStatus: 'Limited',
      requester: 'Commercial Operations',
      submittedDate: '2024-03-16',
      regulatoryImpact: 'EMA commitment',
      qualityRisk: 'Medium',
      marketPriority: 'Strategic product'
    }
  ]);

  const materials = [
    {
      material: 'Raw Material A',
      available: 5000,
      required: 8000,
      status: 'partial',
      expectedDate: '2024-04-01'
    },
    {
      material: 'Raw Material B',
      available: 3000,
      required: 3000,
      status: 'available',
      expectedDate: null
    },
    {
      material: 'Raw Material C',
      available: 0,
      required: 2000,
      status: 'unavailable',
      expectedDate: null
    }
  ];

  useEffect(() => {
    const state = location.state as { 
      newRequest?: any; 
      submitSuccess?: boolean;
      scheduleSuccess?: boolean;
      requestId?: string;
    };

    if (state?.newRequest && state?.submitSuccess) {
      const newRequest: ProductionRequest = {
        id: `REQ${String(requests.length + 1).padStart(3, '0')}`,
        product: state.newRequest.product,
        quantity: state.newRequest.quantity,
        requestedDate: state.newRequest.dueDate,
        priority: state.newRequest.priority,
        status: 'Pending',
        capacityStatus: 'Available',
        requester: 'Current User',
        submittedDate: new Date().toISOString().split('T')[0]
      };
      
      setRequests(prev => [newRequest, ...prev]);
    }

    if (state?.scheduleSuccess && state?.requestId) {
      setRequests(prev => prev.map(req => 
        req.id === state.requestId 
          ? { ...req, status: 'Scheduled' }
          : req
      ));
    }
    
    window.history.replaceState({}, document.title);
  }, [location]);

  const handleSchedulingClick = (request: ProductionRequest) => {
    navigate('/production/schedule', { 
      state: { request }
    });
  };

  const toggleRequestDetails = (requestId: string) => {
    setExpandedRequest(expandedRequest === requestId ? null : requestId);
  };

  const getCapacityStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-800';
      case 'Limited':
        return 'bg-yellow-100 text-yellow-800';
      case 'Overbooked':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'In Review':
        return 'bg-blue-100 text-blue-800';
      case 'Scheduled':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = 
      request.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.requester.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = selectedStatus === 'All' || request.status === selectedStatus;
    const matchesPriority = selectedPriority === 'All' || request.priority === selectedPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Production Request Queue</h1>
          <p className="text-sm text-gray-600 mt-1">Review and schedule incoming production requests</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: 'Pending Requests', value: '8', icon: Clock, color: 'bg-yellow-500' },
          { title: 'Available Capacity', value: '65%', icon: Calendar, color: 'bg-green-500' },
          { title: 'Active Lines', value: '4/6', icon: Users, color: 'bg-blue-500' },
          { title: 'Capacity Alerts', value: '2', icon: AlertTriangle, color: 'bg-red-500' },
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

      <div className="bg-white p-4 rounded-lg shadow space-y-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>
          
          <select 
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="border rounded-md px-3 py-1.5 text-sm"
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Review">In Review</option>
            <option value="Scheduled">Scheduled</option>
          </select>

          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="border rounded-md px-3 py-1.5 text-sm"
          >
            <option value="All">All Priorities</option>
            <option value="Normal">Normal</option>
            <option value="Urgent">Urgent</option>
            <option value="Critical">Critical</option>
          </select>

          <div className="flex-grow">
            <div className="relative">
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search requests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full border rounded-md px-3 py-1.5 text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-lg font-medium text-gray-900">Materials Availability</h2>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 gap-4">
            {materials.map(material => (
              <div key={material.material} className="border rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-gray-900">{material.material}</h3>
                    <p className="text-sm text-gray-500">
                      Available: {material.available} / Required: {material.required}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full
                    ${material.status === 'available' 
                      ? 'bg-green-100 text-green-800'
                      : material.status === 'partial'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'}`}>
                    {material.status === 'available' 
                      ? 'Available'
                      : material.status === 'partial'
                        ? `Partial - Expected ${material.expectedDate}`
                        : 'Unavailable'}
                  </span>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full ${
                      material.status === 'available'
                        ? 'bg-green-500'
                        : material.status === 'partial'
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min((material.available / material.required) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Request Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Due Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Capacity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredRequests.map((request) => (
              <React.Fragment key={request.id}>
                <tr className="hover:bg-gray-50 cursor-pointer" onClick={() => toggleRequestDetails(request.id)}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {expandedRequest === request.id ? (
                        <ChevronUp className="h-4 w-4 text-gray-500 mr-2" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-gray-500 mr-2" />
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">{request.product}</div>
                        <div className="text-sm text-gray-500">#{request.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {request.quantity.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {request.requestedDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(request.priority)}`}>
                      {request.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getCapacityStatusColor(request.capacityStatus)}`}>
                      {request.capacityStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSchedulingClick(request);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Schedule
                    </button>
                  </td>
                </tr>
                {expandedRequest === request.id && (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 bg-gray-50">
                      <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">Requester</h4>
                            <p className="text-sm text-gray-600">{request.requester}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">Submitted Date</h4>
                            <p className="text-sm text-gray-600">{request.submittedDate}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">Lead Time</h4>
                            <p className="text-sm text-gray-600">15 days</p>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Resource Requirements</h4>
                          <div className="mt-2 grid grid-cols-4 gap-4">
                            <div className="bg-white p-3 rounded-lg border">
                              <div className="text-sm font-medium">Machine Hours</div>
                              <div className="text-lg font-bold text-blue-600">24h</div>
                            </div>
                            <div className="bg-white p-3 rounded-lg border">
                              <div className="text-sm font-medium">Labor Hours</div>
                              <div className="text-lg font-bold text-blue-600">48h</div>
                            </div>
                            <div className="bg-white p-3 rounded-lg border">
                              <div className="text-sm font-medium">Materials</div>
                              <div className="text-lg font-bold text-green-600">Available</div>
                            </div>
                            <div className="bg-white p-3 rounded-lg border">
                              <div className="text-sm font-medium">Quality Checks</div>
                              <div className="text-lg font-bold text-blue-600">3</div>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-end gap-3">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSchedulingClick(request);
                            }}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                          >
                            Open Scheduling View
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductionPlanning;