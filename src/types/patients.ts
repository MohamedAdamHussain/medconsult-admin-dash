
export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'male' | 'female';
  registrationDate: string;
  status: 'active' | 'blocked' | 'suspended';
  
  // Medical Information
  height?: number; // in cm
  weight?: number; // in kg
  generalDiseases?: string[];
  chronicDiseases?: string[];
  allergies?: string[];
  permanentMedications?: string[];
  previousSurgeries?: string[];
  radiologyImages?: string[];
  
  // Statistics
  totalConsultations: number;
  lastConsultationDate?: string;
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
