import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, TrendingUp, Package, AlertCircle, Calendar, Filter, ChevronDown, ChevronUp, X, AlertTriangle, LineChart } from 'lucide-react';

interface ProductionRequest {
  product: string;
  quantity: number;
  dueDate: string;
  priority: 'Normal' | 'Urgent' | 'Critical';
  instructions: string;
}

const SupplyChainDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState('2024-03');
  const [selectedFacility, setSelectedFacility] = useState('All Facilities');
  const [selectedProductType, setSelectedProductType] = useState('All Products');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showTrendModal, setShowTrendModal] = useState(false);
  const [selectedTrendProduct, setSelectedTrendProduct] = useState<string | null>(null);

  const [request, setRequest] = useState<ProductionRequest>({
    product: '',
    quantity: 0,
    dueDate: '',
    priority: 'Normal',
    instructions: ''
  });

  const [formErrors, setFormErrors] = useState<Partial<ProductionRequest>>({});

  const facilities = ['All Facilities', 'Facility A', 'Facility B', 'Facility C'];
  const productTypes = ['All Products', 'Raw Materials', 'Finished Goods', 'Packaging'];
  const products = [
    'Amoxicillin 500mg Tablets',
    'Lisinopril 10mg Tablets',
    'Metformin 850mg Tablets'
  ];
  const priorities = ['Normal', 'Urgent', 'Critical'] as const;

  const forecastData = [
    {
      product: 'Amoxicillin 500mg Tablets',
      forecast: 1000000,
      confidence: 'High',
      stock: 300000,
      need: 700000,
      status: 'On Track',
      marketShare: '35%',
      leadTime: '21 days',
      minBatchSize: 100000,
      lastOrder: '2024-02-15',
      reorderPoint: 250000,
      safetyStock: 150000,
      averageDemand: 80000,
      demandVariability: 'Low',
      seasonalityImpact: 'Medium',
      supplierReliability: '98%'
    },
    {
      product: 'Lisinopril 10mg Tablets',
      forecast: 500000,
      confidence: 'Medium',
      stock: 50000,
      need: 450000,
      status: 'At Risk',
      marketShare: '28%',
      leadTime: '28 days',
      minBatchSize: 50000,
      lastOrder: '2024-02-20',
      reorderPoint: 100000,
      safetyStock: 75000,
      averageDemand: 45000,
      demandVariability: 'Medium',
      seasonalityImpact: 'Low',
      supplierReliability: '95%'
    },
    {
      product: 'Metformin 850mg Tablets',
      forecast: 750000,
      confidence: 'High',
      stock: 400000,
      need: 350000,
      status: 'On Track',
      marketShare: '42%',
      leadTime: '25 days',
      minBatchSize: 75000,
      lastOrder: '2024-02-25',
      reorderPoint: 200000,
      safetyStock: 100000,
      averageDemand: 65000,
      demandVariability: 'Low',
      seasonalityImpact: 'Low',
      supplierReliability: '99%'
    }
  ];

  const toggleProductDetails = (product: string) => {
    setExpandedProduct(expandedProduct === product ? null : product);
  };

  const openRequestModal = (product?: string) => {
    if (product) {
      setRequest(prev => ({ ...prev, product }));
    }
    setShowRequestModal(true);
  };

  const closeRequestModal = () => {
    setShowRequestModal(false);
    setRequest({
      product: '',
      quantity: 0,
      dueDate: '',
      priority: 'Normal',
      instructions: ''
    });
    setFormErrors({});
  };

  const validateForm = (): boolean => {
    const errors: Partial<ProductionRequest> = {};
    
    if (!request.product) {
      errors.product = 'Product is required';
    }
    if (!request.quantity || request.quantity <= 0) {
      errors.quantity = 'Quantity must be greater than 0';
    }
    if (!request.dueDate) {
      errors.dueDate = 'Due date is required';
    } else {
      const today = new Date();
      const selectedDate = new Date(request.dueDate);
      if (selectedDate < today) {
        errors.dueDate = 'Due date cannot be in the past';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        closeRequestModal();
        setTimeout(() => {
          navigate('/production', { 
            state: { 
              newRequest: request,
              submitSuccess: true 
            }
          });
        }, 100);
      } catch (error) {
        console.error('Error submitting request:', error);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRequest(prev => ({ ...prev, [name]: value }));
    if (formErrors[name as keyof ProductionRequest]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const openTrendModal = (product: string) => {
    setSelectedTrendProduct(product);
    setShowTrendModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Supply Chain Forecast</h1>
          <p className="text-sm text-gray-600 mt-1">Plan and manage production requests based on demand forecasts</p>
        </div>
        <button 
          onClick={() => openRequestModal()}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Package className="h-5 w-5" />
          Create Production Request
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filters:</span>
        </div>
        
        <select 
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="border rounded-md px-3 py-1.5 text-sm"
        >
          <option value="2024-03">March 2024</option>
          <option value="2024-04">April 2024</option>
          <option value="2024-05">May 2024</option>
        </select>

        <select
          value={selectedFacility}
          onChange={(e) => setSelectedFacility(e.target.value)}
          className="border rounded-md px-3 py-1.5 text-sm"
        >
          {facilities.map(facility => (
            <option key={facility} value={facility}>{facility}</option>
          ))}
        </select>

        <select
          value={selectedProductType}
          onChange={(e) => setSelectedProductType(e.target.value)}
          className="border rounded-md px-3 py-1.5 text-sm"
        >
          {productTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: 'Forecast Accuracy', value: '87%', trend: '+2.3%', icon: BarChart3, color: 'bg-green-500' },
          { title: 'Open Requests', value: '12', trend: '-3 vs last month', icon: Package, color: 'bg-blue-500' },
          { title: 'Demand Trend', value: '+15%', trend: 'vs last quarter', icon: TrendingUp, color: 'bg-purple-500' },
          { title: 'Stock Coverage', value: '45 days', trend: 'Target: 60 days', icon: AlertCircle, color: 'bg-amber-500' },
        ].map((kpi) => (
          <div key={kpi.title} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <div className={`${kpi.color} p-3 rounded-lg`}>
                <kpi.icon className="h-6 w-6 text-white" />
              </div>
              <span className="text-sm text-gray-500">{kpi.trend}</span>
            </div>
            <p className="text-sm text-gray-600">{kpi.title}</p>
            <p className="text-2xl font-bold mt-1">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Detailed Forecast Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Demand Forecast Details</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Forecast Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Confidence Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Production Need
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
              {forecastData.map((item) => (
                <React.Fragment key={item.product}>
                  <tr className="hover:bg-gray-50 cursor-pointer" onClick={() => toggleProductDetails(item.product)}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center gap-2">
                      {expandedProduct === item.product ? (
                        <ChevronUp className="h-4 w-4 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      )}
                      {item.product}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.forecast.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${item.confidence === 'High' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {item.confidence}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.stock.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.need.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${item.status === 'On Track' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          openRequestModal(item.product);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Create Request
                      </button>
                    </td>
                  </tr>
                  {expandedProduct === item.product && (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 bg-gray-50">
                        <div className="space-y-6">
                          {/* Supply Chain Metrics */}
                          <div className="grid grid-cols-3 gap-6">
                            <div className="bg-white p-4 rounded-lg border">
                              <h4 className="text-sm font-medium text-gray-900 mb-4">Inventory Metrics</h4>
                              <div className="space-y-3">
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600">Safety Stock</span>
                                  <span className="text-sm font-medium">{item.safetyStock.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600">Reorder Point</span>
                                  <span className="text-sm font-medium">{item.reorderPoint.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600">Min Batch Size</span>
                                  <span className="text-sm font-medium">{item.minBatchSize.toLocaleString()}</span>
                                </div>
                              </div>
                            </div>

                            <div className="bg-white p-4 rounded-lg border">
                              <h4 className="text-sm font-medium text-gray-900 mb-4">Demand Analysis</h4>
                              <div className="space-y-3">
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600">Average Monthly Demand</span>
                                  <span className="text-sm font-medium">{item.averageDemand.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600">Market Share</span>
                                  <span className="text-sm font-medium">{item.marketShare}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600">Seasonality Impact</span>
                                  <span className="text-sm font-medium">{item.seasonalityImpact}</span>
                                </div>
                              </div>
                            </div>

                            <div className="bg-white p-4 rounded-lg border">
                              <h4 className="text-sm font-medium text-gray-900 mb-4">Supply Chain Performance</h4>
                              <div className="space-y-3">
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600">Lead Time</span>
                                  <span className="text-sm font-medium">{item.leadTime}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600">Supplier Reliability</span>
                                  <span className="text-sm font-medium">{item.supplierReliability}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600">Demand Variability</span>
                                  <span className="text-sm font-medium">{item.demandVariability}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex justify-end gap-3">
                            <button
                              onClick={() => openTrendModal(item.product)}
                              className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 flex items-center gap-2"
                            >
                              <LineChart className="h-4 w-4" />
                              View Detailed Trends
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openRequestModal(item.product);
                              }}
                              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                            >
                              Create Production Request
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

      {/* Production Request Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-lg bg-white">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Create Production Request</h2>
              <button 
                onClick={closeRequestModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Product Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product
                </label>
                <select
                  name="product"
                  value={request.product}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm
                    ${formErrors.product ? 'border-red-300' : 'border-gray-300'}`}
                >
                  <option value="">Select a product</option>
                  {products.map(product => (
                    <option key={product} value={product}>{product}</option>
                  ))}
                </select>
                {formErrors.product && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.product}</p>
                )}
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity Required
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={request.quantity}
                  onChange={handleInputChange}
                  min="1"
                  className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm
                    ${formErrors.quantity ? 'border-red-300' : 'border-gray-300'}`}
                />
                {formErrors.quantity && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.quantity}</p>
                )}
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Requested Due Date
                </label>
                <input
                  type="date"
                  name="dueDate"
                  value={request.dueDate}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm
                    ${formErrors.dueDate ? 'border-red-300' : 'border-gray-300'}`}
                />
                {formErrors.dueDate && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.dueDate}</p>
                )}
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority Level
                </label>
                <div className="mt-1 grid grid-cols-3 gap-3">
                  {priorities.map((priority) => (
                    <div
                      key={priority}
                      onClick={() => setRequest(prev => ({ ...prev, priority }))}
                      className={`
                        cursor-pointer rounded-lg border p-2 text-center text-sm font-medium
                        ${request.priority === priority
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 text-gray-900 hover:bg-gray-50'
                        }
                      `}
                    >
                      {priority}
                    </div>
                  ))}
                </div>
              </div>

              {/* Special Instructions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Special Instructions
                </label>
                <textarea
                  name="instructions"
                  value={request.instructions}
                  onChange={handleInputChange}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Add any special requirements or notes..."
                />
              </div>

              {/* Feasibility Check Notice */}
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <div className="flex">
                  <AlertTriangle className="h-5 w-5 text-yellow-400" />
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      Upon submission, this request will be evaluated for feasibility based on current capacity and resources.
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeRequestModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Trend Analysis Modal */}
      {showTrendModal && selectedTrendProduct && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-lg bg-white">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Trend Analysis</h2>
                <p className="text-sm text-gray-600">{selectedTrendProduct}</p>
              </div>
              <button
                onClick={() => setShowTrendModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Trend Metrics */}
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: 'YoY Growth', value: '+12.5%', trend: 'positive' },
                  { label: 'Market Share', value: '35%', trend: 'stable' },
                  { label: 'Forecast Accuracy', value: '92%', trend: 'positive' },
                  { label: 'Demand Stability', value: 'High', trend: 'stable' }
                ].map((metric) => (
                  <div key={metric.label} className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">{metric.label}</p>
                    <p className="text-xl font-bold mt-1">{metric.value}</p>
                  </div>
                ))}
              </div>

              {/* Trend Visualization */}
              <div className="bg-white p-6 rounded-lg border">
                <h3 className="text-lg font-medium mb-4">12-Month Demand Trend</h3>
                <div className="h-64 bg-gray-50 rounded-lg flex items-end justify-between p-4">
                  {/* Placeholder for actual chart */}
                  {Array.from({ length: 12 }).map((_, index) => (
                    <div
                      key={index}
                      className="w-12 bg-blue-500 rounded-t"
                      style={{
                        height: `${Math.random() * 60 + 20}%`,
                        opacity: 0.7 + (index / 20)
                      }}
                    />
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-sm text-gray-600">
                  <span>Mar 2023</span>
                  <span>Feb 2024</span>
                </div>
              </div>

              {/* Analysis Details */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Key Insights</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <div className="mt-1 w-2 h-2 rounded-full bg-blue-500" />
                      <span className="text-sm">Consistent growth trend over the past 6 months</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="mt-1 w-2 h-2 rounded-full bg-blue-500" />
                      <span className="text-sm">Seasonal peak expected in Q3</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="mt-1 w-2 h-2 rounded-full bg-blue-500" />
                      <span className="text-sm">Market share has increased by 5% YoY</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Recommendations</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <div className="mt-1 w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-sm">Increase safety stock by 20% before Q3</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="mt-1 w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-sm">Review supplier capacity for peak demand</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="mt-1 w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-sm">Consider additional production shifts</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplyChainDashboard;