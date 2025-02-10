import React, { useState } from 'react';
import { 
  Archive, 
  Search, 
  Filter,
  Download,
  Calendar,
  BarChart2,
  FileText,
  History,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface ArchivedBatch {
  id: string;
  product: string;
  manufacturingDate: string;
  expiryDate: string;
  status: 'Released' | 'Rejected' | 'Under Investigation';
  quantity: number;
  location: string;
  approvedBy: string;
  approvalDate: string;
  documents: {
    name: string;
    type: string;
    size: string;
    lastAccessed: string;
  }[];
  trends: {
    parameter: string;
    value: number;
    unit: string;
    trend: 'up' | 'down' | 'stable';
  }[];
}

const BatchArchive = () => {
  const [selectedYear, setSelectedYear] = useState<string>('2024');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedBatch, setExpandedBatch] = useState<string | null>(null);
  const [showTrendsModal, setShowTrendsModal] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<ArchivedBatch | null>(null);

  const archivedBatches: ArchivedBatch[] = [
    {
      id: 'B001-2024',
      product: 'Amoxicillin 500mg Tablets',
      manufacturingDate: '2024-01-15',
      expiryDate: '2026-01-15',
      status: 'Released',
      quantity: 100000,
      location: 'Archive Facility A',
      approvedBy: 'Sarah Chen',
      approvalDate: '2024-01-20',
      documents: [
        {
          name: 'Batch Production Record',
          type: 'PDF',
          size: '2.5 MB',
          lastAccessed: '2024-03-15'
        },
        {
          name: 'Quality Control Data',
          type: 'XLSX',
          size: '1.8 MB',
          lastAccessed: '2024-03-15'
        }
      ],
      trends: [
        {
          parameter: 'Dissolution Rate',
          value: 95.5,
          unit: '%',
          trend: 'up'
        },
        {
          parameter: 'Content Uniformity',
          value: 98.2,
          unit: '%',
          trend: 'stable'
        }
      ]
    },
    {
      id: 'B002-2024',
      product: 'Lisinopril 10mg Tablets',
      manufacturingDate: '2024-02-01',
      expiryDate: '2026-02-01',
      status: 'Released',
      quantity: 75000,
      location: 'Archive Facility B',
      approvedBy: 'John Smith',
      approvalDate: '2024-02-05',
      documents: [
        {
          name: 'Batch Production Record',
          type: 'PDF',
          size: '2.2 MB',
          lastAccessed: '2024-03-10'
        },
        {
          name: 'Stability Data',
          type: 'XLSX',
          size: '1.5 MB',
          lastAccessed: '2024-03-10'
        }
      ],
      trends: [
        {
          parameter: 'Assay',
          value: 99.1,
          unit: '%',
          trend: 'stable'
        },
        {
          parameter: 'Moisture Content',
          value: 2.3,
          unit: '%',
          trend: 'down'
        }
      ]
    }
  ];

  const metrics = {
    totalBatches: 156,
    totalVolume: '15.6M units',
    averageRetentionTime: '5.2 years',
    dataIntegrity: '99.99%'
  };

  const getStatusColor = (status: ArchivedBatch['status']) => {
    switch (status) {
      case 'Released':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      case 'Under Investigation':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingUp className="h-4 w-4 text-red-500 transform rotate-180" />;
      case 'stable':
        return <TrendingUp className="h-4 w-4 text-blue-500 transform rotate-90" />;
    }
  };

  const filteredBatches = archivedBatches.filter(batch => {
    const matchesSearch = 
      batch.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      batch.product.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = selectedStatus === 'All' || batch.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Batch Data Archive</h1>
        <p className="text-sm text-gray-600 mt-1">Access and analyze historical batch production data</p>
      </div>

      {/* Archive Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Archived Batches</p>
              <p className="text-2xl font-bold mt-1">{metrics.totalBatches}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Archive className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4">Last 5 years</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Production Volume</p>
              <p className="text-2xl font-bold mt-1">{metrics.totalVolume}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <BarChart2 className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4">Archived batches</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. Retention Time</p>
              <p className="text-2xl font-bold mt-1">{metrics.averageRetentionTime}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <History className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4">Per batch</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Data Integrity</p>
              <p className="text-2xl font-bold mt-1">{metrics.dataIntegrity}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <CheckCircle2 className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4">Validation rate</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filters:</span>
        </div>
        
        <select 
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="border rounded-md px-3 py-1.5 text-sm"
        >
          <option value="2024">2024</option>
          <option value="2023">2023</option>
          <option value="2022">2022</option>
          <option value="2021">2021</option>
          <option value="2020">2020</option>
        </select>

        <select 
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="border rounded-md px-3 py-1.5 text-sm"
        >
          <option value="All">All Status</option>
          <option value="Released">Released</option>
          <option value="Rejected">Rejected</option>
          <option value="Under Investigation">Under Investigation</option>
        </select>

        <div className="flex-grow">
          <div className="relative">
            <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search batches..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full border rounded-md px-3 py-1.5 text-sm"
            />
          </div>
        </div>

        <button
          onClick={() => {}}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <TrendingUp className="h-4 w-4" />
          Generate Trends Report
        </button>
      </div>

      {/* Archived Batches List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Archived Batches</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredBatches.map((batch) => (
            <div key={batch.id} className="hover:bg-gray-50">
              <div 
                className="px-6 py-4 cursor-pointer"
                onClick={() => setExpandedBatch(expandedBatch === batch.id ? null : batch.id)}
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
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(batch.status)}`}>
                          {batch.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        Batch {batch.id} • {batch.location}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Manufacturing Date</p>
                      <p className="font-medium">{batch.manufacturingDate}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Expiry Date</p>
                      <p className="font-medium">{batch.expiryDate}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded View */}
              {expandedBatch === batch.id && (
                <div className="px-6 pb-4 bg-gray-50">
                  <div className="space-y-4">
                    {/* Batch Details */}
                    <div className="grid grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Quantity</p>
                        <p className="font-medium">{batch.quantity.toLocaleString()} units</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Approved By</p>
                        <p className="font-medium">{batch.approvedBy}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Approval Date</p>
                        <p className="font-medium">{batch.approvalDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Storage Location</p>
                        <p className="font-medium">{batch.location}</p>
                      </div>
                    </div>

                    {/* Documents */}
                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-gray-900 mb-3">Archived Documents</h3>
                      <div className="space-y-2">
                        {batch.documents.map((doc, index) => (
                          <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg">
                            <div className="flex items-center gap-3">
                              <FileText className="h-5 w-5 text-blue-500" />
                              <div>
                                <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                                <p className="text-xs text-gray-500">{doc.type} • {doc.size}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-sm text-gray-500">
                                Last accessed: {doc.lastAccessed}
                              </span>
                              <button className="text-blue-600 hover:text-blue-700">
                                <Download className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Trends */}
                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-gray-900 mb-3">Key Parameters</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {batch.trends.map((trend, index) => (
                          <div key={index} className="bg-white p-3 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-gray-900">{trend.parameter}</p>
                                <p className="text-lg font-bold">
                                  {trend.value} {trend.unit}
                                </p>
                              </div>
                              {getTrendIcon(trend.trend)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 mt-6">
                      <button
                        onClick={() => {
                          setSelectedBatch(batch);
                          setShowTrendsModal(true);
                        }}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                      >
                        <BarChart2 className="h-4 w-4" />
                        View Detailed Trends
                      </button>
                      <button
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Download Complete Data
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Trends Modal */}
      {showTrendsModal && selectedBatch && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-lg bg-white">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-900">Historical Trends Analysis</h3>
              <p className="text-sm text-gray-500">
                {selectedBatch.product} - Batch {selectedBatch.id}
              </p>
            </div>

            <div className="space-y-6">
              {/* Trend visualization would go here */}
              <div className="flex justify-end">
                <button
                  onClick={() => setShowTrendsModal(false)}
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

export default BatchArchive;
