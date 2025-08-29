
import { useState, useMemo, useEffect } from 'react';
import { Patient, PatientConsultation, PatientFilters } from '@/types/patients';
import { safeGet } from '@/lib/api';

export const usePatientsData = () => {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [filters, setFilters] = useState<PatientFilters>({});
  const [patients, setPatientsData] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPatients, setTotalPatients] = useState(0);
  const [perPage, setPerPage] = useState(20);

  // جلب بيانات المرضى مع دعم الصفحات
  const fetchPatients = async (page: number = 1) => {
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await safeGet(`/admin/patients?page=${page}`);
      
      if (error) {
        setError(error);
        setIsLoading(false);
        return;
      }
      
      if (data && Array.isArray((data as any).data)) {
        // تحويل بيانات الـ API إلى الشكل المطلوب
        const mapped = (data as any).data.map((item: any, index: number) => ({
          id: (index + 1 + ((page - 1) * perPage)).toString(), // إنشاء معرف مؤقت
          name: item.name,
          email: item.email,
          address: item.address,
          gender: item.gender,
          dateOfBirth: item.birthday,
          birthday: item.birthday,
          height: item.height,
          weight: item.weight,
          status: item.status === 'مفعل' ? 'active' : 'blocked',
          // إضافة بيانات افتراضية للحقول المطلوبة
          registrationDate: new Date().toISOString().split('T')[0],
          totalConsultations: 0
        }));
        
        setPatientsData(mapped);
        setCurrentPage((data as any)?.current_page || page);
        setTotalPages((data as any)?.last_page || 1);
        setTotalPatients((data as any)?.total || 0);
        setPerPage((data as any)?.per_page || 20);
      }
    } catch (err) {
      setError({
        message: 'حدث خطأ أثناء جلب بيانات المرضى',
        details: err
      });
    } finally {
      setIsLoading(false);
    }
  };

  // جلب البيانات عند تحميل المكون أو تغيير الصفحة
  useEffect(() => {
    fetchPatients(currentPage);
  }, [currentPage]);

  // Mock consultations data
  const patientConsultations: PatientConsultation[] = [
    {
      id: '1',
      patientId: '1',
      doctorId: 'doc1',
      doctorName: 'د. محمد السعيد',
      specialty: 'طب باطني',
      date: '2024-05-20',
      status: 'completed',
      complaint: 'ألم في البطن',
      diagnosis: 'التهاب المعدة',
      prescription: 'أوميبرازول 20mg',
      cost: 150
    },
    {
      id: '2',
      patientId: '1',
      doctorId: 'doc2',
      doctorName: 'د. سارة أحمد',
      specialty: 'غدد صماء',
      date: '2024-04-15',
      status: 'completed',
      complaint: 'متابعة السكري',
      diagnosis: 'السكري مضبوط',
      prescription: 'استمرار العلاج الحالي',
      cost: 200
    }
  ];

  // Filter patients based on current filters
  const filteredPatients = useMemo(() => {
    return patients.filter(patient => {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const patientName = patient.user?.fullName || patient.fullName || patient.name || '';
        const patientEmail = patient.user?.email || patient.email || '';
        const patientPhone = patient.user?.phoneNumber || patient.phoneNumber || patient.phone || '';
        
        if (!patientName.toLowerCase().includes(searchLower) &&
            !patientEmail.toLowerCase().includes(searchLower) &&
            !patientPhone.includes(filters.search)) {
          return false;
        }
      }

      if (filters.status && patient.status !== filters.status) {
        return false;
      }

      const patientGender = patient.user?.gender || patient.gender;
      if (filters.gender && patientGender !== filters.gender) {
        return false;
      }

      if (filters.registrationDateFrom) {
        if (new Date(patient.registrationDate) < new Date(filters.registrationDateFrom)) {
          return false;
        }
      }

      if (filters.registrationDateTo) {
        if (new Date(patient.registrationDate) > new Date(filters.registrationDateTo)) {
          return false;
        }
      }

      return true;
    });
  }, [patients, filters]);

  const viewPatientDetails = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsDetailsDialogOpen(true);
  };

  const editPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsEditDialogOpen(true);
  };

  const updatePatientStatus = (patientId: string, status: Patient['status']) => {
    setPatientsData(prev => prev.map(patient => 
      String(patient.id) === String(patientId) ? { ...patient, status } : patient
    ));
  };

  const addPatient = (patientData: Omit<Patient, 'id' | 'registrationDate' | 'totalConsultations'>) => {
    const newPatient: Patient = {
      ...patientData,
      id: Date.now(),
      registrationDate: new Date().toISOString().split('T')[0],
      totalConsultations: 0
    };
    
    setPatientsData(prev => [...prev, newPatient]);
    setIsAddDialogOpen(false);
  };

  const updatePatient = (patientId: string, updates: Partial<Patient>) => {
    setPatientsData(prev => prev.map(patient => 
      String(patient.id) === String(patientId) ? { ...patient, ...updates } : patient
    ));
    setIsEditDialogOpen(false);
  };

  const getPatientConsultations = (patientId: string) => {
    return patientConsultations.filter(consultation => consultation.patientId === patientId);
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
    patients: isLoading ? [] : filteredPatients,
    selectedPatient,
    setSelectedPatient,
    isDetailsDialogOpen,
    setIsDetailsDialogOpen,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    filters,
    setFilters,
    viewPatientDetails,
    editPatient,
    updatePatientStatus,
    addPatient,
    updatePatient,
    getPatientConsultations,
    // إضافة معلومات الصفحات
    currentPage,
    totalPages,
    totalPatients,
    perPage,
    goToNextPage,
    goToPreviousPage,
    goToPage,
    fetchPatients,
    isLoading,
    error
  };
};
