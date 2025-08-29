
export interface Patient {
  id: number;
  user_id: number;
  fakeName?: string;
  height?: number; // in cm
  weight?: number; // in kg
  created_at: string;
  updated_at: string;
  user: {
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
  
  // Legacy fields for compatibility with existing code
  name?: string;
  phone?: string;
  dateOfBirth?: string;
  photo?: string;
  profileImage?: string;
  registrationDate?: string;
  status?: string;
  
  // Medical Information
  generalDiseases?: string[];
  chronicDiseases?: string[];
  allergies?: string[];
  permanentMedications?: string[];
  previousSurgeries?: string[];
  radiologyImages?: string[];
  medicalImages?: string[];
  
  // Statistics
  totalConsultations?: number;
  lastConsultationDate?: string;
}

// نوع البيانات لتسجيل مريض جديد
export interface CreatePatientRequest {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  photo?: File;
  address: string;
  birthday: string; // تاريخ بصيغة YYYY-MM-DD
  gender: string; // 'male' أو 'female'
}

// نوع البيانات لتحديث مريض
export interface UpdatePatientRequest {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  photo?: File;
  address?: string;
  birthday?: string;
  gender?: string;
}

// نوع استجابة API
export interface PatientResponse {
  status: string;
  message: string;
  data: Patient;
}

export interface PatientsResponse {
  status: string;
  data: Patient[];
  meta?: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}

export interface PatientConsultation {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  date: string;
  status: 'completed' | 'cancelled' | 'in_progress';
  complaint: string;
  diagnosis?: string;
  prescription?: string;
  cost: number;
}

export interface PatientFilters {
  search?: string;
  status?: string;
  gender?: string;
  registrationDateFrom?: string;
  registrationDateTo?: string;
}
