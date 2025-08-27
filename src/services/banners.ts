import { ApiResult, safeDelete, safeGet, safePatch, safePost, safePut, apiOrigin } from '@/lib/api';
import { MedicalBanner, MedicalBannersIndexResponse } from '@/types/medicalBanner';

export function resolveImageUrl(imagePathOrUrl: string): string {
  if (!imagePathOrUrl) return '';
  if (imagePathOrUrl.startsWith('http')) return imagePathOrUrl;
  // Laravel Storage::url usually returns "/storage/..."
  const path = imagePathOrUrl.startsWith('/') ? imagePathOrUrl : `/storage/${imagePathOrUrl}`;
  // Prefix with backend origin to avoid broken previews when frontend is on a different host/port
  return apiOrigin ? `${apiOrigin}${path}` : path;
}

export async function listBanners(): Promise<ApiResult<MedicalBannersIndexResponse>> {
  return safeGet<MedicalBannersIndexResponse>('/medical-banners');
}

export async function getBanner(id: number): Promise<ApiResult<MedicalBanner>> {
  return safeGet<MedicalBanner>(`/medical-banners/${id}`);
}

export interface CreateBannerBody {
  title: string;
  image: File;
  link?: string | null;
  is_active?: boolean;
  expires_at?: string | null;
}

export async function createBanner(body: CreateBannerBody): Promise<ApiResult<MedicalBanner>> {
  const formData = new FormData();
  formData.append('title', body.title);
  formData.append('image', body.image);
  if (body.link !== undefined && body.link !== null) formData.append('link', String(body.link));
  if (body.is_active !== undefined) formData.append('is_active', body.is_active ? '1' : '0');
  if (body.expires_at) formData.append('expires_at', body.expires_at);
  return safePost<MedicalBanner, FormData>('/medical-banners', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

export interface UpdateBannerBody {
  title?: string;
  image?: File;
  link?: string | null;
  expires_at?: string | null;
}

export async function updateBanner(id: number, body: UpdateBannerBody): Promise<ApiResult<MedicalBanner>> {
  const formData = new FormData();
  if (body.title !== undefined) formData.append('title', body.title);
  if (body.image) formData.append('image', body.image);
  if (body.link !== undefined) formData.append('link', body.link ?? '');
  if (body.expires_at !== undefined && body.expires_at !== null) formData.append('expires_at', body.expires_at);
  return safePost<MedicalBanner, FormData>(`/medical-banners/${id}?_method=PUT`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

export async function deleteBanner(id: number): Promise<ApiResult<{ message: string }>> {
  return safeDelete<{ message: string }>(`/medical-banners/${id}`);
}

export async function toggleBannerActive(id: number): Promise<ApiResult<MedicalBanner>> {
  return safePatch<MedicalBanner>(`/medical-banners/${id}/toggle-active`);
}


