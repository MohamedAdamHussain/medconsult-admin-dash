
import { useState, useMemo } from 'react';
import { Patient, PatientConsultation, PatientFilters } from '@/types/patients';

export const usePatientsData = () => {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [filters, setFilters] = useState<PatientFilters>({});

  // Mock data for patients
  const [patients, setPatientsData] = useState<Patient[]>([
    {
      id: '1',
      name: 'أحمد محمد علي',
      email: 'ahmed@example.com',
      phone: '+966501234567',
      dateOfBirth: '1985-03-15',
      gender: 'male',
      registrationDate: '2024-01-15',
      status: 'active',
      height: 175,
      weight: 80,
      generalDiseases: ['ضغط الدم'],
      chronicDiseases: ['السكري النوع الثاني'],
      allergies: ['البنسلين'],
      permanentMedications: ['ميتفورمين', 'أملوديبين'],
      previousSurgeries: ['استئصال الزائدة الدودية'],
      totalConsultations: 5,
      lastConsultationDate: '2024-05-20'
    },
    {
      id: '2',
      name: 'فاطمة أحمد',
      email: 'fatima@example.com',
      phone: '+966507654321',
      dateOfBirth: '1990-08-22',
      gender: 'female',
      registrationDate: '2024-02-10',
      status: 'active',
      height: 165,
      weight: 65,
      allergies: ['المكسرات'],
      totalConsultations: 3,
      lastConsultationDate: '2024-05-18'
    }
  ]);

  // Mock consultations data
  const patientConsultations: PatientConsultation[] = [
    {
      id: '1',
      patientId: '1',
      doctorId: 'doc1',
      doctorName: 'د. محمد السعيد',
      specialty: 'طب باطني',
      date: '2024-05-20',
      status: 'completed',
      complaint: 'ألم في البطن',
      diagnosis: 'التهاب المعدة',
      prescription: 'أوميبرازول 20mg',
      cost: 150
    },
    {
      id: '2',
      patientId: '1',
      doctorId: 'doc2',
      doctorName: 'د. سارة أحمد',
      specialty: 'غدد صماء',
      date: '2024-04-15',
      status: 'completed',
      complaint: 'متابعة السكري',
      diagnosis: 'السكري مضبوط',
      prescription: 'استمرار العلاج الحالي',
      cost: 200
    }
  ];

  // Filter patients based on current filters
  const filteredPatients = useMemo(() => {
    return patients.filter(patient => {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        if (!patient.name.toLowerCase().includes(searchLower) &&
            !patient.email.toLowerCase().includes(searchLower) &&
            !patient.phone.includes(filters.search)) {
          return false;
        }
      }

      if (filters.status && patient.status !== filters.status) {
        return false;
      }

      if (filters.gender && patient.gender !== filters.gender) {
        return false;
      }

      if (filters.registrationDateFrom) {
        if (new Date(patient.registrationDate) < new Date(filters.registrationDateFrom)) {
          return false;
        }
      }

      if (filters.registrationDateTo) {
        if (new Date(patient.registrationDate) > new Date(filters.registrationDateTo)) {
          return false;
        }
      }

      return true;
    });
  }, [patients, filters]);

  const viewPatientDetails = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsDetailsDialogOpen(true);
  };

  const editPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsEditDialogOpen(true);
  };

  const updatePatientStatus = (patientId: string, status: Patient['status']) => {
    setPatientsData(prev => prev.map(patient => 
      patient.id === patientId ? { ...patient, status } : patient
    ));
  };

  const addPatient = (patientData: Omit<Patient, 'id' | 'registrationDate' | 'totalConsultations'>) => {
    const newPatient: Patient = {
      ...patientData,
      id: Date.now().toString(),
      registrationDate: new Date().toISOString().split('T')[0],
      totalConsultations: 0
    };
    
    setPatientsData(prev => [...prev, newPatient]);
    setIsAddDialogOpen(false);
  };

  const updatePatient = (patientId: string, updates: Partial<Patient>) => {
    setPatientsData(prev => prev.map(patient => 
      patient.id === patientId ? { ...patient, ...updates } : patient
    ));
    setIsEditDialogOpen(false);
  };

  const getPatientConsultations = (patientId: string) => {
    return patientConsultations.filter(consultation => consultation.patientId === patientId);
  };

  return {
    patients: filteredPatients,
    selectedPatient,
    setSelectedPatient,
    isDetailsDialogOpen,
    setIsDetailsDialogOpen,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    filters,
    setFilters,
    viewPatientDetails,
    editPatient,
    updatePatientStatus,
    addPatient,
    updatePatient,
    getPatientConsultations
  };
};
