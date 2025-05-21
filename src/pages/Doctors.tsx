
import React, { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Search, Filter, MoreHorizontal, UserCheck, UserX, Edit, Bell, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import DoctorDetails from '@/components/doctors/DoctorDetails';
import StatusBadge from '@/components/dashboard/StatusBadge';

// بيانات عينة للأطباء
const doctorsData = [
  {
    id: 1,
    name: 'د. محمد أحمد',
    specialty: 'قلب وأوعية دموية',
    rating: 4.8,
    status: 'active',
    city: 'الرياض',
    joinDate: '2025-01-15',
    patients: 145,
    consultations: 278,
    documents: {
      certificate: 'شهادة تخصص قلب',
      license: 'ترخيص مزاولة المهنة',
      id: 'بطاقة الهوية',
    },
    contacts: {
      phone: '05xxxxxxxx',
      email: 'dr.mohamed@example.com',
    }
  },
  {
    id: 2,
    name: 'د. فاطمة علي',
    specialty: 'أمراض جلدية',
    rating: 4.9,
    status: 'active',
    city: 'جدة',
    joinDate: '2025-02-10',
    patients: 198,
    consultations: 342,
    documents: {
      certificate: 'شهادة تخصص جلدية',
      license: 'ترخيص مزاولة المهنة',
      id: 'بطاقة الهوية',
    },
    contacts: {
      phone: '05xxxxxxxx',
      email: 'dr.fatima@example.com',
    }
  },
  {
    id: 3,
    name: 'د. خالد العمري',
    specialty: 'طب أطفال',
    rating: 4.6,
    status: 'inactive',
    city: 'الدمام',
    joinDate: '2025-01-05',
    patients: 112,
    consultations: 203,
    documents: {
      certificate: 'شهادة تخصص أطفال',
      license: 'ترخيص مزاولة المهنة',
      id: 'بطاقة الهوية',
    },
    contacts: {
      phone: '05xxxxxxxx',
      email: 'dr.khaled@example.com',
    }
  },
  {
    id: 4,
    name: 'د. سارة محمد',
    specialty: 'نفسية',
    rating: 4.7,
    status: 'active',
    city: 'الرياض',
    joinDate: '2025-03-20',
    patients: 87,
    consultations: 176,
    documents: {
      certificate: 'شهادة تخصص نفسية',
      license: 'ترخيص مزاولة المهنة',
      id: 'بطاقة الهوية',
    },
    contacts: {
      phone: '05xxxxxxxx',
      email: 'dr.sarah@example.com',
    }
  },
  {
    id: 5,
    name: 'د. عبدالله الحربي',
    specialty: 'عظام',
    rating: 4.5,
    status: 'active',
    city: 'مكة',
    joinDate: '2025-01-30',
    patients: 134,
    consultations: 255,
    documents: {
      certificate: 'شهادة تخصص عظام',
      license: 'ترخيص مزاولة المهنة',
      id: 'بطاقة الهوية',
    },
    contacts: {
      phone: '05xxxxxxxx',
      email: 'dr.abdullah@example.com',
    }
  },
];

// تعريف أنواع الفلاتر المتاحة
type FilterOption = {
  type: 'specialty' | 'status' | 'city';
  value: string;
}

const Doctors = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOption[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<typeof doctorsData[0] | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  // استخراج القيم الفريدة للفلاتر
  const specialties = [...new Set(doctorsData.map(doctor => doctor.specialty))];
  const cities = [...new Set(doctorsData.map(doctor => doctor.city))];

  // تطبيق الفلاتر والبحث
  const filteredDoctors = doctorsData.filter(doctor => {
    // تطبيق البحث
    const matchesSearch = doctor.name.includes(searchQuery) || 
                         doctor.specialty.includes(searchQuery) ||
                         doctor.city.includes(searchQuery);
    
    // تطبيق الفلاتر
    const matchesFilters = filters.length === 0 || filters.every(filter => {
      if (filter.type === 'specialty') return doctor.specialty === filter.value;
      if (filter.type === 'status') return doctor.status === filter.value;
      if (filter.type === 'city') return doctor.city === filter.value;
      return true;
    });
    
    return matchesSearch && matchesFilters;
  });

  // إضافة فلتر
  const addFilter = (type: 'specialty' | 'status' | 'city', value: string) => {
    // إزالة أي فلتر سابق من نفس النوع
    const newFilters = filters.filter(f => f.type !== type);
    // إضافة الفلتر الجديد
    setFilters([...newFilters, { type, value }]);
  };

  // إزالة فلتر
  const removeFilter = (type: 'specialty' | 'status' | 'city') => {
    setFilters(filters.filter(f => f.type !== type));
  };

  // إظهار تفاصيل الطبيب
  const viewDoctorDetails = (doctor: typeof doctorsData[0]) => {
    setSelectedDoctor(doctor);
    setDetailsDialogOpen(true);
  };

  // تغيير حالة الطبيب (تفعيل/تعطيل)
  const toggleDoctorStatus = (doctorId: number) => {
    // عادةً، هنا سنرسل طلب API لتحديث حالة الطبيب
    // في هذا المثال، سنعرض رسالة نجاح فقط
    toast({
      title: "تم تحديث الحالة",
      description: "تم تغيير حالة الطبيب بنجاح",
    });
  };

  // إرسال إشعار للطبيب
  const sendNotification = (doctorId: number) => {
    toast({
      title: "تم إرسال الإشعار",
      description: "تم إرسال الإشعار إلى الطبيب بنجاح",
    });
  };

  // حذف طبيب
  const deleteDoctor = (doctorId: number) => {
    toast({
      title: "تم حذف الطبيب",
      description: "تم حذف حساب الطبيب بنجاح",
      variant: "destructive",
    });
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-right">إدارة الأطباء</h1>
        <p className="text-gray-500 mt-1 text-right">إدارة وعرض معلومات الأطباء</p>
      </div>
      
      {/* شريط البحث والفلترة */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 items-end">
        <div className="flex-1 relative">
          <Label htmlFor="search" className="block mb-2 text-right">بحث</Label>
          <div className="relative">
            <Input
              id="search"
              placeholder="ابحث بالاسم، التخصص، أو المدينة"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 text-right"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>
        </div>
        
        {/* قائمة الفلاتر */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter size={18} />
              <span>فلترة</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="p-2">
              <p className="text-sm font-medium mb-2">التخصص</p>
              {specialties.map((specialty) => (
                <DropdownMenuItem key={specialty} onClick={() => addFilter('specialty', specialty)}>
                  {specialty}
                </DropdownMenuItem>
              ))}
              
              <p className="text-sm font-medium mb-2 mt-4">المدينة</p>
              {cities.map((city) => (
                <DropdownMenuItem key={city} onClick={() => addFilter('city', city)}>
                  {city}
                </DropdownMenuItem>
              ))}
              
              <p className="text-sm font-medium mb-2 mt-4">الحالة</p>
              <DropdownMenuItem onClick={() => addFilter('status', 'active')}>
                مفعل
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => addFilter('status', 'inactive')}>
                موقوف
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* عرض الفلاتر النشطة */}
      {filters.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4 justify-end">
          {filters.map((filter) => (
            <div 
              key={`${filter.type}-${filter.value}`} 
              className="bg-gray-100 rounded-full px-3 py-1 text-sm flex items-center gap-1"
            >
              <span>
                {filter.type === 'specialty' && 'التخصص: '}
                {filter.type === 'status' && 'الحالة: '}
                {filter.type === 'city' && 'المدينة: '}
                {filter.value === 'active' ? 'مفعل' : 
                 filter.value === 'inactive' ? 'موقوف' : filter.value}
              </span>
              <button 
                onClick={() => removeFilter(filter.type)} 
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
          ))}
          <button 
            onClick={() => setFilters([])}
            className="text-blue-500 text-sm hover:underline"
          >
            مسح الكل
          </button>
        </div>
      )}
      
      {/* جدول الأطباء */}
      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">الطبيب</TableHead>
              <TableHead className="text-right">التخصص</TableHead>
              <TableHead className="text-right">التقييم</TableHead>
              <TableHead className="text-right">المدينة</TableHead>
              <TableHead className="text-right">الحالة</TableHead>
              <TableHead className="text-right">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDoctors.map((doctor) => (
              <TableRow key={doctor.id}>
                <TableCell className="font-medium">{doctor.name}</TableCell>
                <TableCell>{doctor.specialty}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <span className="text-amber-500">★</span>
                    <span>{doctor.rating}</span>
                  </div>
                </TableCell>
                <TableCell>{doctor.city}</TableCell>
                <TableCell>
                  <StatusBadge 
                    status={doctor.status === 'active' ? 'approved' : 'rejected'} 
                    text={doctor.status === 'active' ? 'مفعل' : 'موقوف'} 
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => viewDoctorDetails(doctor)}
                    >
                      عرض التفاصيل
                    </Button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => toggleDoctorStatus(doctor.id)}>
                          {doctor.status === 'active' ? (
                            <div className="flex items-center gap-2">
                              <UserX size={16} />
                              <span>تعطيل</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <UserCheck size={16} />
                              <span>تفعيل</span>
                            </div>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => sendNotification(doctor.id)}>
                          <div className="flex items-center gap-2">
                            <Bell size={16} />
                            <span>إرسال إشعار</span>
                          </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => console.log('تعديل', doctor.id)}>
                          <div className="flex items-center gap-2">
                            <Edit size={16} />
                            <span>تعديل البيانات</span>
                          </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => deleteDoctor(doctor.id)}>
                          <div className="flex items-center gap-2 text-red-500">
                            <Trash2 size={16} />
                            <span>حذف</span>
                          </div>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filteredDoctors.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  لا توجد نتائج مطابقة لبحثك
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* مودال تفاصيل الطبيب */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl text-right">تفاصيل الطبيب</DialogTitle>
          </DialogHeader>
          
          {selectedDoctor && (
            <DoctorDetails doctor={selectedDoctor} />
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Doctors;
