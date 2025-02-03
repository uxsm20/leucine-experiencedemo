import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, ArrowRight, Clock, BarChart2, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';

interface WorkOrder {
  id: string;
  product: string;
  quantity: number;
  startTime: string;
  endTime: string;
  line: string;
  operator: string;
  status: 'pending' | 'in-progress' | 'completed';
}

interface ResourceUtilization {
  resource: string;
  type: 'machine' | 'labor';
  utilization: number;
  schedule: {
    time: string;
    task: string;
  }[];
}

const MasterSchedule = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState('2024-03-20');
  const [selectedView, setSelectedView] = useState<'timeline' | 'resource'>('timeline');

  // Sample work orders
  const workOrders: WorkOrder[] = [
    {
      id: 'WO001',
      product: 'Product A',
      quantity: 500,
      startTime: '08:00',
      endTime: '12:00',
      line: 'Line 1',
      operator: 'John Smith',
      status: 'in-progress'
    },
    {
      id: 'WO002',
      product: 'Product B',
      quantity: 300,
      startTime: '13:00',
      endTime: '17:00',
      line: 'Line 1',
      operator: 'Sarah Johnson',
      status: 'pending'
    },
    {
      id: 'WO003',
      product: 'Product C',
      quantity: 750,
      startTime: '08:00',
      endTime: '16:00',
      line: 'Line 2',
      operator: 'Mike Wilson',
      status: 'pending'
    }
  ];

  // Sample resource utilization data
  const resources: ResourceUtilization[] = [
    {
      resource: 'Production Line 1',
      type: 'machine',
      utilization: 85,
      schedule: [
        { time: '08:00-12:00', task: 'Product A Production' },
        { time: '13:00-17:00', task: 'Product B Production' }
      ]
    },
    {
      resource: 'Production Line 2',
      type: 'machine',
      utilization: 60,
      schedule: [
        { time: '08:00-16:00', task: 'Product C Production' }
      ]
    },
    {
      resource: 'Operator Team A',
      type: 'labor',
      utilization: 90,
      schedule: [
        { time: '08:00-12:00', task: 'Line 1 Operation' },
        { time: '13:00-17:00', task: 'Line 1 Operation' }
      ]
    },
    {
      resource: 'Operator Team B',
      type: 'labor',
      utilization: 75,
      schedule: [
        { time: '08:00-16:00', task: 'Line 2 Operation' }
      ]
    }
  ];

  const timeSlots = Array.from({ length: 9 }, (_, i) => {
    const hour = i + 8;
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Master Production Schedule</h1>
            <p className="text-sm text-gray-600">Manage and publish production schedules</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/master-schedule/publish')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Review & Publish
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* Schedule Controls */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-500" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border rounded-md px-3 py-1.5 text-sm"
              />
            </div>
            <div className="flex rounded-lg border">
              <button
                onClick={() => setSelectedView('timeline')}
                className={`px-4 py-2 text-sm font-medium ${
                  selectedView === 'timeline'
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Timeline View
              </button>
              <button
                onClick={() => setSelectedView('resource')}
                className={`px-4 py-2 text-sm font-medium ${
                  selectedView === 'resource'
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Resource View
              </button>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Timeline View */}
      {selectedView === 'timeline' && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <Clock className="h-5 w-5 text-gray-500" />
              Production Timeline
            </h2>
          </div>
          <div className="p-4">
            <div className="relative">
              {/* Time indicators */}
              <div className="grid grid-cols-9 gap-4 mb-4 ml-40">
                {timeSlots.map(time => (
                  <div key={time} className="text-sm text-gray-500">
                    {time}
                  </div>
                ))}
              </div>

              {/* Production lines */}
              {['Line 1', 'Line 2'].map((line, lineIndex) => (
                <div key={line} className="relative h-20 mb-4">
                  <div className="absolute left-0 top-0 w-36 h-full flex items-center">
                    <span className="text-sm font-medium text-gray-900">{line}</span>
                  </div>
                  <div className="ml-40 h-full bg-gray-100 rounded-lg relative">
                    {workOrders
                      .filter(wo => wo.line === line)
                      .map(wo => {
                        const startHour = parseInt(wo.startTime.split(':')[0]);
                        const endHour = parseInt(wo.endTime.split(':')[0]);
                        const startPosition = ((startHour - 8) / 9) * 100;
                        const width = ((endHour - startHour) / 9) * 100;

                        return (
                          <div
                            key={wo.id}
                            className={`absolute top-2 bottom-2 rounded-lg ${
                              wo.status === 'in-progress' 
                                ? 'bg-blue-500' 
                                : 'bg-blue-200'
                            }`}
                            style={{
                              left: `${startPosition}%`,
                              width: `${width}%`
                            }}
                          >
                            <div className="p-2 text-xs text-white">
                              <div className="font-medium">{wo.product}</div>
                              <div>{wo.quantity} units</div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Resource View */}
      {selectedView === 'resource' && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <BarChart2 className="h-5 w-5 text-gray-500" />
              Resource Utilization
            </h2>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 gap-4">
              {resources.map(resource => (
                <div key={resource.resource} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="font-medium text-gray-900">{resource.resource}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        {resource.type === 'machine' ? (
                          <Clock className="h-4 w-4 text-gray-500" />
                        ) : (
                          <Users className="h-4 w-4 text-gray-500" />
                        )}
                        <span className="text-sm text-gray-500">
                          {resource.type === 'machine' ? 'Machine' : 'Labor'} Resource
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        {resource.utilization}%
                      </div>
                      <div className="text-sm text-gray-500">Utilization</div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div
                      className={`h-2 rounded-full ${
                        resource.utilization > 90
                          ? 'bg-red-500'
                          : resource.utilization > 75
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                      }`}
                      style={{ width: `${resource.utilization}%` }}
                    ></div>
                  </div>
                  <div className="space-y-2">
                    {resource.schedule.map((slot, index) => (
                      <div key={index} className="flex items-center gap-4 text-sm">
                        <span className="text-gray-500">{slot.time}</span>
                        <span className="font-medium text-gray-900">{slot.task}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MasterSchedule;