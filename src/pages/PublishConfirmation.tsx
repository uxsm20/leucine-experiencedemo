import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, Send, Users, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface Workstation {
  id: string;
  name: string;
  operator: string;
  tasks: {
    id: string;
    product: string;
    quantity: number;
    startTime: string;
    endTime: string;
  }[];
}

const PublishConfirmation = () => {
  const navigate = useNavigate();
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const workstations: Workstation[] = [
    {
      id: 'ws1',
      name: 'Workstation 1',
      operator: 'John Smith',
      tasks: [
        {
          id: 't1',
          product: 'Product A',
          quantity: 500,
          startTime: '08:00',
          endTime: '12:00'
        },
        {
          id: 't2',
          product: 'Product B',
          quantity: 300,
          startTime: '13:00',
          endTime: '17:00'
        }
      ]
    },
    {
      id: 'ws2',
      name: 'Workstation 2',
      operator: 'Sarah Johnson',
      tasks: [
        {
          id: 't3',
          product: 'Product C',
          quantity: 750,
          startTime: '08:00',
          endTime: '16:00'
        }
      ]
    }
  ];

  const handlePublish = () => {
    setShowSuccessModal(true);
    // In a real application, you would make an API call here
  };

  const handleConfirmPublish = () => {
    setShowSuccessModal(false);
    navigate('/master-schedule');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/master-schedule')}
          className="text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Publish Production Schedule</h1>
          <p className="text-sm text-gray-600">Review and confirm schedule before publishing to operators</p>
        </div>
      </div>

      {/* Notice */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div className="flex">
          <AlertTriangle className="h-5 w-5 text-yellow-400" />
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              Publishing this schedule will notify all affected operators and update their work queues.
              Please review carefully before confirming.
            </p>
          </div>
        </div>
      </div>

      {/* Workstations */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
            <Users className="h-5 w-5 text-gray-500" />
            Affected Workstations
          </h2>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 gap-6">
            {workstations.map(station => (
              <div key={station.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="font-medium text-gray-900">{station.name}</h3>
                    <p className="text-sm text-gray-500">Operator: {station.operator}</p>
                  </div>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {station.tasks.length} tasks
                  </span>
                </div>
                <div className="space-y-3">
                  {station.tasks.map(task => (
                    <div key={task.id} className="bg-gray-50 rounded-lg p-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Product</p>
                          <p className="font-medium">{task.product}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Quantity</p>
                          <p className="font-medium">{task.quantity}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Start Time</p>
                          <p className="font-medium">{task.startTime}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">End Time</p>
                          <p className="font-medium">{task.endTime}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Notification Preview */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
            <Bell className="h-5 w-5 text-gray-500" />
            Notification Preview
          </h2>
        </div>
        <div className="p-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">To:</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {workstations.map(station => (
                    <span key={station.id} className="px-2 py-1 bg-gray-200 rounded-full text-xs">
                      {station.operator}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Subject:</p>
                <p className="text-sm font-medium mt-1">New Production Schedule Available</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Message:</p>
                <div className="mt-1 text-sm bg-white border rounded-lg p-3">
                  A new production schedule has been published for March 20, 2024.
                  Please review your assigned tasks and prepare accordingly.
                  The schedule includes updated work orders and timing for your workstation.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <button
          onClick={() => navigate('/master-schedule')}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
        >
          Back to Schedule
        </button>
        <button
          onClick={handlePublish}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 flex items-center gap-2"
        >
          <Send className="h-4 w-4" />
          Confirm & Publish
        </button>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-lg bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg leading-6 font-medium text-gray-900 mt-4">
                Schedule Published Successfully
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  All operators have been notified and their work queues have been updated.
                </p>
              </div>
              <div className="mt-4 space-y-3">
                <button
                  onClick={() => navigate('/operator-dashboard')}
                  className="w-full px-4 py-2 bg-blue-600 text-white text-base font-medium rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  Go to Operator Dashboard
                </button>
                <button
                  onClick={handleConfirmPublish}
                  className="w-full px-4 py-2 bg-white text-blue-600 text-base font-medium rounded-lg border border-blue-300 shadow-sm hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  Return to Schedule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublishConfirmation;