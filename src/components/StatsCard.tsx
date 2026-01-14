import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: 'blue' | 'emerald' | 'amber' | 'red';
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon: Icon, color, trend }) => {
  const colorClasses = {
    blue: {
      bg: 'bg-gradient-to-br from-blue-50 to-blue-100',
      text: 'text-blue-600',
      icon: 'bg-gradient-to-br from-blue-500 to-blue-600',
    },
    emerald: {
      bg: 'bg-gradient-to-br from-emerald-50 to-emerald-100',
      text: 'text-emerald-600',
      icon: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
    },
    amber: {
      bg: 'bg-gradient-to-br from-amber-50 to-amber-100',
      text: 'text-amber-600',
      icon: 'bg-gradient-to-br from-amber-500 to-amber-600',
    },
    red: {
      bg: 'bg-gradient-to-br from-red-50 to-red-100',
      text: 'text-red-600',
      icon: 'bg-gradient-to-br from-red-500 to-red-600',
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-soft border border-gray-100 p-6 hover:shadow-soft-md transition-all duration-300 hover:-translate-y-0.5">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 tracking-tight">{value}</p>
          {trend && (
            <p className={`text-sm mt-2 font-medium ${trend.isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
              <span className="inline-flex items-center">
                {trend.isPositive ? '↗' : '↘'} {Math.abs(trend.value)}%
              </span>
            </p>
          )}
        </div>
        <div className={`p-4 rounded-xl ${colorClasses[color].icon} shadow-soft`}>
          <Icon className="h-7 w-7 text-white" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;