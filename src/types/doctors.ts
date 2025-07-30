
export interface Specialty {
  id: string;
  name: string;
  consultationPrice: number;
  experienceYears: number;
  description: string;
}

export interface Doctor {
  id?: number;
  name: string;
  specialty: string | null; // Main specialty for backward compatibility
  specialties?: Specialty[]; // Multiple specialties
  rating: number;
  status: string;
  city: string;
  joinDate?: string;
  patients?: number;
  consultations?: number;
  activityPoints?: number;
  age?: number;
  gender?: 'male' | 'female';
  profileImage?: string;
  documents?: {
    certificates: string[]; // Multiple certificate images
    license: string;
    id: string;
    syndicate: string; // بطاقة النقابة
  };
  contacts: {
    phone?: string;
    email: string;
  };
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  clinicLocation?: {
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  email?: string; // لدعم البيانات القادمة من API
}

export type FilterOption = {
  type: 'specialty' | 'status' | 'city';
  value: string;
}
