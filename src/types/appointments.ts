import { Doctor } from './doctors';
import { Patient } from './patients';

export interface Appointment {
  id: number;
  patient_id: number;
  doctor_id: number;
  doctor_note: string | null;
  user_note: string | null;
  date: string;
  day: string;
  time: string;
  created_at: string;
  updated_at: string;
  doctor: Doctor;
  patient: Patient;
}

export interface AppointmentsResponse {
  status: boolean;
  data: Appointment[];
}