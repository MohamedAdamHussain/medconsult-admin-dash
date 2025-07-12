import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import DoctorDetails from '@/components/doctors/DoctorDetails';
import DoctorsList from '@/components/doctors/DoctorsList';
import SearchAndFilter from '@/components/doctors/SearchAndFilter';
import AddDoctorDialog from '@/components/doctors/AddDoctorDialog';
import { useDoctorsData } from '@/hooks/useDoctorsData';
import ExportButton from '@/components/shared/ExportButton';

const Doctors = () => {
  const {
    searchQuery,
    setSearchQuery,
    filters,
    filteredDoctors,
    specialties,
    cities,
    selectedDoctor,
    detailsDialogOpen,
    setDetailsDialogOpen,
    addDialogOpen,
    setAddDialogOpen,
    addFilter,
    removeFilter,
    clearFilters,
    viewDoctorDetails,
    toggleDoctorStatus,
    sendNotification,
    deleteDoctor,
    addDoctor
  } = useDoctorsData();

  // Export columns configuration for doctors
  const doctorExportColumns = [
    { key: 'name', title: 'اسم الطبيب' },
    { key: 'specialty', title: 'التخصص' },
    { key: 'city', title: 'المدينة' },
    { key: 'status', title: 'الحالة' },
    { key: 'rating', title: 'التقييم' },
    { key: 'patients', title: 'عدد المرضى' },
    { key: 'consultations', title: 'عدد الاستشارات' },
    { key: 'joinDate', title: 'تاريخ الانضمام' },
    { key: 'contacts.phone', title: 'الهاتف' },
    { key: 'contacts.email', title: 'البريد الإلكتروني' }
  ];

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4 md:gap-0">
        <h1 className="text-3xl font-bold text-right w-full md:w-auto">إدارة الأطباء</h1>
        <div className="flex flex-row-reverse gap-2 w-full md:w-auto justify-start md:justify-end">
          <Button 
            onClick={() => setAddDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus size={16} />
            إضافة طبيب
          </Button>
          <ExportButton
            data={filteredDoctors}
            columns={doctorExportColumns}
            filename="doctors_list"
            title="قائمة الأطباء"
          />
        </div>
      </div>
      
      <SearchAndFilter 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filters={filters}
        onAddFilter={addFilter}
        onRemoveFilter={removeFilter}
        onClearFilters={clearFilters}
        specialties={specialties}
        cities={cities}
      />
      
      <DoctorsList 
        doctors={filteredDoctors}
        onViewDetails={viewDoctorDetails}
        onToggleStatus={toggleDoctorStatus}
        onSendNotification={sendNotification}
        onDeleteDoctor={deleteDoctor}
      />
      
      {/* مودال تفاصيل الطبيب */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl text-right">تفاصيل الطبيب</DialogTitle>
          </DialogHeader>
          
          {selectedDoctor && (
            <DoctorDetails doctor={selectedDoctor} />
          )}
        </DialogContent>
      </Dialog>

      {/* مودال إضافة طبيب */}
      <AddDoctorDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onAddDoctor={addDoctor}
        specialties={specialties}
        cities={cities}
      />
    </DashboardLayout>
  );
};

export default Doctors;
