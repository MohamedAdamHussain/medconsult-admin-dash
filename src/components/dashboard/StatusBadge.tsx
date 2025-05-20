
import React from 'react';
import { cn } from '@/lib/utils';

type StatusType = 'new' | 'pending' | 'rejected' | 'approved';

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const getStatusText = (status: StatusType) => {
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
      'status-badge',
      `status-badge-${status}`,
      className
    )}>
      {getStatusText(status)}
    </span>
  );
};

export default StatusBadge;
