import React, { useState, useCallback } from 'react';
import { 
  TruckIcon, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Search,
  Filter,
  BarChart2,
  Calendar,
  Package,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { OrderReport } from '../components/analytics/OrderReport';

interface Order {
  id: string;
  customer: string;
  product: string;
  quantity: number;
  dueDate: string;
  status: 'In-Progress' | 'At-Risk' | 'Completed' | 'Delayed';
  otifScore: number;
  delayReason?: string;
  productionBatch?: string;
  timeline: {
    event: string;
    status: 'completed' | 'in-progress' | 'pending' | 'delayed';
    date: string;
    detail?: string;
    location?: string;
    assignedTo?: string;
    estimatedCompletion?: string;
    progress?: number;
  }[];
}

const OrderTracker = () => {
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [showRootCauseModal, setShowRootCauseModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [editedOrder, setEditedOrder] = useState<Partial<Order>>({});

  const orders: Order[] = [
    {
      id: 'ORD-2024-001',
      customer: 'MedCare Hospitals',
      product: 'Amoxicillin 500mg Tablets',
      quantity: 100000,
      dueDate: '2024-03-25',
      status: 'In-Progress',
      otifScore: 98,
      productionBatch: 'B001',
      timeline: [
        {
          event: 'Order Received',
          status: 'completed',
          date: '2024-03-15',
          detail: 'Order validated and confirmed',
          location: 'Order Processing Center',
          assignedTo: 'Sarah Chen',
          progress: 100
        },
        {
          event: 'Production Started',
          status: 'in-progress',
          date: '2024-03-20',
          detail: 'Batch B001 in manufacturing',
          location: 'Manufacturing Line A',
          assignedTo: 'Production Team Alpha',
          estimatedCompletion: '2024-03-22',
          progress: 60
        },
        {
          event: 'Quality Check',
          status: 'pending',
          date: '2024-03-22',
          location: 'QC Lab',
          assignedTo: 'QC Team',
          estimatedCompletion: '2024-03-23'
        },
        {
          event: 'Shipping',
          status: 'pending',
          date: '2024-03-24',
          location: 'Distribution Center',
          assignedTo: 'Logistics Team',
          estimatedCompletion: '2024-03-25'
        }
      ]
    },
    {
      id: 'ORD-2024-002',
      customer: 'PharmaCare Group',
      product: 'Lisinopril 10mg Tablets',
      quantity: 50000,
      dueDate: '2024-03-23',
      status: 'At-Risk',
      otifScore: 85,
      delayReason: 'Production capacity constraints',
      timeline: [
        {
          event: 'Order Received',
          status: 'completed',
          date: '2024-03-10',
          detail: 'Order validated and confirmed',
          location: 'Order Processing Center',
          assignedTo: 'John Smith',
          progress: 100
        },
        {
          event: 'Production Started',
          status: 'delayed',
          date: '2024-03-18',
          detail: 'Delayed due to capacity constraints',
          location: 'Manufacturing Line B',
          assignedTo: 'Production Team Beta',
          estimatedCompletion: '2024-03-21',
          progress: 30
        },
        {
          event: 'Quality Check',
          status: 'pending',
          date: '2024-03-21',
          location: 'QC Lab',
          assignedTo: 'QC Team',
          estimatedCompletion: '2024-03-22'
        },
        {
          event: 'Shipping',
          status: 'pending',
          date: '2024-03-22',
          location: 'Distribution Center',
          assignedTo: 'Logistics Team',
          estimatedCompletion: '2024-03-23'
        }
      ]
    },
    {
      id: 'ORD-2024-003',
      customer: 'Global Health Solutions',
      product: 'Metformin 850mg Tablets',
      quantity: 75000,
      dueDate: '2024-03-20',
      status: 'Completed',
      otifScore: 100,
      productionBatch: 'B003',
      timeline: [
        {
          event: 'Order Received',
          status: 'completed',
          date: '2024-03-05',
          detail: 'Order validated and confirmed',
          location: 'Order Processing Center',
          assignedTo: 'Emily Wong',
          progress: 100
        },
        {
          event: 'Production Started',
          status: 'completed',
          date: '2024-03-10',
          detail: 'Batch B003 completed',
          location: 'Manufacturing Line C',
          assignedTo: 'Production Team Gamma',
          progress: 100
        },
        {
          event: 'Quality Check',
          status: 'completed',
          date: '2024-03-15',
          detail: 'All specifications met',
          location: 'QC Lab',
          assignedTo: 'QC Team',
          progress: 100
        },
        {
          event: 'Shipping',
          status: 'completed',
          date: '2024-03-18',
          detail: 'Delivered to customer',
          location: 'Distribution Center',
          assignedTo: 'Logistics Team',
          progress: 100
        }
      ]
    }
  ];

  const metrics = {
    otif: 92,
    otifTrend: '+2.5%',
    delayedOrders: 3,
    delayedTrend: '-1',
    averageDelay: '2.3 days',
    delayTrend: '-0.5 days',
    completedOnTime: 28,
    completedTrend: '+5'
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In-Progress':
        return 'bg-blue-100 text-blue-800';
      case 'At-Risk':
        return 'bg-yellow-100 text-yellow-800';
      case 'Delayed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTimelineStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in-progress':
        return 'bg-blue-500';
      case 'pending':
        return 'bg-gray-300';
      case 'delayed':
        return 'bg-red-500';
      default:
        return 'bg-gray-300';
    }
  };

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const openRootCauseAnalysis = (order: Order) => {
    setSelectedOrder(order);
    setShowRootCauseModal(true);
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.product.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = selectedStatus === 'All' || order.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Real-Time Order Tracker</h1>
        <p className="text-sm text-gray-600 mt-1">Monitor order fulfillment and OTIF performance</p>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">OTIF Performance</p>
              <p className="text-2xl font-bold mt-1">{metrics.otif}%</p>
            </div>
            <div className="flex items-center gap-1 text-green-600">
              <ArrowUpRight className="h-4 w-4" />
              <span className="text-sm">{metrics.otifTrend}</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${metrics.otif}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Delayed Orders</p>
              <p className="text-2xl font-bold mt-1">{metrics.delayedOrders}</p>
            </div>
            <div className="flex items-center gap-1 text-green-600">
              <ArrowDownRight className="h-4 w-4" />
              <span className="text-sm">{metrics.delayedTrend}</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Average Delay: {metrics.averageDelay}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed On Time</p>
              <p className="text-2xl font-bold mt-1">{metrics.completedOnTime}</p>
            </div>
            <div className="flex items-center gap-1 text-green-600">
              <ArrowUpRight className="h-4 w-4" />
              <span className="text-sm">{metrics.completedTrend}</span>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span className="text-sm text-gray-600">Last 30 days</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Delivery Performance</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-2xl font-bold">95%</span>
                <span className="text-sm text-gray-500">on schedule</span>
              </div>
            </div>
            <TruckIcon className="h-8 w-8 text-blue-500" />
          </div>
          <div className="mt-4 flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-500" />
            <span className="text-sm text-gray-600">Updated real-time</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow flex flex-wrap gap-4 items-center">
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
          <option value="In-Progress">In Progress</option>
          <option value="At-Risk">At Risk</option>
          <option value="Completed">Completed</option>
          <option value="Delayed">Delayed</option>
        </select>

        <div className="flex-grow">
          <div className="relative">
            <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full border rounded-md px-3 py-1.5 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Export Reports */}
      <OrderReport 
        orders={orders}
        onExport={useCallback((format: 'pdf' | 'csv' | 'excel') => {
          // Here you would typically make an API call to generate the report
          const fileName = `orders-report-${new Date().toISOString().split('T')[0]}`;
          
          switch (format) {
            case 'pdf':
              console.log(`Generating PDF report: ${fileName}.pdf`);
              // Implement PDF generation logic
              break;
            case 'excel':
              console.log(`Generating Excel report: ${fileName}.xlsx`);
              // Implement Excel generation logic
              break;
            case 'csv':
              console.log(`Generating CSV report: ${fileName}.csv`);
              const csvContent = orders.map(order => {
                return [
                  order.id,
                  order.customer,
                  order.product,
                  order.quantity,
                  order.dueDate,
                  order.status,
                  order.otifScore
                ].join(',');
              }).join('\n');
              
              const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
              const link = document.createElement('a');
              link.href = URL.createObjectURL(blob);
              link.download = `${fileName}.csv`;
              link.click();
              break;
          }
        }, [orders])}
      />

      {/* Orders List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Order Status</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredOrders.map((order) => (
            <div key={order.id} className="hover:bg-gray-50">
              <div 
                className="px-6 py-4 cursor-pointer"
                onClick={() => toggleOrderDetails(order.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {expandedOrder === order.id ? (
                      <ChevronUp className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{order.product}</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        Order #{order.id} • {order.customer}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Due Date</p>
                      <p className="font-medium">{order.dueDate}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">OTIF Score</p>
                      <p className={`font-medium ${
                        order.otifScore >= 95 ? 'text-green-600' : 
                        order.otifScore >= 85 ? 'text-yellow-600' : 
                        'text-red-600'
                      }`}>
                        {order.otifScore}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded View */}
              {expandedOrder === order.id && (
                <div className="px-6 pb-4 bg-gray-50">
                  <div className="space-y-4">
                    {/* Order Details */}
                    <div className="grid grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Quantity</p>
                        <p className="font-medium">{order.quantity.toLocaleString()} units</p>
                      </div>
                      {order.productionBatch && (
                        <div>
                          <p className="text-sm text-gray-600">Production Batch</p>
                          <p className="font-medium">{order.productionBatch}</p>
                        </div>
                      )}
                      {order.delayReason && (
                        <div className="col-span-2">
                          <p className="text-sm text-gray-600">Delay Reason</p>
                          <p className="font-medium text-red-600">{order.delayReason}</p>
                        </div>
                      )}
                    </div>

                    {/* Timeline */}
                    <div className="relative">
                      <div className="absolute top-0 left-4 h-full w-0.5 bg-gray-200"></div>
                      <div className="space-y-6 relative">
                        {order.timeline.map((event, index) => (
                          <div key={index} className="flex items-start gap-4">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              getTimelineStatusColor(event.status)
                            }`}>
                              {event.status === 'completed' ? (
                                <CheckCircle2 className="h-5 w-5 text-white" />
                              ) : event.status === 'delayed' ? (
                                <AlertTriangle className="h-5 w-5 text-white" />
                              ) : (
                                <div className="w-2 h-2 bg-white rounded-full" />
                              )}
                            </div>
                            <div>
                              <div className="flex items-center justify-between w-full">
                                <div>
                                  <p className="font-medium text-gray-900">{event.event}</p>
                                  <p className="text-sm text-gray-500">{event.date}</p>
                                  {event.detail && (
                                    <p className="text-sm text-gray-600 mt-1">{event.detail}</p>
                                  )}
                                </div>
                                {event.progress !== undefined && (
                                  <div className="ml-4">
                                    <div className="w-20 bg-gray-200 rounded-full h-2">
                                      <div
                                        className="bg-blue-500 h-2 rounded-full"
                                        style={{ width: `${event.progress}%` }}
                                      ></div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1 text-right">{event.progress}%</p>
                                  </div>
                                )}
                              </div>
                              <div className="mt-2 grid grid-cols-2 gap-4">
                                {event.location && (
                                  <div>
                                    <p className="text-xs text-gray-500">Location</p>
                                    <p className="text-sm">{event.location}</p>
                                  </div>
                                )}
                                {event.assignedTo && (
                                  <div>
                                    <p className="text-xs text-gray-500">Assigned To</p>
                                    <p className="text-sm">{event.assignedTo}</p>
                                  </div>
                                )}
                                {event.estimatedCompletion && (
                                  <div>
                                    <p className="text-xs text-gray-500">Est. Completion</p>
                                    <p className="text-sm">{event.estimatedCompletion}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3">
                      {(order.status === 'At-Risk' || order.status === 'Delayed') && (
                        <button
                          onClick={() => openRootCauseAnalysis(order)}
                          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                        >
                          View Root Cause Analysis
                        </button>
                      )}
                      {order.status !== 'Completed' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOrder(order);
                            setEditedOrder(order);
                            setShowEditModal(true);
                          }}
                          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                        >
                          Modify Order
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Root Cause Analysis Modal */}
      {showRootCauseModal && selectedOrder && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-lg bg-white">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-900">Root Cause Analysis</h3>
              <p className="text-sm text-gray-500">
                Order #{selectedOrder.id} - {selectedOrder.product}
              </p>
            </div>

            <div className="space-y-6">
              {/* Impact Assessment */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Impact Assessment</h4>
                <div className="bg-red-50 border-l-4 border-red-400 p-4">
                  <div className="flex">
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                    <div className="ml-3">
                      <p className="text-sm text-red-700">
                        Estimated {selectedOrder.delayReason?.toLowerCase()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contributing Factors */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Contributing Factors</h4>
                <div className="space-y-2">
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <Package className="h-5 w-5 text-blue-500" />
                      <p className="text-sm">Resource allocation constraints</p>
                    </div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-blue-500" />
                      <p className="text-sm">Schedule optimization needed</p>
                    </div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <BarChart2 className="h-5 w-5 text-blue-500" />
                      <p className="text-sm">Capacity planning improvements required</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Corrective Actions */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Corrective Actions</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <p className="text-sm">Reallocate resources from lower priority orders</p>
                  </div>
                  <div className="flex items-center gap-2 p-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <p className="text-sm">Implement additional production shift</p>
                  </div>
                  <div className="flex items-center gap-2 p-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <p className="text-sm">Review and optimize production schedule</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowRootCauseModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    // Handle implementing corrective actions
                    setShowRootCauseModal(false);
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700"
                >
                  Implement Actions
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Order Modal */}
      {showEditModal && selectedOrder && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-lg bg-white">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-900">Modify Order</h3>
              <p className="text-sm text-gray-500">
                Order #{selectedOrder.id} - {selectedOrder.product}
              </p>
            </div>

            <div className="space-y-6">
              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Quantity
                </label>
                <input
                  type="number"
                  value={editedOrder.quantity || ''}
                  onChange={(e) => setEditedOrder(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Due Date
                </label>
                <input
                  type="date"
                  value={editedOrder.dueDate || ''}
                  onChange={(e) => setEditedOrder(prev => ({ ...prev, dueDate: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              {/* Priority Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Priority Level
                </label>
                <select
                  value={editedOrder.status || ''}
                  onChange={(e) => setEditedOrder(prev => ({ 
                    ...prev, 
                    status: e.target.value as Order['status']
                  }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="In-Progress">In Progress</option>
                  <option value="At-Risk">At Risk</option>
                  <option value="Delayed">Delayed</option>
                </select>
              </div>

              {/* Impact Analysis */}
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <div className="flex">
                  <AlertTriangle className="h-5 w-5 text-yellow-400" />
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      Modifying this order may impact:
                    </p>
                    <ul className="mt-2 text-sm text-yellow-700 list-disc list-inside">
                      <li>Production schedule</li>
                      <li>Resource allocation</li>
                      <li>Delivery timeline</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Here you would typically make an API call to update the order
                    console.log('Updated order:', editedOrder);
                    setShowEditModal(false);
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTracker;
