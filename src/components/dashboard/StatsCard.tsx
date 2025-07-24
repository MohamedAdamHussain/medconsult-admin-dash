
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
    <div className={cn("unified-card stats-card hover-lift group", className)}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-base font-semibold text-muted-foreground mb-3 tracking-wide">{title}</h3>
          <p className="text-3xl font-bold text-foreground group-hover:text-blue-600 transition-colors duration-300">{value}</p>
          
          {trend && (
            <div className="flex items-center mt-4">
              <span
                className={cn(
                  "text-sm font-semibold px-3 py-1.5 rounded-full shadow-sm",
                  trend.isPositive 
                    ? "text-green-700 bg-gradient-to-r from-green-50 to-green-100 border border-green-200/50" 
                    : "text-red-700 bg-gradient-to-r from-red-50 to-red-100 border border-red-200/50"
                )}
              >
                {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
              </span>
              <span className="text-muted-foreground text-sm mr-3 font-medium">من الشهر الماضي</span>
            </div>
          )}
        </div>
        
        <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/20 flex items-center justify-center text-blue-600 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
