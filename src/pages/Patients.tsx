import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import PatientsList from '@/components/patients/PatientsList';
import PatientDetails from '@/components/patients/PatientDetails';
import PatientsFilter from '@/components/patients/PatientsFilter';
import PatientForm from '@/components/patients/PatientForm';
import { usePatientsData } from '@/hooks/usePatientsData';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import ExportButton from '@/components/shared/ExportButton';

const Patients = () => {
  const {
    patients,
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
  } = usePatientsData();

  // Export columns configuration for patients
  const patientExportColumns = [
    { key: 'name', title: 'اسم المريض' },
    { key: 'email', title: 'البريد الإلكتروني' },
    { key: 'phone', title: 'الهاتف' },
    { key: 'gender', title: 'الجنس' },
    { key: 'dateOfBirth', title: 'تاريخ الميلاد' },
    { key: 'registrationDate', title: 'تاريخ التسجيل' },
    { key: 'status', title: 'الحالة' },
    { key: 'totalConsultations', title: 'عدد الاستشارات' },
    { key: 'lastConsultationDate', title: 'آخر استشارة' }
  ];

  const handleAddPatient = () => {
    setSelectedPatient(null);
    setIsAddDialogOpen(true);
  };

  const handleEditPatient = (patient: any) => {
    editPatient(patient);
  };

  const handleUpdatePatient = (updates: any) => {
    if (selectedPatient) {
      updatePatient(selectedPatient.id, updates);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <ExportButton
            data={patients}
            columns={patientExportColumns}
            filename="patients_list"
            title="قائمة المرضى"
          />
          <div className="text-right">
            <h1 className="text-3xl font-bold">إدارة المرضى</h1>
            <p className="text-gray-500 mt-1">متابعة حسابات المرضى واستشاراتهم</p>
          </div>
        </div>
      </div>

      <PatientsFilter 
        filters={filters}
        onFiltersChange={setFilters}
        onAddPatient={handleAddPatient}
      />

      <PatientsList 
        patients={patients}
        onViewDetails={viewPatientDetails}
        onEditPatient={handleEditPatient}
        onUpdateStatus={updatePatientStatus}
      />

      {/* Patient Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl text-right">تفاصيل المريض</DialogTitle>
          </DialogHeader>
          
          {selectedPatient && (
            <PatientDetails 
              patient={selectedPatient}
              consultations={getPatientConsultations(selectedPatient.id)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Add Patient Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl text-right">إضافة مريض جديد</DialogTitle>
          </DialogHeader>
          
          <PatientForm 
            onSubmit={addPatient}
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Patient Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl text-right">تعديل بيانات المريض</DialogTitle>
          </DialogHeader>
          
          {selectedPatient && (
            <PatientForm 
              patient={selectedPatient}
              onSubmit={handleUpdatePatient}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Patients;
