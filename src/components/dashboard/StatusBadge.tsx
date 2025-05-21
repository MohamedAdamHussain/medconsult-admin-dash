
import React from 'react';
import { cn } from '@/lib/utils';

export type StatusType = 'new' | 'pending' | 'rejected' | 'approved';

export interface StatusBadgeProps {
  status: StatusType;
  className?: string;
  text?: string; // جعلنا النص اختياريًا
}

const StatusBadge = ({ status, className, text }: StatusBadgeProps) => {
  const getStatusText = (status: StatusType) => {
    if (text) return text;
    
    switch (status) {
      case 'new':
        return 'جديد';
      case 'pending':
        return 'قيد المراجعة';
      case 'rejected':
        return 'مرفوض';
      case 'approved':
        return 'مقبول';
      default:
        return '';
    }
  };

  return (
    <span className={cn(
      'px-2 py-1 rounded-full text-xs font-medium',
      {
        'bg-blue-100 text-blue-800': status === 'new',
        'bg-yellow-100 text-yellow-800': status === 'pending',
        'bg-red-100 text-red-800': status === 'rejected',
        'bg-green-100 text-green-800': status === 'approved',
      },
      'status-badge',
      `status-badge-${status}`,
      className
    )}>
      {getStatusText(status)}
    </span>
  );
};

export default StatusBadge;
