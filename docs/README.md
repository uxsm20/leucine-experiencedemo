# Manufacturing Execution System (MES) Documentation

This document provides an overview of the MES system modules and their functionalities.

## System Overview
The Manufacturing Execution System (MES) is a comprehensive solution for managing manufacturing operations, from production planning to execution and analytics.

## Core Modules

1. [Supply Chain Dashboard](./supply-chain-dashboard.md)
   - Real-time supply chain visibility
   - Key performance indicators

2. [Order Tracker](./order-tracker.md)
   - Order status tracking
   - Delivery monitoring

3. [OTIF Analytics](./otif-analytics.md)
   - On Time In Full performance metrics
   - Delivery performance analysis

4. [Production Planning](./production-planning.md)
   - Production request management
   - Resource allocation

5. [Shop Floor](./shop-floor.md)
   - Real-time production monitoring
   - Work center management

6. [Quality Control](./quality-control.md)
   - Quality checks and inspections
   - Deviation management

7. [Master Schedule](./master-schedule.md)
   - Production scheduling
   - Capacity planning

8. [Operator Dashboard](./operator-dashboard.md)
   - Work instructions
   - Production execution

9. [Batch Data Summary](./batch-data-summary.md)
   - Batch tracking
   - Production metrics

## Data Models

The system uses the following core data models:

### ProductionRequest
```typescript
{
  id: string;
  product: string;
  quantity: number;
  requestedDueDate: Date;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'scheduled' | 'in-progress' | 'completed' | 'rejected';
  committedDate?: Date;
}
```

### Batch
```typescript
{
  id: string;
  productionRequestId: string;
  startTime: Date;
  endTime: Date;
  status: 'pending' | 'in-progress' | 'completed' | 'qa-review' | 'released';
  operatorId?: string;
  deviations: Deviation[];
  steps: BatchStep[];
}
```

### Deviation
```typescript
{
  id: string;
  batchId: string;
  type: 'temperature' | 'quality' | 'machine' | 'other';
  description: string;
  timestamp: Date;
  status: 'open' | 'reviewed' | 'closed';
}
```

### BatchStep
```typescript
{
  id: string;
  name: string;
  status: 'pending' | 'in-progress' | 'completed';
  data: Record<string, any>;
  completedAt?: Date;
  completedBy?: string;
}
