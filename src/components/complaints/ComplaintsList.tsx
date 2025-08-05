
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, MessageSquare, Paperclip } from 'lucide-react';
import { Complaint } from '@/types/complaints';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

interface ComplaintsListProps {
  complaints: Complaint[];
  onViewDetails: (complaint: Complaint) => void;
}

const getTypeLabel = (type: string) => {
  const labels = {
    technical: 'تقنية',
    doctor_behavior: 'سلوك طبيب',
    payment: 'دفع',
    service: 'خدمة',
    other: 'أخرى'
  };
  return labels[type as keyof typeof labels] || type;
};

const getStatusLabel = (status: string) => {
  const labels = {
    open: 'مفتوحة',
    in_progress: 'قيد المعالجة',
    closed: 'مغلقة'
  };
  return labels[status as keyof typeof labels] || status;
};

const getPriorityLabel = (priority: string) => {
  const labels = {
    low: 'منخفضة',
    medium: 'متوسطة',
    high: 'عالية',
    urgent: 'عاجلة'
  };
  return labels[priority as keyof typeof labels] || priority;
};

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'open': return 'destructive';
    case 'in_progress': return 'default';
    case 'closed': return 'secondary';
    default: return 'default';
  }
};

const getPriorityBadgeVariant = (priority: string) => {
  switch (priority) {
    case 'urgent': return 'destructive';
    case 'high': return 'destructive';
    case 'medium': return 'default';
    case 'low': return 'secondary';
    default: return 'default';
  }
};

const ComplaintsList = ({ complaints, onViewDetails }: ComplaintsListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-right">قائمة الشكاوى ({complaints.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">الرقم</TableHead>
                <TableHead className="text-right">العنوان</TableHead>
                <TableHead className="text-right">النوع</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-right">اسم المستخدم</TableHead>
                <TableHead className="text-right">تاريخ الإنشاء</TableHead>
                <TableHead className="text-right">التعليقات</TableHead>
                <TableHead className="text-right">المرفقات</TableHead>
                <TableHead className="text-left">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {complaints.map((complaint) => (
                <TableRow key={complaint.id}>
                  <TableCell className="text-right font-mono">
                    #{complaint.id.slice(-4)}
                  </TableCell>
                  <TableCell className="text-right max-w-xs">
                    <div className="truncate" title={complaint.title}>
                      {complaint.title}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline">
                      {getTypeLabel(complaint.type)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant={getStatusBadgeVariant(complaint.status)}>
                      {getStatusLabel(complaint.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {complaint.patientName}
                  </TableCell>
                  <TableCell className="text-right">
                    {format(new Date(complaint.createdAt), 'dd/MM/yyyy', { locale: ar })}
                  </TableCell>
                  <TableCell className="text-right">
                    {complaint.comments.length > 0 && (
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        <span>{complaint.comments.length}</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {complaint.attachments && complaint.attachments.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Paperclip className="h-4 w-4" />
                        <span>{complaint.attachments.length}</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-left">
                    <div className="flex flex-row-reverse gap-2 justify-start">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewDetails(complaint)}
                      >
                        <Eye className="h-4 w-4 ml-1" />
                        عرض
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {complaints.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            لا توجد شكاوى متطابقة مع الفلاتر المحددة
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ComplaintsList;
