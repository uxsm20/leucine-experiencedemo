import React, { useState } from 'react';
import { 
  MessageSquare, 
  Users, 
  TrendingUp, 
  Lightbulb,
  ThumbsUp,
  ThumbsDown,
  BarChart2,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  Star
} from 'lucide-react';

interface Feedback {
  id: string;
  type: 'Customer' | 'Internal';
  batchId?: string;
  category: string;
  title: string;
  description: string;
  submittedBy: string;
  submittedAt: string;
  status: 'New' | 'Under Review' | 'Implemented' | 'Declined';
  priority: 'Low' | 'Medium' | 'High';
  impact?: string;
  resolution?: string;
  rating?: number;
  tags: string[];
}

const FeedbackPortal = () => {
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);

  const feedbackItems: Feedback[] = [
    {
      id: 'FB-2024-001',
      type: 'Customer',
      batchId: 'B001',
      category: 'Product Quality',
      title: 'Improved Tablet Coating Consistency',
      description: 'Recent batches show excellent coating uniformity. Significant improvement from previous deliveries.',
      submittedBy: 'MedCare Hospitals',
      submittedAt: '2024-03-20',
      status: 'New',
      priority: 'High',
      rating: 4,
      tags: ['Quality', 'Coating', 'Improvement']
    },
    {
      id: 'FB-2024-002',
      type: 'Internal',
      category: 'Process Optimization',
      title: 'Streamline Quality Check Process',
      description: 'Suggestion to implement automated quality checks for routine parameters to reduce manual testing time.',
      submittedBy: 'Sarah Chen',
      submittedAt: '2024-03-19',
      status: 'Under Review',
      priority: 'Medium',
      impact: 'Could reduce QC time by 30%',
      tags: ['Automation', 'Efficiency', 'Quality Control']
    }
  ];

  const metrics = {
    customerSatisfaction: 92,
    feedbackResolutionRate: 85,
    averageResponseTime: '2.3 days',
    implementedSuggestions: 28
  };

  const getStatusColor = (status: Feedback['status']) => {
    switch (status) {
      case 'Implemented':
        return 'bg-green-100 text-green-800';
      case 'Under Review':
        return 'bg-blue-100 text-blue-800';
      case 'New':
        return 'bg-yellow-100 text-yellow-800';
      case 'Declined':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: Feedback['priority']) => {
    switch (priority) {
      case 'High':
        return 'text-red-600';
      case 'Medium':
        return 'text-yellow-600';
      case 'Low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const filteredItems = feedbackItems.filter(item => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.submittedBy.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = selectedType === 'All' || item.type === selectedType;
    const matchesStatus = selectedStatus === 'All' || item.status === selectedStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Feedback & Continuous Improvement Portal</h1>
        <p className="text-sm text-gray-600 mt-1">Collect and track customer feedback and internal improvement suggestions</p>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Customer Satisfaction</p>
              <p className="text-2xl font-bold mt-1">{metrics.customerSatisfaction}%</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <ThumbsUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${metrics.customerSatisfaction}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Resolution Rate</p>
              <p className="text-2xl font-bold mt-1">{metrics.feedbackResolutionRate}%</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <CheckCircle2 className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4">Target: 90%</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. Response Time</p>
              <p className="text-2xl font-bold mt-1">{metrics.averageResponseTime}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4">Target: 2 days</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Implemented Ideas</p>
              <p className="text-2xl font-bold mt-1">{metrics.implementedSuggestions}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Lightbulb className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4">Last 30 days</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filters:</span>
        </div>
        
        <select 
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="border rounded-md px-3 py-1.5 text-sm"
        >
          <option value="All">All Types</option>
          <option value="Customer">Customer Feedback</option>
          <option value="Internal">Internal Suggestions</option>
        </select>

        <select 
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="border rounded-md px-3 py-1.5 text-sm"
        >
          <option value="All">All Status</option>
          <option value="New">New</option>
          <option value="Under Review">Under Review</option>
          <option value="Implemented">Implemented</option>
          <option value="Declined">Declined</option>
        </select>

        <div className="flex-grow">
          <div className="relative">
            <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search feedback..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full border rounded-md px-3 py-1.5 text-sm"
            />
          </div>
        </div>

        <button
          onClick={() => setShowFeedbackModal(true)}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <MessageSquare className="h-4 w-4" />
          Submit Feedback
        </button>
      </div>

      {/* Feedback List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Feedback & Suggestions</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredItems.map((item) => (
            <div key={item.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-gray-900">{item.title}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                    {item.type === 'Customer' && (
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, index) => (
                          <Star
                            key={index}
                            className={`h-4 w-4 ${
                              index < (item.rating || 0)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {item.id} • {item.submittedBy} • {item.submittedAt}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{item.description}</p>
                  {item.impact && (
                    <p className="text-sm text-blue-600 mt-2">
                      Expected Impact: {item.impact}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {item.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Priority</p>
                    <p className={`font-medium ${getPriorityColor(item.priority)}`}>
                      {item.priority}
                    </p>
                  </div>
                  {item.type === 'Internal' && (
                    <button
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                    >
                      <TrendingUp className="h-4 w-4" />
                      View Analysis
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Submit Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-lg bg-white">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-900">Submit Feedback</h3>
              <p className="text-sm text-gray-500">
                Share your feedback or improvement suggestion
              </p>
            </div>

            <div className="space-y-6">
              {/* Form fields would go here */}
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowFeedbackModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowFeedbackModal(false)}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackPortal;
