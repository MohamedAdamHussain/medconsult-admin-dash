import DashboardLayout from "@/components/dashboard/DashboardLayout";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2, Plus } from "lucide-react";
import DoctorDetails from "@/components/doctors/DoctorDetails";
import DoctorsList from "@/components/doctors/DoctorsList";
import SearchAndFilter from "@/components/doctors/SearchAndFilter";
import AddDoctorDialog from "@/components/doctors/AddDoctorDialog";
import { useDoctorsData } from "@/hooks/useDoctorsData";
import ExportButton from "@/components/shared/ExportButton";
import Pagination from "@/components/shared/Pagination";

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
    addDoctor,
    doctors,
    isLoading,
    error,
    // معلومات الصفحات
    currentPage,
    totalPages,
    totalDoctors,
    perPage,
    goToPage,
  } = useDoctorsData();
  console.log(doctors)
  // Export columns configuration for doctors
  const doctorExportColumns = [
    { key: "name", title: "اسم الطبيب" },
    { key: "specialty", title: "التخصص" },
    { key: "city", title: "المدينة" },
    { key: "status", title: "الحالة" },
    { key: "rating", title: "التقييم" },
    { key: "patients", title: "عدد المرضى" },
    { key: "consultations", title: "عدد الاستشارات" },
    { key: "joinDate", title: "تاريخ الانضمام" },
    { key: "contacts.phone", title: "الهاتف" },
    { key: "contacts.email", title: "البريد الإلكتروني" },
  ];

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary-main text-right w-full md:w-auto">
            إدارة الأطباء
          </h1>
          <h2 className="text-xl font-semibold text-secondary-main mt-2 text-right">
            قائمة الأطباء المسجلين
          </h2>
          <p className="text-muted mt-2 text-right w-full">
            يمكنك هنا إضافة، تعديل، أو حذف بيانات الأطباء.
          </p>
        </div>
        <div className="flex flex-row-reverse gap-2 w-full md:w-auto justify-start md:justify-end">
          <Button
            onClick={() => setAddDialogOpen(true)}
            className="flex items-center gap-2 bg-primary-main text-white hover:bg-blue-700 px-4 py-2 rounded-lg shadow"
          >
            <Plus size={16} />
            إضافة طبيب
          </Button>
          <ExportButton
            data={doctors}
            columns={doctorExportColumns}
            filename="doctors_list"
            title="قائمة الأطباء"
          />
          {/* زر ثانوي */}
          {/* <Button className="bg-secondary-main text-white hover:bg-green-600 px-4 py-2 rounded-lg">تصدير القائمة</Button>
          {/* زر تحذير */}
          {/* <Button className="bg-danger text-white hover:bg-red-700 px-4 py-2 rounded-lg">حذف المحدد</Button> */}
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

      {/* رسالة تحميل */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-8 text-blue-600 font-bold gap-2">
          <Loader2 className="animate-spin h-8 w-8 mb-2" />
          <span>يتم الآن تحميل الأطباء، يرجى الانتظار...</span>
        </div>
      )}
      {/* رسالة خطأ */}
      {error && (
        <div className="flex flex-col items-center justify-center py-8 text-red-600 font-bold gap-2">
          <AlertTriangle className="h-8 w-8 mb-2" />
          <span>
            تعذر تحميل الأطباء. تحقق من اتصالك أو حاول مرة أخرى لاحقًا.
          </span>
          {error.message && (
            <span className="text-xs text-red-400 mt-1">{error.message}</span>
          )}
        </div>
      )}

      {/* قائمة الأطباء */}
      {!isLoading && !error && (
        <>
          <DoctorsList
            doctors={doctors}
            onViewDetails={viewDoctorDetails}
            onToggleStatus={toggleDoctorStatus}
            onSendNotification={sendNotification}
            onDeleteDoctor={deleteDoctor}
          />
          
          {/* مكون التنقل بين الصفحات */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
            totalItems={totalDoctors}
            itemsPerPage={perPage}
          />
        </>
      )}

      {/* مودال تفاصيل الطبيب */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl text-right">
              تفاصيل الطبيب
            </DialogTitle>
          </DialogHeader>

          {selectedDoctor && <DoctorDetails doctor={selectedDoctor} />}
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
