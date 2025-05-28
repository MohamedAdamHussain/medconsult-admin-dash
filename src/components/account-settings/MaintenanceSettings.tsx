import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, Bell, Calendar, Plus, Save, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SystemNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  startDate: string;
  endDate: string;
  active: boolean;
}

const MaintenanceSettings = () => {
  const { toast } = useToast();
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState('الموقع تحت الصيانة، سيتم العودة قريباً');
  const [maintenanceSchedule, setMaintenanceSchedule] = useState({
    startDate: '',
    endDate: '',
    description: ''
  });

  const [notifications, setNotifications] = useState<SystemNotification[]>([
    {
      id: '1',
      title: 'تحديث النظام',
      message: 'سيتم تحديث النظام غداً من الساعة 2:00 إلى 4:00 صباحاً',
      type: 'info',
      startDate: '2025-01-15',
      endDate: '2025-01-16',
      active: true
    }
  ]);

  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    type: 'info' as const,
    startDate: '',
    endDate: ''
  });

  const handleMaintenanceToggle = (enabled: boolean) => {
    setMaintenanceMode(enabled);
    toast({
      title: enabled ? "تم تفعيل وضع الصيانة" : "تم إلغاء وضع الصيانة",
      description: enabled ? "الموقع الآن في وضع الصيانة" : "الموقع متاح الآن للمستخدمين",
    });
  };

  const handleScheduleMaintenance = () => {
    toast({
      title: "تم جدولة الصيانة",
      description: "تم جدولة فترة الصيانة بنجاح",
    });
  };

  const addNotification = () => {
    if (!newNotification.title || !newNotification.message) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    const notification: SystemNotification = {
      id: Date.now().toString(),
      ...newNotification,
      active: true
    };

    setNotifications(prev => [...prev, notification]);
    setNewNotification({
      title: '',
      message: '',
      type: 'info',
      startDate: '',
      endDate: ''
    });

    toast({
      title: "تم إضافة الإشعار",
      description: "تم إضافة الإشعار النظامي بنجاح",
    });
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast({
      title: "تم حذف الإشعار",
      description: "تم حذف الإشعار النظامي بنجاح",
    });
  };

  const toggleNotification = (id: string, active: boolean) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, active } : n)
    );
  };

  return (
    <div className="space-y-6">
      {/* Maintenance Mode */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right flex items-center gap-2">
            <AlertTriangle size={20} />
            وضع الصيانة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Switch
              checked={maintenanceMode}
              onCheckedChange={handleMaintenanceToggle}
            />
            <Label className="text-right">تفعيل وضع الصيانة</Label>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="maintenance-message" className="text-right block">رسالة الصيانة</Label>
            <Textarea
              id="maintenance-message"
              value={maintenanceMessage}
              onChange={(e) => setMaintenanceMessage(e.target.value)}
              className="text-right"
            />
          </div>
        </CardContent>
      </Card>

      {/* Scheduled Maintenance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right flex items-center gap-2">
            <Calendar size={20} />
            جدولة الصيانة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-date" className="text-right block">تاريخ البداية</Label>
              <Input
                id="start-date"
                type="datetime-local"
                value={maintenanceSchedule.startDate}
                onChange={(e) => setMaintenanceSchedule(prev => ({ ...prev, startDate: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="end-date" className="text-right block">تاريخ النهاية</Label>
              <Input
                id="end-date"
                type="datetime-local"
                value={maintenanceSchedule.endDate}
                onChange={(e) => setMaintenanceSchedule(prev => ({ ...prev, endDate: e.target.value }))}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="maintenance-description" className="text-right block">وصف الصيانة</Label>
            <Textarea
              id="maintenance-description"
              value={maintenanceSchedule.description}
              onChange={(e) => setMaintenanceSchedule(prev => ({ ...prev, description: e.target.value }))}
              className="text-right"
              placeholder="وصف نوع الصيانة والأعمال المطلوبة..."
            />
          </div>
          
          <Button onClick={handleScheduleMaintenance} className="w-full">
            جدولة الصيانة
          </Button>
        </CardContent>
      </Card>

      {/* System Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right flex items-center gap-2">
            <Bell size={20} />
            الإشعارات النظامية
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add New Notification */}
          <div className="border rounded-lg p-4 space-y-4">
            <h3 className="font-semibold text-right">إضافة إشعار جديد</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="notification-title" className="text-right block">عنوان الإشعار</Label>
                <Input
                  id="notification-title"
                  value={newNotification.title}
                  onChange={(e) => setNewNotification(prev => ({ ...prev, title: e.target.value }))}
                  className="text-right"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notification-type" className="text-right block">نوع الإشعار</Label>
                <Select value={newNotification.type} onValueChange={(value: any) => setNewNotification(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="info">معلومات</SelectItem>
                    <SelectItem value="warning">تحذير</SelectItem>
                    <SelectItem value="success">نجاح</SelectItem>
                    <SelectItem value="error">خطأ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notification-message" className="text-right block">رسالة الإشعار</Label>
              <Textarea
                id="notification-message"
                value={newNotification.message}
                onChange={(e) => setNewNotification(prev => ({ ...prev, message: e.target.value }))}
                className="text-right"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="notification-start" className="text-right block">تاريخ البداية</Label>
                <Input
                  id="notification-start"
                  type="date"
                  value={newNotification.startDate}
                  onChange={(e) => setNewNotification(prev => ({ ...prev, startDate: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notification-end" className="text-right block">تاريخ النهاية</Label>
                <Input
                  id="notification-end"
                  type="date"
                  value={newNotification.endDate}
                  onChange={(e) => setNewNotification(prev => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
            </div>
            
            <Button onClick={addNotification} className="flex items-center gap-2">
              <Plus size={16} />
              إضافة الإشعار
            </Button>
          </div>
          
          {/* Existing Notifications */}
          <div className="space-y-3">
            <h3 className="font-semibold text-right">الإشعارات الموجودة</h3>
            {notifications.map((notification) => (
              <div key={notification.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteNotification(notification.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                    <Switch
                      checked={notification.active}
                      onCheckedChange={(value) => toggleNotification(notification.id, value)}
                    />
                  </div>
                  <div className="text-right flex-1">
                    <h4 className="font-medium">{notification.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    <div className="text-xs text-gray-500 mt-2">
                      {notification.startDate} إلى {notification.endDate}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button className="flex items-center gap-2">
          <Save size={16} />
          حفظ جميع التغييرات
        </Button>
      </div>
    </div>
  );
};

export default MaintenanceSettings;
