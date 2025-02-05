import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  FileCheck, 
  X, 
  ClipboardCheck, 
  Beaker, 
  FileText, 
  ThumbsUp, 
  ThumbsDown,
  Package,
  BarChart3,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

interface BatchReview {
  id: string;
  step: number;
  comments: string;
  manufacturingCompliance: boolean;
  qualityParameters: boolean;
  documentationComplete: boolean;
  stabilityResults: boolean;
  deviationResolved: boolean;
}

const QualityControl = () => {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null);
  const [review, setReview] = useState<BatchReview>({
    id: '',
    step: 1,
    comments: '',
    manufacturingCompliance: false,
    qualityParameters: false,
    documentationComplete: false,
    stabilityResults: false,
    deviationResolved: false
  });

  const openReviewModal = (batchId: string) => {
    setSelectedBatch(batchId);
    setReview(prev => ({ ...prev, id: batchId, step: 1 }));
    setShowReviewModal(true);
  };

  const closeReviewModal = () => {
    setShowReviewModal(false);
    setSelectedBatch(null);
    setReview({
      id: '',
      step: 1,
      comments: '',
      manufacturingCompliance: false,
      qualityParameters: false,
      documentationComplete: false,
      stabilityResults: false,
      deviationResolved: false
    });
  };

  const handleCheckboxChange = (field: keyof Omit<BatchReview, 'id' | 'step' | 'comments'>) => {
    setReview(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const isStepComplete = () => {
    // All steps are considered complete since we're showing data and using action buttons
    return true;
  };

  const handleNext = () => {
    if (review.step < 4 && isStepComplete()) {
      setReview(prev => ({ ...prev, step: prev.step + 1 }));
    }
  };

  const handleBack = () => {
    if (review.step > 1) {
      setReview(prev => ({ ...prev, step: prev.step - 1 }));
    }
  };

  const handleApprove = () => {
    // Here you would typically make an API call to update the batch status
    console.log('Batch approved:', review);
    closeReviewModal();
  };

  const handleReject = () => {
    // Here you would typically make an API call to update the batch status
    console.log('Batch rejected:', review);
    closeReviewModal();
  };

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
          <button 
            onClick={() => openReviewModal('B001')} 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <ClipboardCheck className="h-5 w-5" />
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

      {/* Batch Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-lg bg-white">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Batch Review - {selectedBatch}</h2>
              <button 
                onClick={closeReviewModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-8">
                {[
                  { step: 1, title: 'Batch Data Review', icon: ClipboardCheck },
                  { step: 2, title: 'Batch Finalization', icon: FileText },
                  { step: 3, title: 'Shipment Readiness', icon: Package },
                  { step: 4, title: 'Post-Production Analysis', icon: BarChart3 }
                ].map((item) => (
                  <div key={item.step} className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2
                      ${review.step === item.step ? 'bg-blue-500' : 
                        review.step > item.step ? 'bg-green-500' : 'bg-gray-300'}`}>
                      <item.icon className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-sm text-gray-600">{item.title}</span>
                  </div>
                ))}
              </div>

              {/* Step Content */}
              <div className="space-y-6">
                {review.step === 1 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Batch Data Review</h3>
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <h4 className="font-medium mb-2">Logged Parameters</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Temperature</p>
                          <p className="font-medium">25°C ± 0.5°C</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">pH Level</p>
                          <p className="font-medium">7.2 ± 0.1</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Pressure</p>
                          <p className="font-medium">2.1 bar</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Yield</p>
                          <p className="font-medium">98.5%</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <h4 className="font-medium mb-2">Deviations</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Total Deviations</span>
                          <span className="font-medium">2</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Critical</span>
                          <span className="font-medium text-red-600">0</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Major</span>
                          <span className="font-medium text-yellow-600">1</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Minor</span>
                          <span className="font-medium text-green-600">1</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setReview(prev => ({ ...prev, step: 2 }))}
                      className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Approve for Release
                    </button>
                  </div>
                )}

                {review.step === 2 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Batch Finalization</h3>
                    <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
                      <div className="flex">
                        <CheckCircle2 className="h-6 w-6 text-green-400" />
                        <div className="ml-3">
                          <p className="text-sm text-green-700">
                            Batch status changed to "Released"
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <button
                        onClick={() => console.log('Generating batch report...')}
                        className="w-full bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2"
                      >
                        <FileText className="h-5 w-5" />
                        Generate Batch Report
                      </button>
                      <button
                        onClick={() => setReview(prev => ({ ...prev, step: 3 }))}
                        className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                      >
                        <AlertTriangle className="h-5 w-5" />
                        Notify Supply Chain
                      </button>
                    </div>
                  </div>
                )}

                {review.step === 3 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Shipment Readiness</h3>
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                      <div className="flex">
                        <Package className="h-6 w-6 text-blue-400" />
                        <div className="ml-3">
                          <p className="text-sm text-blue-700">
                            Batch status updated as "Ready for Shipment"
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <button
                        onClick={() => console.log('Confirming shipment...')}
                        className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="h-5 w-5" />
                        Confirm Shipment
                      </button>
                      <button
                        onClick={() => setReview(prev => ({ ...prev, step: 4 }))}
                        className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                      >
                        <TrendingUp className="h-5 w-5" />
                        Track Logistics
                      </button>
                    </div>
                  </div>
                )}

                {review.step === 4 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Post-Production Analysis</h3>
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <h4 className="font-medium mb-2">Performance Metrics</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">On-Time Completion</span>
                          <span className="font-medium text-green-600">98%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Quality Compliance</span>
                          <span className="font-medium text-green-600">100%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Resource Utilization</span>
                          <span className="font-medium text-yellow-600">85%</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <button
                        onClick={() => console.log('Viewing root cause analysis...')}
                        className="w-full bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2"
                      >
                        <AlertCircle className="h-5 w-5" />
                        View Root Cause Analysis
                      </button>
                      <button
                        onClick={handleApprove}
                        className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                      >
                        <BarChart3 className="h-5 w-5" />
                        Optimize Future Schedules
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation Buttons */}
              {review.step < 4 && (
                <div className="flex justify-end space-x-4 mt-6">
                  {review.step > 1 && (
                    <button
                      onClick={handleBack}
                      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Back
                    </button>
                  )}
                  <button
                    onClick={handleNext}
                    disabled={!isStepComplete()}
                    className={`px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white
                      ${isStepComplete()
                        ? 'bg-blue-600 hover:bg-blue-700'
                        : 'bg-gray-400 cursor-not-allowed'}`}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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
                    <button 
                      onClick={() => openReviewModal(batch.id)}
                      className="text-blue-600 hover:text-blue-800"
                    >
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
