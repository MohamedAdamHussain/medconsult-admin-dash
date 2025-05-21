
import React, { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar as CalendarIcon, Filter, Search, User, UserCheck, UserX, FileText, MessageSquare, AlertTriangle, Download } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// نوع البيانات لسجل النشاطات
interface ActivityLogEntry {
  id: number;
  timestamp: Date;
  user: string;
  userType: string;
  action: string;
  actionType: 'create' | 'update' | 'delete' | 'login' | 'approval';
  details: string;
}

// بيانات عينة
const sampleActivityLogs: ActivityLogEntry[] = [
  {
    id: 1,
    timestamp: new Date('2025-05-20T14:32:00'),
    user: 'أحمد المشرف',
    userType: 'مشرف',
    action: 'قبول طلب تسجيل الطبيب',
    actionType: 'approval',
    details: 'تمت الموافقة على طلب تسجيل د. محمد سامي'
  },
  {
    id: 2,
    timestamp: new Date('2025-05-20T12:15:00'),
    user: 'فاطمة المشرفة',
    userType: 'مشرفة',
    action: 'رفض طلب تسجيل طبيب',
    actionType: 'delete',
    details: 'تم رفض طلب تسجيل د. سارة أحمد بسبب عدم اكتمال الوثائق'
  },
  {
    id: 3,
    timestamp: new Date('2025-05-20T10:40:00'),
    user: 'عبدالله المشرف',
    userType: 'مشرف',
    action: 'تحديث بيانات تخصص',
    actionType: 'update',
    details: 'تم تحديث بيانات تخصص الأمراض الجلدية مع إضافة 3 أسئلة شائعة'
  },
  {
    id: 4,
    timestamp: new Date('2025-05-19T16:22:00'),
    user: 'د. خالد العمري',
    userType: 'طبيب',
    action: 'تسجيل دخول',
    actionType: 'login',
    details: 'تسجيل دخول من متصفح Chrome - الرياض'
  },
  {
    id: 5,
    timestamp: new Date('2025-05-19T15:10:00'),
    user: 'نورة الإدارية',
    userType: 'مشرفة',
    action: 'إضافة تخصص جديد',
    actionType: 'create',
    details: 'تمت إضافة تخصص جديد: الأمراض الصدرية'
  },
  {
    id: 6,
    timestamp: new Date('2025-05-19T14:05:00'),
    user: 'أحمد المشرف',
    userType: 'مشرف',
    action: 'تعديل حالة طبيب',
    actionType: 'update',
    details: 'تم تعليق حساب د. إبراهيم محمد مؤقتًا'
  },
  {
    id: 7,
    timestamp: new Date('2025-05-18T11:45:00'),
    user: 'عبدالله المشرف',
    userType: 'مشرف',
    action: 'إرسال إشعار',
    actionType: 'create',
    details: 'تم إرسال إشعار جماعي لجميع الأطباء المتخصصين في طب الأطفال'
  },
  {
    id: 8,
    timestamp: new Date('2025-05-18T09:30:00'),
    user: 'فاطمة المشرفة',
    userType: 'مشرفة',
    action: 'إغلاق شكوى',
    actionType: 'update',
    details: 'تم إغلاق الشكوى رقم #123 بعد حلها'
  }
];

