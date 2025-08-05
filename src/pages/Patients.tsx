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
import Pagination from '@/components/shared/Pagination';
import { AlertTriangle, Loader2 } from 'lucide-react';

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
    getPatientConsultations,
    // معلومات الصفحات
    currentPage,
    totalPages,
    totalPatients,
    perPage,
    goToPage,
    isLoading,
    error
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
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary-main text-right w-full md:w-auto">إدارة المرضى</h1>
          <p className="text-gray-500 mt-2 text-right w-full">إدارة بيانات المرضى المسجلين ومتابعة حالاتهم</p>
        </div>
        <div className="flex flex-row-reverse gap-2 w-full md:w-auto justify-start md:justify-end">
          <ExportButton
            data={patients}
            columns={patientExportColumns}
            filename="patients_list"
            title="قائمة المرضى"
          />
          {/* أزرار أخرى إن وجدت */}
        </div>
      </div>

      <PatientsFilter 
        filters={filters}
        onFiltersChange={setFilters}
        onAddPatient={handleAddPatient}
      />

      {/* رسالة تحميل */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-8 text-blue-600 font-bold gap-2">
          <Loader2 className="animate-spin h-8 w-8 mb-2" />
          <span>يتم الآن تحميل المرضى، يرجى الانتظار...</span>
        </div>
      )}

      {/* رسالة خطأ */}
      {error && (
        <div className="flex flex-col items-center justify-center py-8 text-red-600 font-bold gap-2">
          <AlertTriangle className="h-8 w-8 mb-2" />
          <span>
            تعذر تحميل المرضى. تحقق من اتصالك أو حاول مرة أخرى لاحقًا.
          </span>
          {error.message && (
            <span className="text-xs text-red-400 mt-1">{error.message}</span>
          )}
        </div>
      )}

      {/* قائمة المرضى */}
      {!isLoading && !error && (
        <>
          <PatientsList 
            patients={patients}
            onViewDetails={viewPatientDetails}
            onEditPatient={handleEditPatient}
            onUpdateStatus={updatePatientStatus}
          />
          
          {/* مكون التنقل بين الصفحات */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
            totalItems={totalPatients}
            itemsPerPage={perPage}
          />
        </>
      )}

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
