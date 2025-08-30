import { useState, useEffect } from 'react';
import { safeGet, safePatch, safePost } from '@/lib/api';
import { SystemNotification, NotificationsResponse } from '@/types/notifications';
import { toast } from '@/hooks/use-toast';

export const useSystemNotifications = () => {
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    
    const result = await safeGet<NotificationsResponse>('/admin/notifications');

    console.log(result);
    
    if (result.error) {
      setError(result.error.message);
      toast({
        title: 'خطأ',
        description: 'فشل في تحميل التنبيهات',
        variant: 'destructive',
      });
    } else if (result.data && Array.isArray(result.data)) {
      setNotifications(result.data);
    }
    
    setLoading(false);
  };

  const markAsRead = async (notificationId: string) => {
    console.log('Marking as read:', notificationId);
    const result = await safePost<{ message: string }>(`/admin/notifications/${notificationId}/mark-as-read`);
    
    if (result.error) {
      toast({
        title: 'خطأ',
        description: 'فشل في تحديد التنبيه كمقروء',
        variant: 'destructive',
      });
    } else {
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read_at: new Date().toISOString() }
            : notification
        )
      );
      toast({
        title: 'تم بنجاح',
        description: 'تم تحديد التنبيه كمقروء',
      });
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return {
    notifications,
    loading,
    error,
    refetch: fetchNotifications,
    markAsRead,
  };
};