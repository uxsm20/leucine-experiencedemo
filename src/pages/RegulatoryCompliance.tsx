import React, { useState } from 'react';
import { 
  ClipboardCheck, 
  FileCheck, 
  History, 
  AlertTriangle, 
  CheckCircle2, 
  FileText,
  Search,
  Filter,
  Download,
  ExternalLink
} from 'lucide-react';

interface ComplianceItem {
  id: string;
  batchId: string;
  product: string;
  status: 'Pending' | 'Submitted' | 'Approved' | 'Needs Review';
  dueDate: string;
  lastUpdated: string;
  documents: {
    name: string;
    status: 'Complete' | 'Incomplete' | 'Not Required';
    lastUpdated: string;
  }[];
  auditTrail: {
    action: string;
    user: string;
    timestamp: string;
    details: string;
  }[];
}

const RegulatoryCompliance = () => {
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ComplianceItem | null>(null);

  const complianceItems: ComplianceItem[] = [
    {
      id: 'REG-2024-001',
      batchId: 'B001',
      product: 'Amoxicillin 500mg Tablets',
      status: 'Pending',
      dueDate: '2024-03-25',
      lastUpdated: '2024-03-20',
      documents: [
        {
          name: 'Batch Production Record',
          status: 'Complete',
          lastUpdated: '2024-03-19'
        },
        {
          name: 'Quality Control Tests',
          status: 'Complete',
          lastUpdated: '2024-03-19'
        },
        {
          name: 'Stability Data',
          status: 'Incomplete',
          lastUpdated: '2024-03-18'
        }
      ],
      auditTrail: [
        {
          action: 'Document Upload',
          user: 'Sarah Chen',
          timestamp: '2024-03-19 14:30',
          details: 'Uploaded Batch Production Record'
        },
        {
          action: 'Status Update',
          user: 'QA System',
          timestamp: '2024-03-19 14:35',
          details: 'Automated quality check passed'
        }
      ]
    },
    {
      id: 'REG-2024-002',
      batchId: 'B002',
      product: 'Lisinopril 10mg Tablets',
      status: 'Submitted',
      dueDate: '2024-03-23',
      lastUpdated: '2024-03-21',
      documents: [
        {
          name: 'Batch Production Record',
          status: 'Complete',
          lastUpdated: '2024-03-20'
        },
        {
          name: 'Quality Control Tests',
          status: 'Complete',
          lastUpdated: '2024-03-20'
        },
        {
          name: 'Stability Data',
          status: 'Complete',
          lastUpdated: '2024-03-21'
        }
      ],
      auditTrail: [
        {
          action: 'Submission',
          user: 'John Smith',
          timestamp: '2024-03-21 10:15',
          details: 'Regulatory submission completed'
        }
      ]
    }
  ];

  const getStatusColor = (status: ComplianceItem['status']) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Submitted':
        return 'bg-blue-100 text-blue-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Needs Review':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDocumentStatusColor = (status: string) => {
    switch (status) {
      case 'Complete':
        return 'text-green-600';
      case 'Incomplete':
        return 'text-yellow-600';
      case 'Not Required':
        return 'text-gray-400';
      default:
        return 'text-gray-600';
    }
  };

  const filteredItems = complianceItems.filter(item => {
    const matchesSearch = 
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.batchId.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = selectedStatus === 'All' || item.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  const openAuditTrail = (item: ComplianceItem) => {
    setSelectedItem(item);
    setShowAuditModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Regulatory Compliance Dashboard</h1>
        <p className="text-sm text-gray-600 mt-1">Manage and track regulatory documentation and submissions</p>
      </div>

      {/* Compliance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Documentation Readiness</p>
              <p className="text-2xl font-bold mt-1">92%</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <FileCheck className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: '92%' }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Submissions</p>
              <p className="text-2xl font-bold mt-1">3</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4">Due within 7 days</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Approved Submissions</p>
              <p className="text-2xl font-bold mt-1">28</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <CheckCircle2 className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4">Last 30 days</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Compliance Rate</p>
              <p className="text-2xl font-bold mt-1">100%</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <ClipboardCheck className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4">All requirements met</p>
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
          <option value="Pending">Pending</option>
          <option value="Submitted">Submitted</option>
          <option value="Approved">Approved</option>
          <option value="Needs Review">Needs Review</option>
        </select>

        <div className="flex-grow">
          <div className="relative">
            <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by ID, product, or batch..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full border rounded-md px-3 py-1.5 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Compliance Items List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Regulatory Documentation</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredItems.map((item) => (
            <div key={item.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{item.product}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Regulatory ID: {item.id} • Batch: {item.batchId}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Due Date</p>
                    <p className="font-medium">{item.dueDate}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Last Updated</p>
                    <p className="font-medium">{item.lastUpdated}</p>
                  </div>
                </div>
              </div>

              {/* Document List */}
              <div className="mt-4 space-y-3">
                {item.documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className={`h-5 w-5 ${getDocumentStatusColor(doc.status)}`} />
                      <span className="text-sm text-gray-700">{doc.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`text-sm ${getDocumentStatusColor(doc.status)}`}>
                        {doc.status}
                      </span>
                      <span className="text-sm text-gray-500">
                        {doc.lastUpdated}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => openAuditTrail(item)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                >
                  <History className="h-4 w-4" />
                  View Audit Trail
                </button>
                {item.status === 'Pending' && (
                  <button
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Submit to Regulatory
                  </button>
                )}
                <button
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download Package
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Audit Trail Modal */}
      {showAuditModal && selectedItem && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-lg bg-white">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-900">Audit Trail</h3>
              <p className="text-sm text-gray-500">
                {selectedItem.product} - {selectedItem.batchId}
              </p>
            </div>

            <div className="space-y-6">
              <div className="relative">
                <div className="absolute top-0 left-4 h-full w-0.5 bg-gray-200"></div>
                <div className="space-y-6 relative">
                  {selectedItem.auditTrail.map((event, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                        <History className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{event.action}</p>
                        <p className="text-sm text-gray-500">{event.timestamp}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          {event.user} - {event.details}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setShowAuditModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegulatoryCompliance;
