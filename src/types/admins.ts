export interface Admin {
  id: number;
  fullName: string;
  email: string;
  email_verified_at: string | null;
  phoneNumber: string;
  photoPath: string | null;
  address: string;
  birthday: string;
  gender: 'male' | 'female';
  role: string;
  isVerified: number;
  created_at: string;
  updated_at: string;
}

export interface AdminsResponse {
  current_page: number;
  data: Admin[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}