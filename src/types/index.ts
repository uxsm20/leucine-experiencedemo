export interface ProductionRequest {
  id: string;
  product: string;
  quantity: number;
  requestedDueDate: Date;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'scheduled' | 'in-progress' | 'completed' | 'rejected';
  committedDate?: Date;
}

export interface Batch {
  id: string;
  productionRequestId: string;
  startTime: Date;
  endTime: Date;
  status: 'pending' | 'in-progress' | 'completed' | 'qa-review' | 'released';
  operatorId?: string;
  deviations: Deviation[];
  steps: BatchStep[];
}

export interface Deviation {
  id: string;
  batchId: string;
  type: 'temperature' | 'quality' | 'machine' | 'other';
  description: string;
  timestamp: Date;
  status: 'open' | 'reviewed' | 'closed';
}

export interface BatchStep {
  id: string;
  name: string;
  status: 'pending' | 'in-progress' | 'completed';
  data: Record<string, any>;
  completedAt?: Date;
  completedBy?: string;
}