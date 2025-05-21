
import { useState } from 'react';
import { Doctor, FilterOption } from '../types/doctors';
import { toast } from '@/hooks/use-toast';

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

export const useDoctorsData = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOption[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
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
  const viewDoctorDetails = (doctor: Doctor) => {
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

  const clearFilters = () => {
    setFilters([]);
  };

  return {
    searchQuery,
    setSearchQuery,
    filters,
    filteredDoctors,
    specialties,
    cities,
    selectedDoctor,
    setSelectedDoctor,
    detailsDialogOpen,
    setDetailsDialogOpen,
    addFilter,
    removeFilter,
    clearFilters,
    viewDoctorDetails,
    toggleDoctorStatus,
    sendNotification,
    deleteDoctor
  };
};
