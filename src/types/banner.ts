export interface MedicalBanner {
  id: number;
  title: string;
  image_url: string;
  link?: string;
  is_active: boolean;
  expires_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateBannerRequest {
  title: string;
  image: File;
  link?: string;
  is_active?: boolean;
  expires_at?: string;
}

export interface UpdateBannerRequest {
  title?: string;
  image?: File;
  link?: string;
  expires_at?: string;
}