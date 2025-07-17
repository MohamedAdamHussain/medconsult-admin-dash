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
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          {/* تنبيه وهمي */}
          <div className="bg-warning/10 text-warning border border-warning px-4 py-2 rounded mb-4">
            يرجى مراجعة بيانات الأطباء المعلقة.
          </div>
          <h1 className="text-3xl font-bold text-primary-main text-right w-full md:w-auto">إدارة الأطباء</h1>
          <h2 className="text-xl font-semibold text-secondary-main mt-2 text-right">قائمة الأطباء المسجلين</h2>
          <p className="text-muted mt-2 text-right w-full">يمكنك هنا إضافة، تعديل، أو حذف بيانات الأطباء.</p>
        </div>
        <div className="flex flex-row-reverse gap-2 w-full md:w-auto justify-start md:justify-end">
          <Button 
            onClick={() => setAddDialogOpen(true)}
            className="flex items-center gap-2 bg-primary-main text-white hover:bg-blue-700 px-4 py-2 rounded-lg shadow"
          >
            <Plus size={16} />
            إضافة طبيب
          </Button>
          {/* زر ثانوي */}
          <Button className="bg-secondary-main text-white hover:bg-green-600 px-4 py-2 rounded-lg">تصدير القائمة</Button>
          {/* زر تحذير */}
          <Button className="bg-danger text-white hover:bg-red-700 px-4 py-2 rounded-lg">حذف المحدد</Button>
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
