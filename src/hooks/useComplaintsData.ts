
import { useState, useEffect } from 'react';
import { Complaint, ComplaintComment, ComplaintFilters } from '@/types/complaints';
import { v4 as uuidv4 } from 'uuid';
import { safeGet } from '@/lib/api';

// // Mock data for demonstration
// const mockComplaints: Complaint[] = [
//   {
//     id: '1',
//     type: 'technical',
//     status: 'open',
//     title: 'مشكلة في تحميل الصفحة',
//     description: 'لا يمكنني الوصول إلى صفحة الاستشارات الطبية',
//     patientName: 'أحمد محمد',
//     patientId: 'pat-001',
//     doctorName: 'د. سارة أحمد',
//     doctorId: 'doc-001',
//     createdAt: '2024-01-15T10:30:00Z',
//     updatedAt: '2024-01-15T10:30:00Z',
//     attachments: ['screenshot.png'],
//     comments: [
//       {
//         id: 'c1',
//         complaintId: '1',
//         authorName: 'مدير التقنية',
//         authorRole: 'admin',
//         content: 'تم استلام الشكوى وسيتم النظر فيها',
//         createdAt: '2024-01-15T11:00:00Z'
//       }
//     ]
//   },
//   {
//     id: '2',
//     type: 'doctor_behavior',
//     status: 'in_progress',
//     title: 'تأخر في الرد على الاستشارة',
//     description: 'الطبيب لم يرد على استشارتي منذ 3 أيام',
//     patientName: 'فاطمة علي',
//     patientId: 'pat-002',
//     doctorName: 'د. محمد سالم',
//     doctorId: 'doc-002',
//     createdAt: '2024-01-14T14:20:00Z',
//     updatedAt: '2024-01-15T09:15:00Z',
//     comments: []
//   },
//   {
//     id: '3',
//     type: 'payment',
//     status: 'closed',
//     title: 'مشكلة في استرداد المبلغ',
//     description: 'لم يتم استرداد المبلغ بعد إلغاء الاستشارة',
//     patientName: 'خالد حسن',
//     patientId: 'pat-003',
//     createdAt: '2024-01-10T16:45:00Z',
//     updatedAt: '2024-01-12T10:30:00Z',
//     comments: [
//       {
//         id: 'c2',
//         complaintId: '3',
//         authorName: 'مدير المالية',
//         authorRole: 'admin',
//         content: 'تم استرداد المبلغ بنجاح',
//         createdAt: '2024-01-12T10:30:00Z'
//       }
//     ]
//   }
// ];

export const useComplaintsData = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [filters, setFilters] = useState<ComplaintFilters>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    // جلب الشكاوى من الـ API
    safeGet('/complaints').then(({ data, error }) => {
      if (data && Array.isArray(data.data)) {
        
        // تحويل بيانات الـ API إلى الشكل المطلوب
        const mapped = data.data.map((item: any) => ({
          id: String(item.data.id),
          type: item.data.type || 'other',
          status: item.data.type === 'resolved' ? 'closed' : (item.data.type === 'pending' ? 'open' : item.data.type),
          title: item.data.header,
          description: item.data.content,
          patientName: item.data.user.fullName, // لا يوجد اسم مريض في الـ API
          patientId: String(item.data.user_id),
          doctorName: '', // لا يوجد اسم طبيب في الـ API
          doctorId: '',
          createdAt: item.data.created_at,
          updatedAt: item.data.updated_at,
          attachments: item.data.media ? JSON.parse(item.data.media) : [],
          comments: [], // لا يوجد تعليقات في الـ API
        }));
        setComplaints(mapped);
      }
      setIsLoading(false);
      setError(error);
    });
  }, []);

  const viewComplaintDetails = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setIsDetailsDialogOpen(true);
  };

  const updateComplaintStatus = (complaintId: string, status: Complaint['status']) => {
    setComplaints(prev => prev.map(complaint => 
      complaint.id === complaintId 
        ? { ...complaint, status, updatedAt: new Date().toISOString() }
        : complaint
    ));
  };

  const addComment = (complaintId: string, content: string) => {
    const newComment: ComplaintComment = {
      id: uuidv4(),
      complaintId,
      authorName: 'مدير النظام',
      authorRole: 'admin',
      content,
      createdAt: new Date().toISOString()
    };

    setComplaints(prev => prev.map(complaint => 
      complaint.id === complaintId 
        ? { 
            ...complaint, 
            comments: [...complaint.comments, newComment],
            updatedAt: new Date().toISOString()
          }
        : complaint
    ));

    // Update selected complaint if it's the same one
    if (selectedComplaint?.id === complaintId) {
      setSelectedComplaint(prev => prev ? {
        ...prev,
        comments: [...prev.comments, newComment],
        updatedAt: new Date().toISOString()
      } : null);
    }
  };

  const filteredComplaints = complaints.filter(complaint => {
    if (filters.type && complaint.type !== filters.type) return false;
    if (filters.status && complaint.status !== filters.status) return false;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        complaint.title.toLowerCase().includes(searchLower) ||
        complaint.description.toLowerCase().includes(searchLower) ||
        complaint.patientName.toLowerCase().includes(searchLower) ||
        complaint.doctorName?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  return {
    complaints: filteredComplaints,
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
  };
};
