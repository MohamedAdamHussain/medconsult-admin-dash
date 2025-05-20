
import React, { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import {
  Users,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  Search
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

// Sample admin data
const admins = [
  {
    id: 1,
    name: 'أحمد محمد',
    email: 'ahmed@medconsult.com',
    role: 'super_admin',
    lastLogin: '2025-05-19 10:30',
    status: 'active',
  },
  {
    id: 2,
    name: 'سارة علي',
    email: 'sara@medconsult.com',
    role: 'content_admin',
    lastLogin: '2025-05-18 15:45',
    status: 'active',
  },
  {
    id: 3,
    name: 'محمد أحمد',
    email: 'mohamed@medconsult.com',
    role: 'support_admin',
    lastLogin: '2025-05-17 09:20',
    status: 'active',
  },
  {
    id: 4,
    name: 'فاطمة حسن',
    email: 'fatima@medconsult.com',
    role: 'financial_admin',
    lastLogin: '2025-05-15 14:10',
    status: 'inactive',
  },
];

const roleOptions = [
  { value: 'super_admin', label: 'مدير النظام' },
  { value: 'content_admin', label: 'مدير المحتوى' },
  { value: 'support_admin', label: 'مدير الدعم الفني' },
  { value: 'financial_admin', label: 'مدير الحسابات' },
];

const getRoleName = (role: string) => {
  return roleOptions.find(opt => opt.value === role)?.label || role;
};

const Admins = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  const filteredAdmins = admins.filter(admin => 
    admin.name.includes(searchQuery) || 
    admin.email.includes(searchQuery) || 
    getRoleName(admin.role).includes(searchQuery)
  );

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-right">إدارة المشرفين</h1>
        <p className="text-gray-500 mt-1 text-right">إضافة وإدارة المشرفين والصلاحيات</p>
      </div>
      
      {/* Search and Add */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div className="relative w-full sm:max-w-xs">
          <Input
            placeholder="بحث عن مشرف"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 text-right"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>
        
        <Button 
          onClick={() => setIsAddDialogOpen(true)}
          className="flex items-center gap-2 w-full sm:w-auto"
        >
          <Plus size={16} />
          <span>إضافة مشرف جديد</span>
        </Button>
      </div>
      
      {/* Admins Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right flex items-center gap-2">
            <Users size={20} />
            <span>قائمة المشرفين</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">#</TableHead>
                <TableHead className="text-right">اسم المشرف</TableHead>
                <TableHead className="text-right">البريد الإلكتروني</TableHead>
                <TableHead className="text-right">الصلاحية</TableHead>
                <TableHead className="text-right">آخر دخول</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-right">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAdmins.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell>{admin.id}</TableCell>
                  <TableCell className="font-medium">{admin.name}</TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>{getRoleName(admin.role)}</TableCell>
                  <TableCell>{admin.lastLogin}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      admin.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {admin.status === 'active' ? 'نشط' : 'غير نشط'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                      {admin.status === 'active' ? (
                        <Button variant="ghost" size="icon">
                          <X className="h-4 w-4 text-destructive" />
                        </Button>
                      ) : (
                        <Button variant="ghost" size="icon">
                          <Check className="h-4 w-4 text-green-600" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Add Admin Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px] text-right">
          <DialogHeader>
            <DialogTitle>إضافة مشرف جديد</DialogTitle>
            <DialogDescription>
              أدخل معلومات المشرف الجديد. اضغط على حفظ عند الانتهاء.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-right">الاسم</Label>
              <Input id="name" placeholder="أدخل اسم المشرف" className="text-right" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-right">البريد الإلكتروني</Label>
              <Input id="email" type="email" placeholder="أدخل البريد الإلكتروني" className="text-right" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-right">كلمة المرور</Label>
              <Input id="password" type="password" placeholder="أدخل كلمة المرور" className="text-right" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role" className="text-right">الصلاحية</Label>
              <Select>
                <SelectTrigger className="text-right">
                  <SelectValue placeholder="اختر الصلاحية" />
                </SelectTrigger>
                <SelectContent>
                  {roleOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter className="sm:justify-end">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsAddDialogOpen(false)}
            >
              إلغاء
            </Button>
            <Button type="submit">حفظ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Admins;
