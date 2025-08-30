
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
  Search,
  Loader2
} from 'lucide-react';
import { useAdmins } from '@/hooks/useAdmins';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
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

const Admins = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  const { data: adminsData, isLoading, error } = useAdmins({
    page: currentPage,
    search: searchQuery
  });

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page when searching
  };

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
            onChange={(e) => handleSearch(e.target.value)}
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
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="mr-2">جارٍ التحميل...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-destructive">
              حدث خطأ في تحميل البيانات
            </div>
          ) : !adminsData?.data.length ? (
            <div className="text-center py-8 text-muted-foreground">
              لا توجد مشرفين
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">#</TableHead>
                    <TableHead className="text-right">اسم المشرف</TableHead>
                    <TableHead className="text-right">البريد الإلكتروني</TableHead>
                    <TableHead className="text-right">تاريخ التسجيل</TableHead>
                    <TableHead className="text-right">الحالة</TableHead>
                    <TableHead className="text-right">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adminsData.data.map((admin) => (
                    <TableRow key={admin.id}>
                      <TableCell>{admin.id}</TableCell>
                      <TableCell className="font-medium">{admin.fullName}</TableCell>
                      <TableCell>{admin.email}</TableCell>
                      <TableCell>
                        {format(new Date(admin.created_at), 'yyyy-MM-dd HH:mm', { locale: ar })}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          admin.isVerified === 1
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {admin.isVerified === 1 ? 'مفعل' : 'غير مفعل'}
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
                          {admin.isVerified === 1 ? (
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
              
              {/* Pagination */}
              {adminsData.last_page > 1 && (
                <div className="flex justify-center items-center gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    السابق
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    صفحة {adminsData.current_page} من {adminsData.last_page}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === adminsData.last_page}
                  >
                    التالي
                  </Button>
                </div>
              )}
            </>
          )}
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
