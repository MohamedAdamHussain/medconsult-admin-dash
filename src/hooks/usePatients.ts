import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { 
  Patient, 
  CreatePatientRequest, 
  UpdatePatientRequest,
  PatientsResponse,
  PatientResponse 
} from '@/types/patients';

// دالة لجلب جميع المرضى
const fetchPatients = async (): Promise<Patient[]> => {
  const response = await api.get<PatientsResponse>('/admin/patients');
  return response.data.data;
};

// دالة لجلب مريض واحد
const fetchPatient = async (id: number): Promise<Patient> => {
  const response = await api.get<PatientResponse>(`/admin/patients/${id}`);
  return response.data.data;
};

// دالة لتسجيل مريض جديد
const createPatient = async (data: CreatePatientRequest): Promise<Patient> => {
  const formData = new FormData();
  
  formData.append('fullName', data.fullName);
  formData.append('email', data.email);
  formData.append('password', data.password);
  formData.append('phoneNumber', data.phoneNumber);
  formData.append('address', data.address);
  formData.append('birthday', data.birthday);
  formData.append('gender', data.gender);
  
  if (data.photo) {
    formData.append('photo', data.photo);
  }

  const response = await api.post<PatientResponse>('/register', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data.data;
};

// دالة لتحديث مريض
const updatePatient = async (id: number, data: UpdatePatientRequest): Promise<Patient> => {
  const formData = new FormData();
  
  if (data.fullName) formData.append('fullName', data.fullName);
  if (data.email) formData.append('email', data.email);
  if (data.phoneNumber) formData.append('phoneNumber', data.phoneNumber);
  if (data.address) formData.append('address', data.address);
  if (data.birthday) formData.append('birthday', data.birthday);
  if (data.gender) formData.append('gender', data.gender);
  if (data.photo) formData.append('photo', data.photo);
  
  // إضافة _method للـ Laravel لمحاكاة PUT request
  formData.append('_method', 'PUT');

  const response = await api.post<PatientResponse>(`/admin/patients/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data.data;
};

// دالة لحذف مريض
const deletePatient = async (id: number): Promise<void> => {
  await api.delete(`/admin/patients/${id}`);
};

// Hook رئيسي لإدارة المرضى
export const usePatients = () => {
  const queryClient = useQueryClient();

  // جلب جميع المرضى
  const {
    data: patients = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['patients'],
    queryFn: fetchPatients,
    staleTime: 5 * 60 * 1000, // 5 دقائق
  });

  // تسجيل مريض جديد
  const createMutation = useMutation({
    mutationFn: createPatient,
    onSuccess: (newPatient) => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      toast({
        title: 'تم بنجاح',
        description: 'تم تسجيل المريض بنجاح',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'خطأ',
        description: error.response?.data?.message || 'حدث خطأ أثناء تسجيل المريض',
        variant: 'destructive',
      });
    },
  });

  // تحديث مريض
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdatePatientRequest }) =>
      updatePatient(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      toast({
        title: 'تم بنجاح',
        description: 'تم تحديث بيانات المريض بنجاح',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'خطأ',
        description: error.response?.data?.message || 'حدث خطأ أثناء تحديث بيانات المريض',
        variant: 'destructive',
      });
    },
  });

  // حذف مريض
  const deleteMutation = useMutation({
    mutationFn: deletePatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      toast({
        title: 'تم بنجاح',
        description: 'تم حذف المريض بنجاح',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'خطأ',
        description: error.response?.data?.message || 'حدث خطأ أثناء حذف المريض',
        variant: 'destructive',
      });
    },
  });

  return {
    // البيانات
    patients,
    isLoading,
    error,
    
    // العمليات
    refetch,
    createPatient: createMutation.mutate,
    updatePatient: updateMutation.mutate,
    deletePatient: deleteMutation.mutate,
    
    // حالات التحميل
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};

// Hook لجلب مريض واحد
export const usePatient = (id: number) => {
  return useQuery({
    queryKey: ['patient', id],
    queryFn: () => fetchPatient(id),
    enabled: !!id,
  });
};