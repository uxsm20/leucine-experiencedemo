import React from 'react';
import { getSupplyChainInsights } from '../../services/analyticsService';
import { TrendingUp, TrendingDown, Minus, AlertCircle } from 'lucide-react';

export const SupplyChainInsights: React.FC = () => {
  const insights = getSupplyChainInsights();

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-5 h-5 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-5 h-5 text-red-500" />;
      default:
        return <Minus className="w-5 h-5 text-gray-500" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'bg-green-100 text-green-800';
    if (confidence >= 0.8) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">AI-Driven Supply Chain Insights</h2>
        <AlertCircle className="w-5 h-5 text-blue-500" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((insight) => (
          <div
            key={insight.label}
            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">{insight.label}</span>
              {getTrendIcon(insight.trend)}
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold">{insight.value}%</span>
              <span
                className={`text-xs px-2 py-1 rounded-full ${getConfidenceColor(
                  insight.confidence
                )}`}
              >
                {Math.round(insight.confidence * 100)}% confidence
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">AI Recommendations:</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>Optimize inventory levels based on predicted demand surge</span>
          </li>
          <li className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>Schedule preventive maintenance during forecasted low-demand periods</span>
          </li>
          <li className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>Adjust supplier orders based on quality risk assessment</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
