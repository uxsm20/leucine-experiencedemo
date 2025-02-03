import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AlertTriangle, Calendar, Clock, Package, ArrowLeft, Check, XCircle, AlertCircle, Send, Bell } from 'lucide-react';

interface ProductionLine {
  id: string;
  name: string;
  capacity: number;
  currentLoad: number;
  schedule: ScheduleSlot[];
}

interface ScheduleSlot {
  id: string;
  requestId: string;
  product: string;
  startTime: string;
  endTime: string;
  quantity: number;
}

interface MaterialAvailability {
  material: string;
  available: number;
  required: number;
  status: 'available' | 'partial' | 'unavailable';
  expectedDate?: string;
}

const SchedulingView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const request = location.state?.request;
  
  const [selectedLine, setSelectedLine] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [showImpactAnalysis, setShowImpactAnalysis] = useState(false);
  const [showCommitmentModal, setShowCommitmentModal] = useState(false);
  const [committedDate, setCommittedDate] = useState('2024-03-21');
  const [notificationPreview, setNotificationPreview] = useState({
    to: ['Supply Chain Manager', 'Production Supervisor'],
    message: `Production request #${request?.id} has been scheduled for completion on March 21, 2024. 
              Product: ${request?.product}
              Quantity: ${request?.quantity}
              Line: Production Line 1`
  });

  const [timeSlots] = useState(() => {
    const slots = [];
    for (let hour = 8; hour <= 17; hour++) {
      slots.push({
        time: `${hour.toString().padStart(2, '0')}:00`,
        hour
      });
    }
    return slots;
  });

  const [draggedTask, setDraggedTask] = useState<{
    id: string;
    duration: number;
    product: string;
    quantity: number;
  } | null>(null);

  const [scheduledTasks, setScheduledTasks] = useState<{
    id: string;
    lineId: string;
    startHour: number;
    duration: number;
    product: string;
    quantity: number;
  }[]>([]);

  const [unscheduledTasks, setUnscheduledTasks] = useState([
    {
      id: request.id,
      product: request.product,
      quantity: request.quantity,
      duration: 4,
      priority: request.priority,
      dueDate: request.requestedDate
    },
    {
      id: 'PR-LSP-2024-002',
      product: 'Lisinopril 10mg Tablets',
      quantity: 500000,
      duration: 6,
      priority: 'Critical',
      dueDate: '2024-03-28'
    },
    {
      id: 'PR-MTF-2024-003',
      product: 'Metformin 850mg Tablets',
      quantity: 750000,
      duration: 8,
      priority: 'Normal',
      dueDate: '2024-04-01'
    },
    {
      id: 'PR-ASP-2024-004',
      product: 'Aspirin 100mg Tablets',
      quantity: 300000,
      duration: 3,
      priority: 'Urgent',
      dueDate: '2024-03-25'
    }
  ]);

  const handleDragStart = (task: typeof draggedTask) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e: React.DragEvent, lineId: string, hour: number) => {
    e.preventDefault();
    const target = e.currentTarget as HTMLElement;
    target.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
  };

  const handleDragLeave = (e: React.DragEvent) => {
    const target = e.currentTarget as HTMLElement;
    target.style.backgroundColor = '';
  };

  const handleDrop = (e: React.DragEvent, lineId: string, hour: number) => {
    e.preventDefault();
    const target = e.currentTarget as HTMLElement;
    target.style.backgroundColor = '';

    if (!draggedTask) return;

    const conflictingTask = scheduledTasks.find(task => 
      task.lineId === lineId && 
      ((hour >= task.startHour && hour < task.startHour + task.duration) ||
       (hour + draggedTask.duration > task.startHour && hour < task.startHour + task.duration))
    );

    if (conflictingTask) {
      alert('This time slot is not available');
      return;
    }

    // Add task to scheduled tasks
    setScheduledTasks(prev => [...prev, {
      ...draggedTask,
      lineId,
      startHour: hour
    }]);

    // Remove task from unscheduled tasks
    setUnscheduledTasks(prev => prev.filter(task => task.id !== draggedTask.id));

    setDraggedTask(null);
  };

  const getTaskStyle = (task: typeof scheduledTasks[0]) => {
    const startPosition = ((task.startHour - 8) / 9) * 100;
    const width = (task.duration / 9) * 100;
    // Add max-width to prevent overflow
    const maxWidth = 100 - startPosition;
    return {
      left: `${startPosition}%`,
      width: `${Math.min(width, maxWidth)}%`
    };
  };

  // Sample production lines data
  const productionLines: ProductionLine[] = [
    {
      id: 'line1',
      name: 'Production Line 1',
      capacity: 1000,
      currentLoad: 600,
      schedule: [
        {
          id: 'slot1',
          requestId: 'REQ001',
          product: 'Product A',
          startTime: '2024-03-20 08:00',
          endTime: '2024-03-20 16:00',
          quantity: 500
        }
      ]
    },
    {
      id: 'line2',
      name: 'Production Line 2',
      capacity: 800,
      currentLoad: 400,
      schedule: []
    }
  ];

  // Sample materials availability
  const materials: MaterialAvailability[] = [
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
      status: 'available'
    }
  ];

  const handleLineSelect = (lineId: string) => {
    setSelectedLine(lineId);
    setSelectedSlot('default-slot');
  };

  const handleConfirmSchedule = () => {
    if (!selectedLine || !selectedSlot) {
      return;
    }

    setShowImpactAnalysis(true);
  };

  const handleFinalConfirmation = () => {
    setShowImpactAnalysis(false);
    setShowCommitmentModal(true);
  };

  const handleCommitment = () => {
    navigate('/production', { 
      state: { 
        scheduleSuccess: true,
        requestId: request?.id 
      }
    });
  };

  if (!request) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <XCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <p className="text-sm text-red-700">
                No request data found. Please select a request from the production queue.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/production')}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Schedule Production Request</h1>
            <p className="text-sm text-gray-600">#{request.id} - {request.product}</p>
          </div>
        </div>
      </div>

      {/* Request Details Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Request Details</h2>
        <div className="grid grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-500">Quantity</p>
            <p className="text-lg font-medium">{request.quantity}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Due Date</p>
            <p className="text-lg font-medium">{request.requestedDate}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Priority</p>
            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
              ${request.priority === 'Critical' ? 'bg-red-100 text-red-800' : 
                request.priority === 'Urgent' ? 'bg-orange-100 text-orange-800' : 
                'bg-blue-100 text-blue-800'}`}>
              {request.priority}
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-500">Requester</p>
            <p className="text-lg font-medium">{request.requester}</p>
          </div>
        </div>
      </div>

      {/* Production Lines and Schedule */}
      <div className="grid grid-cols-12 gap-6">
        {/* Production Lines List */}
        <div className="col-span-3 bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h2 className="text-lg font-medium text-gray-900">Production Lines</h2>
          </div>
          <div className="p-4 space-y-4">
            {productionLines.map(line => (
              <div
                key={line.id}
                onClick={() => handleLineSelect(line.id)}
                className={`p-4 rounded-lg border cursor-pointer transition-colors
                  ${selectedLine === line.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:bg-gray-50'}`}
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-gray-900">{line.name}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full
                    ${line.currentLoad / line.capacity > 0.8 
                      ? 'bg-red-100 text-red-800'
                      : line.currentLoad / line.capacity > 0.5
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'}`}>
                    {Math.round((line.currentLoad / line.capacity) * 100)}% Loaded
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      line.currentLoad / line.capacity > 0.8 
                        ? 'bg-red-500'
                        : line.currentLoad / line.capacity > 0.5
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                    }`}
                    style={{ width: `${(line.currentLoad / line.capacity) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* Unscheduled Tasks */}
          <div className="p-4 border-t">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Unscheduled Tasks</h3>
            <div className="space-y-2">
              {unscheduledTasks.map(task => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={() => handleDragStart({
                    id: task.id,
                    duration: task.duration,
                    product: task.product,
                    quantity: task.quantity
                  })}
                  className="p-3 bg-blue-50 border border-blue-200 rounded-lg cursor-move hover:bg-blue-100"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-sm font-medium text-blue-900">{task.product}</div>
                      <div className="text-xs text-blue-700">
                        {task.quantity.toLocaleString()} units • {task.duration} hours
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      task.priority === 'Critical' 
                        ? 'bg-red-100 text-red-800'
                        : task.priority === 'Urgent'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-blue-100 text-blue-800'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    Due: {task.dueDate}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Schedule Timeline */}
        <div className="col-span-9 bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h2 className="text-lg font-medium text-gray-900">Production Schedule</h2>
          </div>
          <div className="p-4">
            {selectedLine ? (
              <div className="space-y-4">
                <div className="flex gap-4 items-center">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <select className="border rounded-md px-3 py-1.5 text-sm">
                    <option>March 2024</option>
                    <option>April 2024</option>
                  </select>
                </div>
                
                {/* Timeline Grid */}
                <div className="relative">
                  {/* Time indicators */}
                  <div className="grid grid-cols-10 gap-0 mb-4 ml-40">
                    {timeSlots.map(slot => (
                      <div key={slot.time} className="text-sm text-gray-500 text-center">
                        {slot.time}
                      </div>
                    ))}
                  </div>

                  {/* Production lines */}
                  {productionLines.map(line => (
                    <div key={line.id} className="relative h-20 mb-4">
                      <div className="absolute left-0 top-0 w-36 h-full flex items-center">
                        <span className="text-sm font-medium text-gray-900">{line.name}</span>
                      </div>
                      <div className="ml-40 h-full bg-gray-50 rounded-lg relative">
                        {/* Time slots for drag and drop */}
                        <div className="absolute inset-0 grid grid-cols-10 gap-0">
                          {timeSlots.map(slot => (
                            <div
                              key={`${line.id}-${slot.time}`}
                              className="h-full border-r border-gray-200 last:border-r-0"
                              onDragOver={(e) => handleDragOver(e, line.id, slot.hour)}
                              onDragLeave={handleDragLeave}
                              onDrop={(e) => handleDrop(e, line.id, slot.hour)}
                            />
                          ))}
                        </div>

                        {/* Scheduled tasks */}
                        {scheduledTasks
                          .filter(task => task.lineId === line.id)
                          .map(task => (
                            <div
                              key={task.id}
                              className="absolute top-2 bottom-2 bg-blue-500 rounded-lg"
                              style={getTaskStyle(task)}
                            >
                              <div className="p-2 text-xs text-white">
                                <div className="font-medium">{task.product}</div>
                                <div>{task.quantity} units</div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Suggested Slot */}
                <div className="border rounded-lg p-4 bg-blue-50 border-blue-200">
                  <h3 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Suggested Production Slot
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-blue-700">Start Time</p>
                      <p className="font-medium">March 21, 2024 08:00</p>
                    </div>
                    <div>
                      <p className="text-sm text-blue-700">End Time</p>
                      <p className="font-medium">March 21, 2024 16:00</p>
                    </div>
                    <div>
                      <p className="text-sm text-blue-700">Duration</p>
                      <p className="font-medium">8 hours</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                Select a production line to view and modify schedule
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Materials Availability */}
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
                      Available: {material.available.toLocaleString()} / Required: {material.required.toLocaleString()}
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
                    className={`h-2 rounded-full transition-all duration-300 ${
                      material.status === 'available'
                        ? 'bg-green-500'
                        : material.status === 'partial'
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                    }`}
                    style={{ 
                      width: `${Math.min((material.available / material.required) * 100, 100)}%`
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <button
          onClick={() => navigate('/production')}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handleConfirmSchedule}
          disabled={!selectedLine || !selectedSlot}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 disabled:bg-blue-300"
        >
          Confirm Schedule
        </button>
      </div>

      {/* Impact Analysis Modal */}
      {showImpactAnalysis && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-lg bg-white">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-900">Schedule Impact Analysis</h2>
            </div>

            <div className="space-y-4">
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <div className="flex">
                  <AlertTriangle className="h-5 w-5 text-yellow-400" />
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      Scheduling this request will have the following impacts:
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-orange-500" />
                    <p className="text-sm">REQ002 will be delayed by 2 hours</p>
                  </div>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-blue-500" />
                    <p className="text-sm">Material delivery schedule needs adjustment</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => setShowImpactAnalysis(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                >
                  Review Changes
                </button>
                <button
                  onClick={handleFinalConfirmation}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 flex items-center gap-2"
                >
                  <Check className="h-4 w-4" />
                  Confirm Anyway
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Commitment Confirmation Modal */}
      {showCommitmentModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-lg bg-white">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900">Confirm Production Commitment</h2>
              <p className="text-sm text-gray-600 mt-1">
                Review and confirm the production schedule commitment
              </p>
            </div>

            <div className="space-y-6">
              {/* Scheduled Details */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-md font-medium text-blue-900 mb-3">Scheduled Production Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-blue-700">Product</p>
                    <p className="font-medium">{request?.product}</p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-700">Quantity</p>
                    <p className="font-medium">{request?.quantity}</p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-700">Production Line</p>
                    <p className="font-medium">Production Line 1</p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-700">Requested Due Date</p>
                    <p className="font-medium">{request?.requestedDate}</p>
                  </div>
                </div>
              </div>

              {/* Committed Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Committed Completion Date
                </label>
                <input
                  type="date"
                  value={committedDate}
                  onChange={(e) => setCommittedDate(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              {/* Notification Preview */}
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-2 flex items-center gap-2">
                  <Bell className="h-5 w-5 text-gray-500" />
                  Notification Preview
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div>
                    <p className="text-sm text-gray-600">To:</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {notificationPreview.to.map(recipient => (
                        <span key={recipient} className="px-2 py-1 bg-gray-200 rounded-full text-xs">
                          {recipient}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Message:</p>
                    <p className="text-sm mt-1 whitespace-pre-line">
                      {notificationPreview.message}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowCommitmentModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                >
                  Back to Schedule
                </button>
                <button
                  onClick={handleCommitment}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 flex items-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  Commit & Notify
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchedulingView;