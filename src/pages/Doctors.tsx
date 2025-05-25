
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

  return (
    <DashboardLayout>
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <Button 
            onClick={() => setAddDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus size={16} />
            إضافة طبيب
          </Button>
          <div className="text-right">
            <h1 className="text-3xl font-bold">إدارة الأطباء</h1>
            <p className="text-gray-500 mt-1">إدارة وعرض معلومات الأطباء</p>
          </div>
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
