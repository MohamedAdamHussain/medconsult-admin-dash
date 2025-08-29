
export interface Specialty {
  id: string;
  name: string;
  consultationPrice: number;
  experienceYears: number;
  description: string;
}

export interface Doctor {
  id: number;
  user_id: number;
  bio: string;
  activatePoint: string;
  rating: number | null;
  work_days: string | null;
  work_time_in: string | null;
  work_time_out: string | null;
  certificate_images: string;
  time_for_waiting: number | null;
  facebook_url: string | null;
  instagram_url: string | null;
  twitter_url: string | null;
  address: string | null;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    fullName: string;
    email: string;
    email_verified_at: string | null;
    phoneNumber: string;
    photoPath: string;
    address: string;
    birthday: string;
    gender: string;
    role: string;
    isVerified: number;
    created_at: string;
    updated_at: string;
  };
  specialties?: Array<{
    id: number;
    doctor_id: number;
    medical_tag_id: number;
    start_time: string;
    end_time: string;
    yearOfExper: string;
    photo: string | null;
    consultation_fee: string;
    description: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
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
  }>;
  
  // Legacy compatibility fields
  name?: string;
  specialty?: string;
  status?: string;
  city?: string;
  contacts?: {
    phone?: string;
    email?: string;
  };
}

export interface DoctorDetailsResponse {
  status: string;
  data: Doctor;
}

export type FilterOption = {
  type: 'specialty' | 'status' | 'city';
  value: string;
}
