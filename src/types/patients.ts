
export interface Patient {
  id?: string | number;
  fullName?: string; // للتوافق مع API
  name?: string; // للتوافق مع الكود الموجود
  email: string;
  phoneNumber?: string; // للتوافق مع API
  phone?: string; // للتوافق مع الكود الموجود
  dateOfBirth?: string;
  birthday?: string; // للتوافق مع API
  gender: 'male' | 'female' | string;
  address?: string;
  photo?: string; // صورة شخصية من API
  profileImage?: string; // للتوافق مع الكود الموجود
  registrationDate?: string;
  status?: string; // 'مفعل' | 'غير مفعل' من API أو 'active' | 'blocked' | 'suspended' داخليًا
  created_at?: string;
  updated_at?: string;
  
  // Medical Information
  height?: number; // in cm
  weight?: number; // in kg
  generalDiseases?: string[];
  chronicDiseases?: string[];
  allergies?: string[];
  permanentMedications?: string[];
  previousSurgeries?: string[];
  radiologyImages?: string[];
  medicalImages?: string[]; // صور طبية (Base64 أو URL مؤقت)
  
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
