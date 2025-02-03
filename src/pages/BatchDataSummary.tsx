import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ClipboardCheck, 
  AlertTriangle, 
  FileCheck, 
  UserCheck, 
  ChevronDown, 
  ChevronUp,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  FileText,
  ThermometerIcon,
  Scale,
  Activity
} from 'lucide-react';

interface Parameter {
  id: string;
  name: string;
  value: string | number;
  unit: string;
  timestamp: string;
  operator: string;
  status: 'within-limits' | 'out-of-limits' | 'warning';
  limits?: {
    min: number;
    max: number;
  };
}

interface Deviation {
  id: string;
  type: 'process' | 'equipment' | 'material' | 'other';
  description: string;
  timestamp: string;
  severity: 'minor' | 'major' | 'critical';
  status: 'open' | 'investigated' | 'closed';
  investigator?: string;
  resolution?: string;
}

interface OperatorSignoff {
  step: string;
  operator: string;
  timestamp: string;
  comments: string;
  verified: boolean;
}

const BatchDataSummary = () => {
  const { batchId } = useParams();
  const navigate = useNavigate();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalComment, setApprovalComment] = useState('');
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  // Sample data - In a real app, this would come from an API
  const batchData = {
    id: batchId,
    product: 'Amoxicillin 500mg Tablets',
    startTime: '2024-03-20 08:00:00',
    endTime: '2024-03-20 16:00:00',
    batchSize: 500000,
    status: 'pending-review',
    parameters: [
      {
        id: 'param1',
        name: 'Granulation - Impeller Speed',
        value: 125,
        unit: 'RPM',
        timestamp: '2024-03-20 09:15:00',
        operator: 'John Smith',
        status: 'within-limits',
        limits: { min: 100, max: 150 }
      },
      {
        id: 'param2',
        name: 'Drying - Inlet Temperature',
        value: 62,
        unit: '°C',
        timestamp: '2024-03-20 10:30:00',
        operator: 'John Smith',
        status: 'warning',
        limits: { min: 55, max: 65 }
      },
      {
        id: 'param3',
        name: 'Compression - Main Force',
        value: 18.5,
        unit: 'kN',
        timestamp: '2024-03-20 13:45:00',
        operator: 'Sarah Johnson',
        status: 'within-limits',
        limits: { min: 15, max: 20 }
      }
    ] as Parameter[],
    deviations: [
      {
        id: 'dev1',
        type: 'process',
        description: 'Granulation endpoint slightly exceeded target range',
        timestamp: '2024-03-20 09:45:00',
        severity: 'minor',
        status: 'investigated',
        investigator: 'Technical Services',
        resolution: 'No impact on product quality based on subsequent testing'
      }
    ] as Deviation[],
    operatorSignoffs: [
      {
        step: 'Raw Material Verification',
        operator: 'John Smith',
        timestamp: '2024-03-20 08:00:00',
        comments: 'All materials verified and within specification',
        verified: true
      },
      {
        step: 'Granulation',
        operator: 'John Smith',
        timestamp: '2024-03-20 10:00:00',
        comments: 'Process completed as per SOP',
        verified: true
      },
      {
        step: 'Compression',
        operator: 'Sarah Johnson',
        timestamp: '2024-03-20 14:00:00',
        comments: 'All parameters within specification',
        verified: true
      }
    ] as OperatorSignoff[]
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const getStatusColor = (status: Parameter['status']) => {
    switch (status) {
      case 'within-limits':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'out-of-limits':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDeviationSeverityColor = (severity: Deviation['severity']) => {
    switch (severity) {
      case 'minor':
        return 'bg-yellow-100 text-yellow-800';
      case 'major':
        return 'bg-orange-100 text-orange-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleApprove = () => {
    // In a real app, make API call to approve batch
    console.log('Batch approved with comment:', approvalComment);
    setShowApprovalModal(false);
    // Navigate to confirmation or next step
    navigate('/quality');
  };

  const handleReject = () => {
    // In a real app, make API call to reject batch
    console.log('Batch rejected with reason:', rejectionReason);
    setShowRejectionModal(false);
    // Navigate to confirmation or next step
    navigate('/quality');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Batch Data Summary</h1>
            <p className="text-sm text-gray-600 mt-1">
              Batch #{batchId} • {batchData.product}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowRejectionModal(true)}
              className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 flex items-center gap-2"
            >
              <XCircle className="h-4 w-4" />
              Reject Batch
            </button>
            <button
              onClick={() => setShowApprovalModal(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <CheckCircle2 className="h-4 w-4" />
              Approve for Release
            </button>
          </div>
        </div>
      </div>

      {/* Batch Overview */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Batch Overview</h2>
        <div className="grid grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 text-blue-600 mb-1">
              <Clock className="h-5 w-5" />
              <span className="text-sm font-medium">Duration</span>
            </div>
            <p className="text-lg font-semibold">8 hours</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2 text-green-600 mb-1">
              <Scale className="h-5 w-5" />
              <span className="text-sm font-medium">Batch Size</span>
            </div>
            <p className="text-lg font-semibold">{batchData.batchSize.toLocaleString()} units</p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg">
            <div className="flex items-center gap-2 text-yellow-600 mb-1">
              <AlertTriangle className="h-5 w-5" />
              <span className="text-sm font-medium">Deviations</span>
            </div>
            <p className="text-lg font-semibold">{batchData.deviations.length}</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center gap-2 text-purple-600 mb-1">
              <Activity className="h-5 w-5" />
              <span className="text-sm font-medium">Parameters</span>
            </div>
            <p className="text-lg font-semibold">{batchData.parameters.length} logged</p>
          </div>
        </div>
      </div>

      {/* Process Parameters */}
      <div className="bg-white shadow rounded-lg">
        <div
          className="p-4 border-b flex items-center justify-between cursor-pointer"
          onClick={() => toggleSection('parameters')}
        >
          <div className="flex items-center gap-2">
            <ThermometerIcon className="h-5 w-5 text-blue-500" />
            <h2 className="text-lg font-medium text-gray-900">Process Parameters</h2>
          </div>
          {expandedSection === 'parameters' ? (
            <ChevronUp className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          )}
        </div>
        {expandedSection === 'parameters' && (
          <div className="p-4">
            <div className="space-y-4">
              {batchData.parameters.map(param => (
                <div key={param.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{param.name}</h3>
                      <p className="text-sm text-gray-500">
                        Recorded by {param.operator} at {new Date(param.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(param.status)}`}>
                      {param.status === 'within-limits' ? 'Within Limits' : 
                       param.status === 'warning' ? 'Warning' : 'Out of Limits'}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center gap-8">
                    <div>
                      <p className="text-sm text-gray-600">Value</p>
                      <p className="text-lg font-semibold">{param.value} {param.unit}</p>
                    </div>
                    {param.limits && (
                      <div>
                        <p className="text-sm text-gray-600">Acceptable Range</p>
                        <p className="text-lg font-semibold">
                          {param.limits.min} - {param.limits.max} {param.unit}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Deviations */}
      <div className="bg-white shadow rounded-lg">
        <div
          className="p-4 border-b flex items-center justify-between cursor-pointer"
          onClick={() => toggleSection('deviations')}
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <h2 className="text-lg font-medium text-gray-900">Deviations</h2>
          </div>
          {expandedSection === 'deviations' ? (
            <ChevronUp className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          )}
        </div>
        {expandedSection === 'deviations' && (
          <div className="p-4">
            <div className="space-y-4">
              {batchData.deviations.map(deviation => (
                <div key={deviation.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-gray-900">
                          {deviation.type.charAt(0).toUpperCase() + deviation.type.slice(1)} Deviation
                        </h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          getDeviationSeverityColor(deviation.severity)
                        }`}>
                          {deviation.severity.charAt(0).toUpperCase() + deviation.severity.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Reported at {new Date(deviation.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      deviation.status === 'closed' 
                        ? 'bg-green-100 text-green-800'
                        : deviation.status === 'investigated'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {deviation.status.charAt(0).toUpperCase() + deviation.status.slice(1)}
                    </span>
                  </div>
                  <div className="mt-4 space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Description</p>
                      <p className="text-gray-900">{deviation.description}</p>
                    </div>
                    {deviation.investigator && (
                      <div>
                        <p className="text-sm text-gray-600">Investigator</p>
                        <p className="text-gray-900">{deviation.investigator}</p>
                      </div>
                    )}
                    {deviation.resolution && (
                      <div>
                        <p className="text-sm text-gray-600">Resolution</p>
                        <p className="text-gray-900">{deviation.resolution}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Operator Signoffs */}
      <div className="bg-white shadow rounded-lg">
        <div
          className="p-4 border-b flex items-center justify-between cursor-pointer"
          onClick={() => toggleSection('signoffs')}
        >
          <div className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-green-500" />
            <h2 className="text-lg font-medium text-gray-900">Operator Signoffs</h2>
          </div>
          {expandedSection === 'signoffs' ? (
            <ChevronUp className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          )}
        </div>
        {expandedSection === 'signoffs' && (
          <div className="p-4">
            <div className="space-y-4">
              {batchData.operatorSignoffs.map((signoff, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{signoff.step}</h3>
                      <p className="text-sm text-gray-500">
                        Signed by {signoff.operator} at {new Date(signoff.timestamp).toLocaleString()}
                      </p>
                    </div>
                    {signoff.verified ? (
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                        Verified
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                        Pending
                      </span>
                    )}
                  </div>
                  {signoff.comments && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600">Comments</p>
                      <p className="text-gray-900">{signoff.comments}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Approval Modal */}
      {showApprovalModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-xl shadow-lg rounded-lg bg-white">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-900">Confirm Batch Release</h3>
              <p className="text-sm text-gray-500 mt-1">
                Please review all data and confirm batch release approval
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Approval Comments
                </label>
                <textarea
                  value={approvalComment}
                  onChange={(e) => setApprovalComment(e.target.value)}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Enter any comments regarding the approval..."
                />
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <div className="flex">
                  <AlertTriangle className="h-5 w-5 text-yellow-400" />
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      This action will release the batch for distribution. Please ensure all data has been reviewed thoroughly.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowApprovalModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApprove}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 flex items-center gap-2"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Confirm Release
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {showRejectionModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-xl shadow-lg rounded-lg bg-white">
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-900">Reject Batch</h3>
              <p className="text-sm text-gray-500 mt-1">
                Please provide a reason for rejecting this batch
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Rejection Reason
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Enter the reason for rejection..."
                />
              </div>

              <div className="bg-red-50 border-l-4 border-red-400 p-4">
                <div className="flex">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                  <div className="ml-3">
                    <p className="text-sm text-red-700">
                      This action will mark the batch as rejected and require investigation. This cannot be undone.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowRejectionModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 flex items-center gap-2"
                >
                  <XCircle className="h-4 w-4" />
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BatchDataSummary;