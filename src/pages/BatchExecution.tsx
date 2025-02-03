import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, AlertTriangle, FileText, ChevronRight, XCircle, Clock, Calendar, Play, Pause, Square } from 'lucide-react';

interface Step {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  sop: string;
  parameters: {
    name: string;
    type: 'number' | 'text' | 'checkbox';
    label: string;
    required: boolean;
    value?: string | number | boolean;
    validation?: {
      min?: number;
      max?: number;
      pattern?: string;
    };
  }[];
}

const BatchExecution = () => {
  const { batchId } = useParams();
  const navigate = useNavigate();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showSOP, setShowSOP] = useState(false);
  const [parameterValues, setParameterValues] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [batchStartTime] = useState<string>('2024-03-20 08:00:00');
  const [elapsedTime, setElapsedTime] = useState<string>('00:00:00');
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [timerStatus, setTimerStatus] = useState<'stopped' | 'running' | 'paused'>('stopped');

  const steps: Step[] = [
    {
      id: 'step1',
      name: 'Raw Material Verification',
      description: 'Verify and document all raw materials according to specifications',
      status: 'in-progress',
      sop: 'SOP-RM-001',
      parameters: [
        {
          name: 'amoxicillin_weight',
          type: 'number',
          label: 'Amoxicillin API Weight (kg)',
          required: true,
          validation: { min: 9.8, max: 10.2 }
        },
        {
          name: 'batch_number',
          type: 'text',
          label: 'API Batch Number',
          required: true,
          validation: { pattern: '^[A-Z]{2}\\d{6}$' }
        },
        {
          name: 'container_integrity',
          type: 'checkbox',
          label: 'Container Integrity Verified',
          required: true
        }
      ]
    },
    {
      id: 'step2',
      name: 'Granulation',
      description: 'Wet granulation process for tablet manufacturing',
      status: 'pending',
      sop: 'SOP-GR-002',
      parameters: [
        {
          name: 'impeller_speed',
          type: 'number',
          label: 'Impeller Speed (RPM)',
          required: true,
          validation: { min: 100, max: 150 }
        },
        {
          name: 'granulation_time',
          type: 'number',
          label: 'Granulation Time (minutes)',
          required: true,
          validation: { min: 15, max: 20 }
        },
        {
          name: 'binder_addition_rate',
          type: 'number',
          label: 'Binder Addition Rate (mL/min)',
          required: true,
          validation: { min: 40, max: 60 }
        }
      ]
    },
    {
      id: 'step3',
      name: 'Drying',
      description: 'Fluid bed drying of granulated material',
      status: 'pending',
      sop: 'SOP-DR-003',
      parameters: [
        {
          name: 'inlet_temperature',
          type: 'number',
          label: 'Inlet Temperature (°C)',
          required: true,
          validation: { min: 55, max: 65 }
        },
        {
          name: 'exhaust_temperature',
          type: 'number',
          label: 'Exhaust Temperature (°C)',
          required: true,
          validation: { min: 35, max: 45 }
        },
        {
          name: 'moisture_content',
          type: 'number',
          label: 'Final Moisture Content (%)',
          required: true,
          validation: { min: 1.5, max: 2.5 }
        }
      ]
    },
    {
      id: 'step4',
      name: 'Blending',
      description: 'Blending of dried granules with extra-granular materials',
      status: 'pending',
      sop: 'SOP-BL-004',
      parameters: [
        {
          name: 'blending_speed',
          type: 'number',
          label: 'Blender Speed (RPM)',
          required: true,
          validation: { min: 10, max: 15 }
        },
        {
          name: 'blending_time',
          type: 'number',
          label: 'Blending Time (minutes)',
          required: true,
          validation: { min: 10, max: 15 }
        },
        {
          name: 'blend_uniformity',
          type: 'number',
          label: 'Blend Uniformity RSD (%)',
          required: true,
          validation: { min: 0, max: 5 }
        }
      ]
    },
    {
      id: 'step5',
      name: 'Compression',
      description: 'Tablet compression process',
      status: 'pending',
      sop: 'SOP-CP-005',
      parameters: [
        {
          name: 'compression_force',
          type: 'number',
          label: 'Main Compression Force (kN)',
          required: true,
          validation: { min: 15, max: 20 }
        },
        {
          name: 'tablet_hardness',
          type: 'number',
          label: 'Tablet Hardness (kP)',
          required: true,
          validation: { min: 8, max: 14 }
        },
        {
          name: 'tablet_weight',
          type: 'number',
          label: 'Average Tablet Weight (mg)',
          required: true,
          validation: { min: 570, max: 630 }
        },
        {
          name: 'tablet_thickness',
          type: 'number',
          label: 'Tablet Thickness (mm)',
          required: true,
          validation: { min: 4.5, max: 4.8 }
        }
      ]
    }
  ];

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (isTimerActive && timerStatus === 'running') {
      timer = setInterval(() => {
        const start = new Date(batchStartTime).getTime();
        const now = new Date().getTime();
        const elapsed = now - start;
        
        const hours = Math.floor(elapsed / (1000 * 60 * 60));
        const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((elapsed % (1000 * 60)) / 1000);
        
        setElapsedTime(
          `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        );
      }, 1000);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [batchStartTime, isTimerActive, timerStatus]);

  const handleStartTimer = () => {
    setIsTimerActive(true);
    setTimerStatus('running');
  };

  const handlePauseTimer = () => {
    setTimerStatus('paused');
  };

  const handleStopTimer = () => {
    setIsTimerActive(false);
    setTimerStatus('stopped');
    setElapsedTime('00:00:00');
  };

  const handleCompleteStep = () => {
    if (currentStepIndex === steps.length - 1) {
      // When the last step is completed, navigate to the batch data summary
      navigate(`/batch-data-summary/${batchId}`);
    } else {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Batch Execution</h1>
            <p className="text-sm text-gray-600 mt-1">
              Batch #{batchId} • Amoxicillin 500mg Tablets
            </p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-sm text-gray-600">Start Time</p>
              <p className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gray-500" />
                {new Date(batchStartTime).toLocaleString()}
              </p>
            </div>
            <div className="bg-blue-50 px-4 py-2 rounded-lg">
              <div className="flex items-center justify-between gap-4 mb-2">
                <p className="text-sm text-blue-600">Elapsed Time</p>
                <div className="flex gap-2">
                  {timerStatus === 'stopped' && (
                    <button
                      onClick={handleStartTimer}
                      className="p-1 hover:bg-blue-100 rounded"
                      title="Start Timer"
                    >
                      <Play className="h-4 w-4 text-blue-600" />
                    </button>
                  )}
                  {timerStatus === 'running' && (
                    <>
                      <button
                        onClick={handlePauseTimer}
                        className="p-1 hover:bg-blue-100 rounded"
                        title="Pause Timer"
                      >
                        <Pause className="h-4 w-4 text-blue-600" />
                      </button>
                      <button
                        onClick={handleStopTimer}
                        className="p-1 hover:bg-blue-100 rounded"
                        title="Stop Timer"
                      >
                        <Square className="h-4 w-4 text-blue-600" />
                      </button>
                    </>
                  )}
                  {timerStatus === 'paused' && (
                    <>
                      <button
                        onClick={handleStartTimer}
                        className="p-1 hover:bg-blue-100 rounded"
                        title="Resume Timer"
                      >
                        <Play className="h-4 w-4 text-blue-600" />
                      </button>
                      <button
                        onClick={handleStopTimer}
                        className="p-1 hover:bg-blue-100 rounded"
                        title="Stop Timer"
                      >
                        <Square className="h-4 w-4 text-blue-600" />
                      </button>
                    </>
                  )}
                </div>
              </div>
              <p className="text-2xl font-bold text-blue-700 flex items-center gap-2">
                <Clock className="h-5 w-5" />
                {elapsedTime}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Status: {timerStatus.charAt(0).toUpperCase() + timerStatus.slice(1)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex items-center">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex items-center">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full border-2
                    ${index === currentStepIndex
                      ? 'border-blue-500 bg-blue-50 text-blue-500'
                      : step.status === 'completed'
                      ? 'border-green-500 bg-green-50 text-green-500'
                      : 'border-gray-300 text-gray-500'
                    }`}
                >
                  {step.status === 'completed' ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <span
                  className={`ml-2 text-sm font-medium
                    ${index === currentStepIndex
                      ? 'text-blue-500'
                      : step.status === 'completed'
                      ? 'text-green-500'
                      : 'text-gray-500'
                    }`}
                >
                  {step.name}
                </span>
              </div>
              {index < steps.length - 1 && (
                <ChevronRight className="w-5 h-5 mx-4 text-gray-400" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Current Step */}
      <div className="bg-white shadow rounded-lg divide-y">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-lg font-medium text-gray-900">{steps[currentStepIndex].name}</h2>
              <p className="mt-1 text-sm text-gray-600">{steps[currentStepIndex].description}</p>
            </div>
            <button
              onClick={() => setShowSOP(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
            >
              <FileText className="w-4 h-4" />
              View SOP
            </button>
          </div>

          {/* Parameters Form */}
          <div className="mt-6 space-y-6">
            {steps[currentStepIndex].parameters.map(param => (
              <div key={param.name}>
                <label className="block text-sm font-medium text-gray-700">
                  {param.label}
                  {param.required && <span className="text-red-500">*</span>}
                </label>
                <div className="mt-1">
                  {param.type === 'checkbox' ? (
                    <input
                      type="checkbox"
                      checked={!!parameterValues[param.name]}
                      onChange={e => setParameterValues(prev => ({
                        ...prev,
                        [param.name]: e.target.checked
                      }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  ) : (
                    <input
                      type={param.type}
                      value={parameterValues[param.name] || ''}
                      onChange={e => setParameterValues(prev => ({
                        ...prev,
                        [param.name]: e.target.value
                      }))}
                      className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm
                        ${errors[param.name]
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                        }`}
                    />
                  )}
                  {errors[param.name] && (
                    <p className="mt-1 text-sm text-red-600">{errors[param.name]}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-6 py-4 bg-gray-50 flex justify-between items-center">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-yellow-500 mr-2" />
            <span className="text-sm text-gray-600">
              All entries will be permanently recorded in the batch record
            </span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setCurrentStepIndex(prev => Math.max(0, prev - 1))}
              disabled={currentStepIndex === 0}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={handleCompleteStep}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700"
            >
              {currentStepIndex === steps.length - 1 ? 'Complete Batch' : 'Next Step'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchExecution;