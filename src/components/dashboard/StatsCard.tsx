
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
    <div className={cn("unified-card stats-card", className)}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-base font-medium text-muted-foreground mb-2">{title}</h3>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          
          {trend && (
            <div className="flex items-center mt-3">
              <span
                className={cn(
                  "text-sm font-medium px-2 py-1 rounded-full",
                  trend.isPositive 
                    ? "text-green-700 bg-green-50 border border-green-200" 
                    : "text-red-700 bg-red-50 border border-red-200"
                )}
              >
                {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
              </span>
              <span className="text-muted-foreground text-sm mr-2">من الشهر الماضي</span>
            </div>
          )}
        </div>
        
        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
