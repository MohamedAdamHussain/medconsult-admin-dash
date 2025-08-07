// أنواع البيانات للتخصصات الطبية
export interface MedicalTag {
  id: number;
  name: string;
  name_ar?: string;
  description?: string;
  icon?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

// نوع البيانات لإنشاء تخصص جديد
export interface CreateMedicalTagRequest {
  name: string;
  name_ar?: string;
  description?: string;
  icon?: File;
  is_active?: boolean;
}

// نوع البيانات لتحديث تخصص موجود
export interface UpdateMedicalTagRequest {
  name?: string;
  name_ar?: string;
  description?: string;
  icon?: File;
  is_active?: boolean;
}

// نوع الاستجابة من API
export interface MedicalTagsResponse {
  data: MedicalTag[];
  meta?: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}

// نوع الاستجابة لتخصص واحد
export interface MedicalTagResponse {
  data: MedicalTag;
}