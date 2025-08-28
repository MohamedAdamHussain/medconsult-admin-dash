import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '@/lib/api';
import { MedicalBanner, CreateBannerRequest, UpdateBannerRequest } from '@/types/banner';

// جلب جميع البانرات
const fetchBanners = async (): Promise<{ data: MedicalBanner[] }> => {
  const response = await api.get('/medical-banners');
  return response.data;
};

// إنشاء بانر جديد
const createBanner = async (data: CreateBannerRequest): Promise<MedicalBanner> => {
  const formData = new FormData();
  formData.append('title', data.title);
  formData.append('image', data.image);
  if (data.link) formData.append('link', data.link);
  if (data.is_active !== undefined) formData.append('is_active', data.is_active.toString() == "true" ? "1" : "0");
  if (data.expires_at) formData.append('expires_at', data.expires_at);

  const response = await api.post('/medical-banners', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// تحديث بانر
const updateBanner = async ({ id, data }: { id: number; data: UpdateBannerRequest }): Promise<MedicalBanner> => {
  const formData = new FormData();
  if (data.title) formData.append('title', data.title);
  if (data.image) formData.append('image', data.image);
  if (data.link !== undefined) formData.append('link', data.link || '');
  if (data.expires_at !== undefined) formData.append('expires_at', data.expires_at || '');
  formData.append('_method', 'PUT');

  const response = await api.post(`/medical-banners/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// حذف بانر
const deleteBanner = async (id: number): Promise<void> => {
  await api.delete(`/medical-banners/${id}`);
};

// تفعيل/تعطيل بانر
const toggleBannerActive = async (id: number): Promise<MedicalBanner> => {
  const response = await api.patch(`/medical-banners/${id}/toggle-active`);
  return response.data;
};

export const useMedicalBanners = () => {
  const queryClient = useQueryClient();

  const {
    data: bannersData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['medical-banners'],
    queryFn: fetchBanners,
  });

  const createMutation = useMutation({
    mutationFn: createBanner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medical-banners'] });
      toast.success('تم إنشاء البانر بنجاح');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'حدث خطأ أثناء إنشاء البانر');
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateBanner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medical-banners'] });
      toast.success('تم تحديث البانر بنجاح');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'حدث خطأ أثناء تحديث البانر');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBanner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medical-banners'] });
      toast.success('تم حذف البانر بنجاح');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'حدث خطأ أثناء حذف البانر');
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: toggleBannerActive,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medical-banners'] });
      toast.success('تم تحديث حالة البانر بنجاح');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'حدث خطأ أثناء تحديث حالة البانر');
    },
  });

  return {
    banners: bannersData?.data || [],
    isLoading,
    error,
    refetch,
    createBanner: createMutation.mutate,
    updateBanner: updateMutation.mutate,
    deleteBanner: deleteMutation.mutate,
    toggleActive: toggleActiveMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isToggling: toggleActiveMutation.isPending,
  };
};