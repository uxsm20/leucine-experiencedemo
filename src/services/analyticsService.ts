// Mock data generation for analytics demonstrations

interface PredictionData {
  timestamp: string;
  actual?: number;
  predicted: number;
}

interface TrendData {
  label: string;
  value: number;
  trend: 'up' | 'down' | 'stable';
  confidence: number;
}

export const generateDemandForecast = (days: number): PredictionData[] => {
  const data: PredictionData[] = [];
  const baseValue = 1000;
  const now = new Date();

  for (let i = 0; i < days; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() + i);
    
    // Generate realistic-looking predictions with some variance
    const actual = i < 7 ? baseValue + Math.random() * 200 - 100 : undefined;
    const predicted = baseValue + Math.sin(i * 0.5) * 150 + Math.random() * 100;

    data.push({
      timestamp: date.toISOString().split('T')[0],
      actual,
      predicted: Math.round(predicted)
    });
  }

  return data;
};

export const getSupplyChainInsights = (): TrendData[] => {
  return [
    {
      label: 'Inventory Optimization',
      value: 87,
      trend: 'up',
      confidence: 0.92
    },
    {
      label: 'Production Efficiency',
      value: 92,
      trend: 'up',
      confidence: 0.89
    },
    {
      label: 'Quality Risk',
      value: 12,
      trend: 'down',
      confidence: 0.95
    },
    {
      label: 'Supplier Performance',
      value: 84,
      trend: 'stable',
      confidence: 0.88
    }
  ];
};

export const getResourceOptimization = () => {
  return {
    utilization: {
      current: 78,
      optimal: 85,
      recommendations: [
        'Schedule maintenance during predicted low-demand periods',
        'Adjust shift patterns based on demand forecast',
        'Optimize batch sizes for key products'
      ]
    },
    efficiency: {
      current: 82,
      potential: 90,
      actions: [
        'Implement suggested process improvements',
        'Address identified bottlenecks',
        'Update resource allocation strategy'
      ]
    }
  };
};

export const getQualityMetrics = () => {
  return {
    defectRate: {
      current: 2.3,
      trend: 'improving',
      benchmark: 2.5
    },
    processCapability: {
      cpk: 1.45,
      trend: 'stable',
      target: 1.5
    },
    riskFactors: [
      {
        factor: 'Temperature Control',
        impact: 'high',
        mitigation: 'Enhanced monitoring system'
      },
      {
        factor: 'Material Variability',
        impact: 'medium',
        mitigation: 'Supplier quality program'
      }
    ]
  };
};
