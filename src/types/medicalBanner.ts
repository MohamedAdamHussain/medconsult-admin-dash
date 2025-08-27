export interface MedicalBanner {
  id: number;
  title: string;
  image_url: string; // stored path or absolute URL
  link?: string | null;
  is_active: boolean;
  expires_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface MedicalBannersIndexResponse {
  data: MedicalBanner[];
}


