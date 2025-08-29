import { useState, useEffect } from 'react';
import { safeGet } from '@/lib/api';
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
    
    if (result.error) {
      setError(result.error.message);
      toast({
        title: 'خطأ',
        description: 'فشل في تحميل التنبيهات',
        variant: 'destructive',
      });
    } else if (result.data) {
      setNotifications(result.data.data || []);
    }
    
    setLoading(false);
  };

  const markAsRead = async (notificationId: string) => {
    // يمكن إضافة API call لتحديد التنبيه كمقروء
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read_at: new Date().toISOString() }
          : notification
      )
    );
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