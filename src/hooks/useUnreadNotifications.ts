import { useState, useEffect } from 'react';
import { safeGet, safePatch } from '@/lib/api';
import { SystemNotification } from '@/types/notifications';
import { toast } from '@/hooks/use-toast';

interface UnreadNotificationsResponse {
  data?: SystemNotification[];
}

export const useUnreadNotifications = () => {
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUnreadNotifications = async () => {
    setLoading(true);
    setError(null);
    
    const result = await safeGet<SystemNotification[]>('/admin/unread-notifications');
    
    if (result.error) {
      setError(result.error.message);
    } else if (result.data) {
      setNotifications(Array.isArray(result.data) ? result.data : []);
    }
    
    setLoading(false);
  };

  const markAsRead = async (notificationId: string) => {
    const result = await safePatch<{ message: string }>(`/admin/notifications/${notificationId}`);
    
    if (result.error) {
      toast({
        title: 'خطأ',
        description: 'فشل في تحديد التنبيه كمقروء',
        variant: 'destructive',
      });
    } else {
      // إزالة التنبيه من القائمة
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      toast({
        title: 'تم بنجاح',
        description: 'تم تحديد التنبيه كمقروء',
      });
    }
  };

  const getNotificationTitle = (notification: SystemNotification): string => {
    if (notification.notifiable_type === "App\\Models\\User") {
      return "طلبات تسجيل جديدة";
    }
    return "تنبيه النظام";
  };

  const getNotificationColor = (notification: SystemNotification): string => {
    if (notification.notifiable_type === "App\\Models\\User") {
      return "blue";
    }
    return "gray";
  };

  useEffect(() => {
    fetchUnreadNotifications();
  }, []);

  return {
    notifications,
    loading,
    error,
    refetch: fetchUnreadNotifications,
    markAsRead,
    getNotificationTitle,
    getNotificationColor,
  };
};