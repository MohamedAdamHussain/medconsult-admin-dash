import React from 'react';
import { SystemNotification } from '@/types/notifications';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Bell, BellRing } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NotificationItemProps {
  notification: SystemNotification;
  onMarkAsRead: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ 
  notification, 
  onMarkAsRead 
}) => {
  const isUnread = !notification.read_at;
  
  const handleClick = () => {
    if (isUnread) {
      onMarkAsRead(notification.id);
    }
  };

  return (
    <div 
      className={cn(
        "p-4 border rounded-lg cursor-pointer transition-colors",
        isUnread 
          ? "bg-blue-50 border-blue-200 hover:bg-blue-100" 
          : "bg-white border-gray-200 hover:bg-gray-50"
      )}
      onClick={handleClick}
    >
      <div className="flex items-start gap-3">
        <div className={cn(
          "p-2 rounded-full",
          isUnread ? "bg-blue-100" : "bg-gray-100"
        )}>
          {isUnread ? (
            <BellRing className="h-4 w-4 text-blue-600" />
          ) : (
            <Bell className="h-4 w-4 text-gray-600" />
          )}
        </div>
        
        <div className="flex-1 text-right">
          <p className={cn(
            "text-sm",
            isUnread ? "font-medium text-gray-900" : "text-gray-700"
          )}>
            {notification.data.message}
          </p>
          
          <p className="text-xs text-gray-500 mt-1">
            {formatDistanceToNow(new Date(notification.created_at), {
              addSuffix: true,
              locale: ar
            })}
          </p>
          
          {isUnread && (
            <div className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;