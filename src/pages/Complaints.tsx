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
    addComment
  } = useComplaintsData();

  // Export columns configuration for complaints
  const complaintExportColumns = [
    { key: 'id', title: 'رقم الشكوى' },
    { key: 'title', title: 'العنوان' },
    { key: 'type', title: 'النوع' },
    { key: 'status', title: 'الحالة' },
    { key: 'priority', title: 'الأولوية' },
    { key: 'patientName', title: 'المريض' },
    { key: 'doctorName', title: 'الطبيب' },
    { key: 'createdAt', title: 'تاريخ الإنشاء' },
    { key: 'description', title: 'الوصف' }
  ];

  return (
    <DashboardLayout>
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <ExportButton
            data={complaints}
            columns={complaintExportColumns}
            filename="complaints_list"
            title="قائمة الشكاوى"
          />
          <div className="text-right">
            <h1 className="text-3xl font-bold">إدارة الشكاوى</h1>
            <p className="text-gray-500 mt-1">متابعة وحل شكاوى المستخدمين</p>
          </div>
        </div>
      </div>

      <ComplaintsFilter 
        filters={filters}
        onFiltersChange={setFilters}
      />

      <ComplaintsList 
        complaints={complaints}
        onViewDetails={viewComplaintDetails}
      />

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
