import { useEffect, useState } from 'react';
import { Doctor, FilterOption } from '../types/doctors';
import { toast } from '@/hooks/use-toast';
import { safeGet } from '@/lib/api';

// // بيانات عينة للأطباء
// const doctorsData = [
//   {
//     id: 1,
//     name: 'د. محمد أحمد',
//     specialty: 'قلب وأوعية دموية',
//     specialties: [
//       {
//         id: '1',
//         name: 'قلب وأوعية دموية',
//         consultationPrice: 200,
//         experienceYears: 15,
//         description: 'خبرة واسعة في جراحة القلب والقسطرة القلبية'
//       },
//       {
//         id: '2',
//         name: 'طب الطوارئ',
//         consultationPrice: 150,
//         experienceYears: 8,
//         description: 'تخصص فرعي في حالات الطوارئ القلبية'
//       }
//     ],
//     rating: 4.8,
//     status: 'active',
//     city: 'الرياض',
//     joinDate: '2025-01-15',
//     patients: 145,
//     consultations: 278,
//     activityPoints: 2450,
//     age: 42,
//     gender: 'male' as const,
//     profileImage: '/api/placeholder/120/120',
//     documents: {
//       certificates: ['cert1.pdf', 'cert2.pdf'],
//       license: 'license.pdf',
//       id: 'id.pdf',
//       syndicate: 'syndicate.pdf',
//     },
//     contacts: {
//       phone: '05xxxxxxxx',
//       email: 'dr.mohamed@example.com',
//     },
//     socialMedia: {
//       facebook: 'https://facebook.com/dr.mohamed',
//       twitter: 'https://twitter.com/dr.mohamed',
//       linkedin: 'https://linkedin.com/in/dr.mohamed'
//     },
//     clinicLocation: {
//       address: 'شارع الملك فهد، الرياض 12345',
//       coordinates: {
//         lat: 24.7136,
//         lng: 46.6753
//       }
//     }
//   },
//   {
//     id: 2,
//     name: 'د. فاطمة علي',
//     specialty: 'أمراض جلدية',
//     specialties: [
//       {
//         id: '3',
//         name: 'أمراض جلدية',
//         consultationPrice: 180,
//         experienceYears: 12,
//         description: 'تخصص في الأمراض الجلدية والتجميل'
//       }
//     ],
//     rating: 4.9,
//     status: 'active',
//     city: 'جدة',
//     joinDate: '2025-02-10',
//     patients: 198,
//     consultations: 342,
//     activityPoints: 1980,
//     age: 38,
//     gender: 'female' as const,
//     profileImage: '/api/placeholder/120/120',
//     documents: {
//       certificates: ['derma_cert.pdf'],
//       license: 'license.pdf',
//       id: 'id.pdf',
//       syndicate: 'syndicate.pdf',
//     },
//     contacts: {
//       phone: '05xxxxxxxx',
//       email: 'dr.fatima@example.com',
//     },
//     socialMedia: {
//       facebook: 'https://facebook.com/dr.fatima',
//       instagram: 'https://instagram.com/dr.fatima'
//     },
//     clinicLocation: {
//       address: 'شارع التحلية، جدة 21589'
//     }
//   },
//   {
//     id: 3,
//     name: 'د. خالد العمري',
//     specialty: 'طب أطفال',
//     specialties: [
//       {
//         id: '4',
//         name: 'طب أطفال',
//         consultationPrice: 160,
//         experienceYears: 10,
//         description: 'تخصص في رعاية الأطفال وحديثي الولادة'
//       }
//     ],
//     rating: 4.6,
//     status: 'inactive',
//     city: 'الدمام',
//     joinDate: '2025-01-05',
//     patients: 112,
//     consultations: 203,
//     activityPoints: 1120,
//     age: 35,
//     gender: 'male' as const,
//     documents: {
//       certificates: ['pediatric_cert.pdf'],
//       license: 'license.pdf',
//       id: 'id.pdf',
//       syndicate: 'syndicate.pdf',
//     },
//     contacts: {
//       phone: '05xxxxxxxx',
//       email: 'dr.khaled@example.com',
//     },
//     socialMedia: {
//       linkedin: 'https://linkedin.com/in/dr.khaled'
//     },
//     clinicLocation: {
//       address: 'شارع الخليج، الدمام 31952'
//     }
//   },
//   {
//     id: 4,
//     name: 'د. سارة محمد',
//     specialty: 'نفسية',
//     specialties: [
//       {
//         id: '5',
//         name: 'طب نفسي',
//         consultationPrice: 220,
//         experienceYears: 8,
//         description: 'تخصص في العلاج النفسي والسلوكي'
//       }
//     ],
//     rating: 4.7,
//     status: 'active',
//     city: 'الرياض',
//     joinDate: '2025-03-20',
//     patients: 87,
//     consultations: 176,
//     activityPoints: 1760,
//     age: 33,
//     gender: 'female' as const,
//     profileImage: '/api/placeholder/120/120',
//     documents: {
//       certificates: ['psych_cert.pdf'],
//       license: 'license.pdf',
//       id: 'id.pdf',
//       syndicate: 'syndicate.pdf',
//     },
//     contacts: {
//       phone: '05xxxxxxxx',
//       email: 'dr.sarah@example.com',
//     },
//     socialMedia: {
//       twitter: 'https://twitter.com/dr.sarah',
//       instagram: 'https://instagram.com/dr.sarah'
//     },
//     clinicLocation: {
//       address: 'حي العليا، الرياض 11564'
//     }
//   },
//   {
//     id: 5,
//     name: 'د. عبدالله الحربي',
//     specialty: 'عظام',
//     specialties: [
//       {
//         id: '6',
//         name: 'جراحة العظام',
//         consultationPrice: 250,
//         experienceYears: 18,
//         description: 'تخصص في جراحة العظام والمفاصل'
//       },
//       {
//         id: '7',
//         name: 'الطب الرياضي',
//         consultationPrice: 200,
//         experienceYears: 5,
//         description: 'تخصص فرعي في إصابات الرياضيين'
//       }
//     ],
//     rating: 4.5,
//     status: 'active',
//     city: 'مكة',
//     joinDate: '2025-01-30',
//     patients: 134,
//     consultations: 255,
//     activityPoints: 2210,
//     age: 48,
//     gender: 'male' as const,
//     documents: {
//       certificates: ['ortho_cert.pdf', 'sports_cert.pdf'],
//       license: 'license.pdf',
//       id: 'id.pdf',
//       syndicate: 'syndicate.pdf',
//     },
//     contacts: {
//       phone: '05xxxxxxxx',
//       email: 'dr.abdullah@example.com',
//     },
//     socialMedia: {
//       facebook: 'https://facebook.com/dr.abdullah',
//       linkedin: 'https://linkedin.com/in/dr.abdullah'
//     },
//     clinicLocation: {
//       address: 'حي الشوقية، مكة المكرمة 24231'
//     }
//   },
// ];