const ActivityLog = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [actionTypeFilter, setActionTypeFilter] = useState<string | undefined>(undefined);
  const [userTypeFilter, setUserTypeFilter] = useState<string | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<string>('all');

  // تحديد لون الإجراء
  const getActionColor = (actionType: string) => {
    switch (actionType) {
      case 'create':
        return 'bg-green-100 text-green-800';
      case 'update':
        return 'bg-blue-100 text-blue-800';
      case 'delete':
        return 'bg-red-100 text-red-800';
      case 'login':
        return 'bg-gray-100 text-gray-800';
      case 'approval':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // تحديد أيقونة الإجراء
  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'create':
        return <FileText className="h-4 w-4" />;
      case 'update':
        return <MessageSquare className="h-4 w-4" />;
      case 'delete':
        return <UserX className="h-4 w-4" />;
      case 'login':
        return <User className="h-4 w-4" />;
      case 'approval':
        return <UserCheck className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  // تطبيق الفلاتر على البيانات
  const filteredLogs = sampleActivityLogs.filter(log => {
    // تطبيق البحث
    const matchesSearch = searchQuery === '' || 
                         log.user.includes(searchQuery) || 
                         log.action.includes(searchQuery) ||
                         log.details.includes(searchQuery);
    
    // تطبيق فلتر التاريخ
    const matchesDate = !selectedDate || 
                       format(log.timestamp, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
    
    // تطبيق فلتر نوع الإجراء
    const matchesActionType = !actionTypeFilter || log.actionType === actionTypeFilter;
    
    // تطبيق فلتر نوع المستخدم
    const matchesUserType = !userTypeFilter || log.userType === userTypeFilter;

    // تطبيق فلتر علامة التبويب النشطة
    const matchesTab = activeTab === 'all' || log.actionType === activeTab;
    
    return matchesSearch && matchesDate && matchesActionType && matchesUserType && matchesTab;
  })
  .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()); // ترتيب زمني تنازلي

  return (
    <DashboardLayout>
      <div className="mb-6">
        <div className="flex flex-row-reverse justify-between items-center">
          <h1 className="text-3xl font-bold">سجل النشاطات</h1>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Download className="h-4 w-4" />
            <span>تصدير السجل</span>
          </Button>
        </div>
        <p className="text-gray-500 mt-1 text-right">سجل كامل لجميع الإجراءات والنشاطات في المنصة</p>
      </div>

      {/* علامات التبويب */}
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
        <div className="flex justify-end">
          <TabsList className="grid grid-cols-6 w-auto">
            <TabsTrigger value="all">الكل</TabsTrigger>
            <TabsTrigger value="create">إضافة</TabsTrigger>
            <TabsTrigger value="update">تعديل</TabsTrigger>
            <TabsTrigger value="delete">حذف</TabsTrigger>
            <TabsTrigger value="login">تسجيل دخول</TabsTrigger>
            <TabsTrigger value="approval">موافقة</TabsTrigger>
          </TabsList>
        </div>
      </Tabs>

      {/* أدوات البحث والتصفية */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div>
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="ابحث في السجلات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-3 pr-10 text-right"
            />
          </div>
        </div>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-between text-right"
            >
              <span>{selectedDate ? format(selectedDate, 'PPP', { locale: ar }) : "اختر تاريخ"}</span>
              <CalendarIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        
        <Select value={actionTypeFilter} onValueChange={setActionTypeFilter}>
          <SelectTrigger className="text-right">
            <SelectValue placeholder="نوع الإجراء" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">الكل</SelectItem>
            <SelectItem value="create">إضافة</SelectItem>
            <SelectItem value="update">تعديل</SelectItem>
            <SelectItem value="delete">حذف</SelectItem>
            <SelectItem value="login">تسجيل دخول</SelectItem>
            <SelectItem value="approval">موافقة</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={userTypeFilter} onValueChange={setUserTypeFilter}>
          <SelectTrigger className="text-right">
            <SelectValue placeholder="نوع المستخدم" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">الكل</SelectItem>
            <SelectItem value="مشرف">مشرف</SelectItem>
            <SelectItem value="مشرفة">مشرفة</SelectItem>
            <SelectItem value="طبيب">طبيب</SelectItem>
            <SelectItem value="مريض">مريض</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* جدول السجل */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">المستخدم</TableHead>
              <TableHead className="text-right">الإجراء</TableHead>
              <TableHead className="text-right">التفاصيل</TableHead>
              <TableHead className="text-right">التاريخ والوقت</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{log.user}</p>
                    <p className="text-xs text-muted-foreground">{log.userType}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-md ${getActionColor(log.actionType)}`}>
                      {getActionIcon(log.actionType)}
                    </div>
                    <span>{log.action}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="max-w-xs overflow-hidden text-ellipsis">{log.details}</p>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{format(log.timestamp, 'yyyy-MM-dd', { locale: ar })}</p>
                    <p className="text-xs text-muted-foreground">{format(log.timestamp, 'HH:mm', { locale: ar })}</p>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredLogs.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10">
                  لا توجد سجلات مطابقة للبحث
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </DashboardLayout>
  );
};

export default ActivityLog;
