export interface Consultation {
  id: number;
  patient_id: number;
  doctor_id: number;
  medical_tag_id: number;
  isSpecial: boolean;
  problem: string;
  media: string | null;
  isAnonymous: boolean;
  fee: number;
  status: 'scheduled' | 'completed' | 'cancelled' | 'pending';
  scheduled_at: string;
  reminder_before_minutes: number;
  created_at: string;
  updated_at: string;
  user: {
    id?: number;
    name?: string | null;
  } | null;
  doctor: {
    id: number;
    name?: string | null;
    user_id: number;
    bio: string;
    activatePoint: string;
    rating: number;
    work_days: string;
    work_time_in: string;
    work_time_out: string;
    certificate_images: string;
    time_for_waiting: number;
    facebook_url: string | null;
    instagram_url: string | null;
    twitter_url: string | null;
    address: string;
    created_at: string;
    updated_at: string;
  };
  medical_tag: {
    id: number;
    name: string;
    name_ar: string;
    description: string;
    icon: string;
    is_active: boolean;
    order: number;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
  };
}

export interface ConsultationsResponse {
  status: string;
  data: Consultation[];
}

export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface PaginatedData<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: PaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface PaginatedConsultationsResponse {
  status: string;
  data: PaginatedData<Consultation>;
}