export const useDoctorsData = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOption[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [perPage, setPerPage] = useState(20);

  // جلب بيانات الأطباء مع دعم الصفحات
  const fetchDoctors = async (page: number = 1) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await safeGet(`/admin/doctors?page=${page}`);
      
      if (error) {
        setError(error);
        setIsLoading(false);
        return;
      }
      
      if (data && Array.isArray(data.data)) {
        // تحويل بيانات الـ API إلى الشكل المطلوب
        const mapped = data.data.map((item: any, index: number) => ({
          id: index + 1 + ((page - 1) * perPage), // إنشاء معرف مؤقت
          name: item.name,
          contacts: { email: item.email },
          email: item.email,
          specialty: item.specialty,
          city: item.city,
          status: item.status === 'مفعل' ? 'active' : 'inactive',
          rating: item.rating
        }));
        
        setDoctors(mapped);
        setCurrentPage(data.current_page || page);
        setTotalPages(data.last_page || 1);
        setTotalDoctors(data.total || 0);
        setPerPage(data.per_page || 20);
      }
    } catch (err) {
      setError({
        message: 'حدث خطأ أثناء جلب بيانات الأطباء',
        details: err
      });
    } finally {
      setIsLoading(false);
    }
  };

  // جلب البيانات عند تحميل المكون أو تغيير الصفحة
  useEffect(() => {
    fetchDoctors(currentPage);
  }, [currentPage]);

  // استخراج القيم الفريدة للفلاتر
  const specialties = [...new Set(doctors.map(doctor => doctor.specialty))];
  const cities = [...new Set(doctors.map(doctor => doctor.city))];

  // تطبيق الفلاتر والبحث
  const filteredDoctors = doctors.filter(doctor => {
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

  // إضافة طبيب
  const addDoctor = (newDoctorData: Omit<Doctor, 'id'>) => {
    // Here you would typically send a request to your backend API
    // For now, we'll just show a success message
    toast({
      title: "تم إضافة الطبيب بنجاح",
      description: `تم إضافة الطبيب ${newDoctorData.name} إلى النظام`,
    });
  };

  const clearFilters = () => {
    setFilters([]);
  };

  // وظائف التنقل بين الصفحات
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
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
    addDialogOpen,
    setAddDialogOpen,
    addFilter,
    removeFilter,
    clearFilters,
    viewDoctorDetails,
    toggleDoctorStatus,
    sendNotification,
    deleteDoctor,
    addDoctor,
    doctors,
    isLoading,
    error,
    // إضافة معلومات الصفحات
    currentPage,
    totalPages,
    totalDoctors,
    perPage,
    goToNextPage,
    goToPreviousPage,
    goToPage,
    fetchDoctors
  };
};
