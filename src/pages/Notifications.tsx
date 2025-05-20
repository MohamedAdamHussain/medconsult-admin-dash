
import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Bell, Send, Check } from 'lucide-react';

// Sample notifications data
const notificationHistory = [
  {
    id: 1,
    title: 'تحديث للنظام',
    content: 'سيتم إجراء تحديث للنظام غدًا من الساعة 2-4 مساءً',
    target: 'all',
    date: '2025-05-10 10:30',
    status: 'sent',
  },
  {
    id: 2,
    title: 'عروض رمضانية',
    content: 'نقدم خصومات خاصة بمناسبة شهر رمضان المبارك',
    target: 'patients',
    date: '2025-05-08 14:15',
    status: 'sent',
  },
  {
    id: 3,
    title: 'ورشة عمل افتراضية',
    content: 'دعوة لحضور ورشة عمل افتراضية حول التطبيب عن بعد',
    target: 'doctors',
    date: '2025-05-05 09:00',
    status: 'sent',
  }
];

const targetOptions = [
  { value: 'all', label: 'جميع المستخدمين' },
  { value: 'doctors', label: 'الأطباء فقط' },
  { value: 'patients', label: 'المرضى فقط' },
];

const Notifications = () => {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-right">إدارة الإشعارات</h1>
        <p className="text-gray-500 mt-1 text-right">إنشاء وإدارة الإشعارات للمستخدمين</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Notification */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-right">إنشاء إشعار جديد</CardTitle>
              <CardDescription className="text-right">أرسل إشعار للمستخدمين</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-right block">عنوان الإشعار</Label>
                  <Input id="title" placeholder="أدخل عنوان الإشعار" className="text-right" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="content" className="text-right block">محتوى الإشعار</Label>
                  <Textarea 
                    id="content" 
                    placeholder="أدخل محتوى الإشعار" 
                    className="text-right min-h-[100px]" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="target" className="text-right block">الفئة المستهدفة</Label>
                  <Select>
                    <SelectTrigger className="text-right">
                      <SelectValue placeholder="اختر الفئة المستهدفة" />
                    </SelectTrigger>
                    <SelectContent>
                      {targetOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button className="flex items-center gap-2">
                <Send size={16} />
                <span>إرسال الإشعار</span>
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        {/* Notification History */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-right">سجل الإشعارات</CardTitle>
              <CardDescription className="text-right">جميع الإشعارات التي تم إرسالها مسبقاً</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notificationHistory.map(notification => (
                  <div 
                    key={notification.id} 
                    className="p-4 border rounded-lg flex items-start justify-between"
                  >
                    <div className="flex-1 text-right">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">{notification.date}</span>
                        <h4 className="font-semibold">{notification.title}</h4>
                      </div>
                      <p className="mt-1 text-gray-600">{notification.content}</p>
                      <div className="mt-2 flex items-center justify-end gap-2">
                        <span className="bg-blue-100 text-blue-800 text-xs py-1 px-2 rounded-full">
                          {targetOptions.find(t => t.value === notification.target)?.label}
                        </span>
                        <span className="bg-green-100 text-green-800 text-xs py-1 px-2 rounded-full flex items-center gap-1">
                          <Check size={12} />
                          <span>تم الإرسال</span>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Notifications;
