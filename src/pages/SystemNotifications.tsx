import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useSystemNotifications } from '@/hooks/useSystemNotifications';
import NotificationsList from '@/components/notifications/NotificationsList';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, Bell, BellRing } from 'lucide-react';

const SystemNotifications = () => {
  const { notifications, loading, refetch, markAsRead } = useSystemNotifications();
  
  const unreadCount = notifications.filter(n => !n.read_at).length;
  const totalCount = notifications.length;

  return (
    <DashboardLayout>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="text-right">
            <h1 className="text-3xl font-bold">تنبيهات النظام</h1>
            <p className="text-gray-500 mt-1">إدارة ومراجعة تنبيهات النظام</p>
          </div>
          
          <Button 
            onClick={refetch} 
            variant="outline" 
            className="flex items-center gap-2"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span>تحديث</span>
          </Button>
        </div>
      </div>

      {/* إحصائيات التنبيهات */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-right">إجمالي التنبيهات</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-right">{totalCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-right">التنبيهات غير المقروءة</CardTitle>
            <BellRing className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 text-right">{unreadCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-right">التنبيهات المقروءة</CardTitle>
            <Bell className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 text-right">{totalCount - unreadCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* قائمة التنبيهات */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right">جميع التنبيهات</CardTitle>
        </CardHeader>
        <CardContent>
          <NotificationsList
            notifications={notifications}
            loading={loading}
            onMarkAsRead={markAsRead}
          />
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default SystemNotifications;