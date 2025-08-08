import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from '@/hooks/use-toast';

// أنواع البيانات لتسجيل المريض
export interface PatientRegistrationRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone?: string;
  gender: 'male' | 'female';
  birthday?: string;
  address?: string;
  height?: number;
  weight?: number;
  general_diseases?: string[];
  chronic_diseases?: string[];
  allergies?: string[];
  permanent_medications?: string[];
  previous_surgeries?: string[];
  profile_image?: File;
  medical_images?: File[];
}

export interface PatientRegistrationResponse {
  status: string;
  message: string;
  data: {
    id: number;
    name: string;
    email: string;
    phone?: string;
    gender: string;
    birthday?: string;
    address?: string;
    height?: number;
    weight?: number;
    general_diseases?: string[];
    chronic_diseases?: string[];
    allergies?: string[];
    permanent_medications?: string[];
    previous_surgeries?: string[];
    profile_image?: string;
    medical_images?: string[];
    created_at: string;
    updated_at: string;
  };
}

// دالة تسجيل المريض
const registerPatient = async (data: PatientRegistrationRequest): Promise<PatientRegistrationResponse> => {
  const formData = new FormData();
  
  // إضافة البيانات الأساسية
  formData.append('name', data.name);
  formData.append('email', data.email);
  formData.append('password', data.password);
  formData.append('password_confirmation', data.password_confirmation);
  
  // إضافة البيانات الاختيارية
  if (data.phone) formData.append('phone', data.phone);
  formData.append('gender', data.gender);
  if (data.birthday) formData.append('birthday', data.birthday);
  if (data.address) formData.append('address', data.address);
  if (data.height) formData.append('height', data.height.toString());
  if (data.weight) formData.append('weight', data.weight.toString());
  
  // إضافة المصفوفات الطبية
  if (data.general_diseases && data.general_diseases.length > 0) {
    data.general_diseases.forEach((disease, index) => {
      formData.append(`general_diseases[${index}]`, disease);
    });
  }
  
  if (data.chronic_diseases && data.chronic_diseases.length > 0) {
    data.chronic_diseases.forEach((disease, index) => {
      formData.append(`chronic_diseases[${index}]`, disease);
    });
  }
  
  if (data.allergies && data.allergies.length > 0) {
    data.allergies.forEach((allergy, index) => {
      formData.append(`allergies[${index}]`, allergy);
    });
  }
  
  if (data.permanent_medications && data.permanent_medications.length > 0) {
    data.permanent_medications.forEach((medication, index) => {
      formData.append(`permanent_medications[${index}]`, medication);
    });
  }
  
  if (data.previous_surgeries && data.previous_surgeries.length > 0) {
    data.previous_surgeries.forEach((surgery, index) => {
      formData.append(`previous_surgeries[${index}]`, surgery);
    });
  }
  
  // إضافة الصور
  if (data.profile_image) {
    formData.append('profile_image', data.profile_image);
  }
  
  if (data.medical_images && data.medical_images.length > 0) {
    data.medical_images.forEach((image, index) => {
      formData.append(`medical_images[${index}]`, image);
    });
  }

  const response = await api.post<PatientRegistrationResponse>('/register', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

// Hook لتسجيل المرضى
export const usePatientRegistration = () => {
  const queryClient = useQueryClient();

  const registrationMutation = useMutation({
    mutationFn: registerPatient,
    onSuccess: (response) => {
      // تحديث قائمة المرضى إذا كانت موجودة
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      
      toast({
        title: 'تم بنجاح',
        description: response.message || 'تم تسجيل المريض بنجاح',
      });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'حدث خطأ أثناء تسجيل المريض';
      const validationErrors = error.response?.data?.errors;
      
      let description = errorMessage;
      if (validationErrors) {
        const firstError = Object.values(validationErrors)[0];
        if (Array.isArray(firstError) && firstError.length > 0) {
          description = firstError[0] as string;
        }
      }
      
      toast({
        title: 'خطأ في التسجيل',
        description,
        variant: 'destructive',
      });
    },
  });

  return {
    registerPatient: registrationMutation.mutate,
    isRegistering: registrationMutation.isPending,
    registrationError: registrationMutation.error,
    registrationData: registrationMutation.data,
    reset: registrationMutation.reset,
  };
};