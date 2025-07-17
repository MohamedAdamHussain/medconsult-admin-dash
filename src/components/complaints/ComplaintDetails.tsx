
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Complaint } from '@/types/complaints';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { MessageSquare, Paperclip, Send, User } from 'lucide-react';

interface ComplaintDetailsProps {
  complaint: Complaint;
  onStatusChange: (status: Complaint['status']) => void;
  onAddComment: (content: string) => void;
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

const ComplaintDetails = ({ complaint, onStatusChange, onAddComment }: ComplaintDetailsProps) => {
  const [newComment, setNewComment] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(complaint.status);

  const handleStatusChange = (status: Complaint['status']) => {
    setSelectedStatus(status);
    onStatusChange(status);
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      onAddComment(newComment.trim());
      setNewComment('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Information */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-right text-xl">{complaint.title}</CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                شكوى رقم: #{complaint.id.slice(-8)}
              </p>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline">{getTypeLabel(complaint.type)}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="text-right">
              <label className="text-sm font-medium text-gray-700">المريض:</label>
              <p className="mt-1">{complaint.patientName}</p>
            </div>
            {complaint.doctorName && (
              <div className="text-right">
                <label className="text-sm font-medium text-gray-700">الطبيب:</label>
                <p className="mt-1">{complaint.doctorName}</p>
              </div>
            )}
            <div className="text-right">
              <label className="text-sm font-medium text-gray-700">تاريخ الإنشاء:</label>
              <p className="mt-1">
                {format(new Date(complaint.createdAt), 'dd/MM/yyyy HH:mm', { locale: ar })}
              </p>
            </div>
            <div className="text-right">
              <label className="text-sm font-medium text-gray-700">آخر تحديث:</label>
              <p className="mt-1">
                {format(new Date(complaint.updatedAt), 'dd/MM/yyyy HH:mm', { locale: ar })}
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <label className="text-sm font-medium text-gray-700">وصف الشكوى:</label>
            <p className="mt-2 p-3 bg-gray-50 rounded-md">{complaint.description}</p>
          </div>

          {complaint.attachments && complaint.attachments.length > 0 && (
            <div className="text-right mt-4">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Paperclip className="h-4 w-4" />
                المرفقات:
              </label>
              <div className="mt-2 space-y-1">
                {complaint.attachments.map((attachment, index) => (
                  <div key={index} className="flex items-center gap-2 text-blue-600">
                    <Paperclip className="h-4 w-4" />
                    <span>{attachment}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Status Management */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right">إدارة الحالة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 block mb-2 text-right">
                تغيير الحالة:
              </label>
              <Select value={selectedStatus} onValueChange={handleStatusChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">مفتوحة</SelectItem>
                  <SelectItem value="in_progress">قيد المعالجة</SelectItem>
                  <SelectItem value="closed">مغلقة</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="text-right">
              <label className="text-sm font-medium text-gray-700 block mb-2">
                الحالة الحالية:
              </label>
              <Badge variant="outline">{getStatusLabel(complaint.status)}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comments Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            التعليقات ({complaint.comments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {complaint.comments.map((comment) => (
              <div key={comment.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="font-medium">{comment.authorName}</span>
                    <Badge variant="outline" className="text-xs">
                      {comment.authorRole === 'admin' ? 'مدير' : 
                       comment.authorRole === 'doctor' ? 'طبيب' : 'مريض'}
                    </Badge>
                  </div>
                  <span className="text-sm text-gray-500">
                    {format(new Date(comment.createdAt), 'dd/MM/yyyy HH:mm', { locale: ar })}
                  </span>
                </div>
                <p className="text-right">{comment.content}</p>
              </div>
            ))}

            {complaint.comments.length === 0 && (
              <p className="text-gray-500 text-center py-4">لا توجد تعليقات بعد</p>
            )}

            <Separator />

            {/* Add New Comment */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700 block text-right">
                إضافة تعليق جديد:
              </label>
              <Textarea
                placeholder="اكتب تعليقك هنا..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[100px]"
              />
              <div className="flex justify-end">
                <Button 
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                >
                  <Send className="h-4 w-4 ml-2" />
                  إرسال التعليق
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComplaintDetails;
