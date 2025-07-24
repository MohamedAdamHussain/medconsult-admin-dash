
import React from 'react';
import { cn } from '@/lib/utils';

type AlertType = 'info' | 'warning' | 'error' | 'success';

interface AlertItemProps {
  type: AlertType;
  title: string;
  message: string;
  time: string;
}

const AlertItem = ({ type, title, message, time }: AlertItemProps) => {
  const getTypeStyles = (type: AlertType) => {
    switch (type) {
      case 'info':
        return 'border-blue-200/50 bg-gradient-to-r from-blue-50 to-blue-100/30 shadow-blue-100/50';
      case 'warning':
        return 'border-yellow-200/50 bg-gradient-to-r from-yellow-50 to-yellow-100/30 shadow-yellow-100/50';
      case 'error':
        return 'border-red-200/50 bg-gradient-to-r from-red-50 to-red-100/30 shadow-red-100/50';
      case 'success':
        return 'border-green-200/50 bg-gradient-to-r from-green-50 to-green-100/30 shadow-green-100/50';
      default:
        return 'border-gray-200/50 bg-gradient-to-r from-gray-50 to-gray-100/30 shadow-gray-100/50';
    }
  };

  return (
    <div className={cn(
      'p-5 mb-4 border-r-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] backdrop-blur-sm',
      getTypeStyles(type)
    )}>
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-bold mb-2 text-right tracking-tight">{title}</h4>
          <p className="text-sm text-gray-700 text-right leading-relaxed">{message}</p>
        </div>
        <span className="text-xs text-gray-500 whitespace-nowrap font-medium bg-white/50 px-2 py-1 rounded-full">{time}</span>
      </div>
    </div>
  );
};

export default AlertItem;
