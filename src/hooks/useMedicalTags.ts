import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { 
  MedicalTag, 
  CreateMedicalTagRequest, 
  UpdateMedicalTagRequest,
  MedicalTagsResponse,
  MedicalTagResponse 
} from '@/types/specialties';

// دالة لجلب جميع التخصصات الطبية
const fetchMedicalTags = async (): Promise<MedicalTag[]> => {
  const response = await api.get<MedicalTagsResponse>('admin/medical-tags');
  return response.data.data;
};

// دالة لجلب تخصص طبي واحد
const fetchMedicalTag = async (id: number): Promise<MedicalTag> => {
  const response = await api.get<MedicalTagResponse>(`/admin/medical-tags/${id}`);
  return response.data.data;
};

// دالة لإنشاء تخصص طبي جديد
const createMedicalTag = async (data: CreateMedicalTagRequest): Promise<MedicalTag> => {
  const formData = new FormData();
  
  formData.append('name', data.name);
  if (data.name_ar) formData.append('name_ar', data.name_ar);
  if (data.description) formData.append('description', data.description);
  if (data.icon) formData.append('icon', data.icon);
  if (data.is_active !== undefined) formData.append('is_active', data.is_active ? '1' : '0');

  const response = await api.post<MedicalTagResponse>('admin/medical-tags', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data.data;
};

// دالة لتحديث تخصص طبي
const updateMedicalTag = async (id: number, data: UpdateMedicalTagRequest): Promise<MedicalTag> => {
  const formData = new FormData();
  
  if (data.name) formData.append('name', data.name);
  if (data.name_ar) formData.append('name_ar', data.name_ar);
  if (data.description) formData.append('description', data.description);
  if (data.icon) formData.append('icon', data.icon);
  if (data.is_active !== undefined) formData.append('is_active', data.is_active ? 'true' : 'false');
  
  // إضافة _method للـ Laravel لمحاكاة PUT request
  formData.append('_method', 'PUT');

  const response = await api.post<MedicalTagResponse>(`/admin/medical-tags/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data.data;
};

// دالة لحذف تخصص طبي
const deleteMedicalTag = async (id: number): Promise<void> => {
  await api.delete(`/admin/medical-tags/${id}`);
};

// Hook رئيسي لإدارة التخصصات الطبية
export const useMedicalTags = () => {
  const queryClient = useQueryClient();

  // جلب جميع التخصصات
  const {
    data: medicalTags = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['medical-tags'],
    queryFn: fetchMedicalTags,
    staleTime: 5 * 60 * 1000, // 5 دقائق
  });

  // إنشاء تخصص جديد
  const createMutation = useMutation({
    mutationFn: createMedicalTag,
    onSuccess: (newTag) => {
      queryClient.invalidateQueries({ queryKey: ['medical-tags'] });
      toast({
        title: 'تم بنجاح',
        description: 'تم إضافة التخصص الطبي بنجاح',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'خطأ',
        description: error.response?.data?.message || 'حدث خطأ أثناء إضافة التخصص الطبي',
        variant: 'destructive',
      });
    },
  });

  // تحديث تخصص
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateMedicalTagRequest }) =>
      updateMedicalTag(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medical-tags'] });
      toast({
        title: 'تم بنجاح',
        description: 'تم تحديث التخصص الطبي بنجاح',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'خطأ',
        description: error.response?.data?.message || 'حدث خطأ أثناء تحديث التخصص الطبي',
        variant: 'destructive',
      });
    },
  });

  // حذف تخصص
  const deleteMutation = useMutation({
    mutationFn: deleteMedicalTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medical-tags'] });
      toast({
        title: 'تم بنجاح',
        description: 'تم حذف التخصص الطبي بنجاح',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'خطأ',
        description: error.response?.data?.message || 'حدث خطأ أثناء حذف التخصص الطبي',
        variant: 'destructive',
      });
    },
  });

  return {
    // البيانات
    medicalTags,
    isLoading,
    error,
    
    // العمليات
    refetch,
    createMedicalTag: createMutation.mutate,
    updateMedicalTag: updateMutation.mutate,
    deleteMedicalTag: deleteMutation.mutate,
    
    // حالات التحميل
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};

// Hook لجلب تخصص واحد
export const useMedicalTag = (id: number) => {
  return useQuery({
    queryKey: ['medical-tag', id],
    queryFn: () => fetchMedicalTag(id),
    enabled: !!id,
  });
};