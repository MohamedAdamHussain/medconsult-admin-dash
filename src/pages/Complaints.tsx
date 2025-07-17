import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ComplaintsList from '@/components/complaints/ComplaintsList';
import ComplaintDetails from '@/components/complaints/ComplaintDetails';
import ComplaintsFilter from '@/components/complaints/ComplaintsFilter';
import { useComplaintsData } from '@/hooks/useComplaintsData';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import ExportButton from '@/components/shared/ExportButton';
import { Loader2, AlertTriangle } from 'lucide-react';

const Complaints = () => {
  const {
    complaints,
    selectedComplaint,
    setSelectedComplaint,
    isDetailsDialogOpen,
    setIsDetailsDialogOpen,
    filters,
    setFilters,
    viewComplaintDetails,
    updateComplaintStatus,
    addComment,
    isLoading,
    error
  } = useComplaintsData();

  // Export columns configuration for complaints
  const complaintExportColumns = [
    { key: 'id', title: 'رقم الشكوى' },
    { key: 'title', title: 'العنوان' },
    { key: 'type', title: 'النوع' },
    { key: 'status', title: 'الحالة' },
    { key: 'patientName', title: 'المريض' },
    { key: 'doctorName', title: 'الطبيب' },
    { key: 'createdAt', title: 'تاريخ الإنشاء' },
    { key: 'description', title: 'الوصف' }
  ];

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary-main text-right w-full md:w-auto">إدارة الشكاوى</h1>
          <p className="text-gray-500 mt-2 text-right w-full">إدارة الشكاوى المقدمة من المرضى ومتابعة حالتها</p>
        </div>
        <div className="flex flex-row-reverse gap-2 w-full md:w-auto justify-start md:justify-end">
          <ExportButton
            data={complaints}
            columns={complaintExportColumns}
            filename="complaints_list"
            title="قائمة الشكاوى"
          />
          {/* أزرار أخرى إن وجدت */}
        </div>
      </div>

      <ComplaintsFilter 
        filters={filters}
        onFiltersChange={setFilters}
      />

      {/* رسالة تحميل */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-8 text-blue-600 font-bold gap-2">
          <Loader2 className="animate-spin h-8 w-8 mb-2" />
          <span>يتم الآن تحميل الشكاوى، يرجى الانتظار...</span>
        </div>
      )}
      {/* رسالة خطأ */}
      {error && (
        <div className="flex flex-col items-center justify-center py-8 text-red-600 font-bold gap-2">
          <AlertTriangle className="h-8 w-8 mb-2" />
          <span>تعذر تحميل الشكاوى. تحقق من اتصالك أو حاول مرة أخرى لاحقًا.</span>
          {error.message && <span className="text-xs text-red-400 mt-1">{error.message}</span>}
        </div>
      )}
      {/* قائمة الشكاوى */}
      {!isLoading && !error && (
        <ComplaintsList 
          complaints={complaints}
          onViewDetails={viewComplaintDetails}
        />
      )}

      {/* Dialog for complaint details */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl text-right">تفاصيل الشكوى</DialogTitle>
          </DialogHeader>
          
          {selectedComplaint && (
            <ComplaintDetails 
              complaint={selectedComplaint}
              onStatusChange={(status) => updateComplaintStatus(selectedComplaint.id, status)}
              onAddComment={(content) => addComment(selectedComplaint.id, content)}
            />
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Complaints;
