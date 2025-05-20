
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
        return 'border-blue-200 bg-blue-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      case 'success':
        return 'border-green-200 bg-green-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className={cn(
      'p-4 mb-3 border-r-4 rounded-md',
      getTypeStyles(type)
    )}>
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-semibold mb-1 text-right">{title}</h4>
          <p className="text-sm text-gray-600 text-right">{message}</p>
        </div>
        <span className="text-xs text-gray-400 whitespace-nowrap">{time}</span>
      </div>
    </div>
  );
};

export default AlertItem;
