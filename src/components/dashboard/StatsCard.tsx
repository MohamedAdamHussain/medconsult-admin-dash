
import React from 'react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const StatsCard = ({ title, value, icon, trend, className }: StatsCardProps) => {
  return (
    <div className={cn("stats-card", className)}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-500 mb-1">{title}</h3>
          <p className="text-2xl font-bold">{value}</p>
          
          {trend && (
            <div className="flex items-center mt-2">
              <span
                className={cn(
                  "text-sm font-medium",
                  trend.isPositive ? "text-green-600" : "text-red-600"
                )}
              >
                {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
              </span>
              <span className="text-gray-500 text-sm mr-1">من الشهر الماضي</span>
            </div>
          )}
        </div>
        
        <div className="h-12 w-12 rounded-full bg-medical-light flex items-center justify-center text-medical">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
