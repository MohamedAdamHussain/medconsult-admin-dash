import React from 'react';
import { SystemNotification } from '@/types/notifications';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

interface UnreadNotificationItemProps {
  notification: SystemNotification;
  title: string;
  color: string;
  onMarkAsRead: (id: string) => void;
}

const UnreadNotificationItem: React.FC<UnreadNotificationItemProps> = ({
  notification,
  title,
  color,
  onMarkAsRead
}) => {
  const getColorStyles = (color: string) => {
    switch (color) {
      case 'blue':
        return 'border-blue-200 bg-blue-50 border-r-blue-500';
      case 'yellow':
        return 'border-yellow-200 bg-yellow-50 border-r-yellow-500';
      case 'red':
        return 'border-red-200 bg-red-50 border-r-red-500';
      case 'green':
        return 'border-green-200 bg-green-50 border-r-green-500';
      default:
        return 'border-gray-200 bg-gray-50 border-r-gray-500';
    }
  };

  const timeAgo = formatDistanceToNow(new Date(notification.created_at), {
    addSuffix: true,
    locale: ar
  });

  return (
    <div className={cn(
      'p-4 mb-3 border-r-4 rounded-md',
      getColorStyles(color)
    )}>
      <div className="flex justify-between items-start gap-3">
        <div className="flex-1">
          <h4 className="font-semibold mb-1 text-right">{title}</h4>
          <p className="text-sm text-gray-600 text-right mb-2">
            {notification.data.message}
          </p>
          <span className="text-xs text-gray-400">{timeAgo}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onMarkAsRead(notification.id)}
          className="shrink-0"
        >
          <Check className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default UnreadNotificationItem;