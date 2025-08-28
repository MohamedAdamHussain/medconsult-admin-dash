import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { Consultation } from '@/types/consultations';

interface GeneralConsultationsListProps {
  consultations: Consultation[];
  onViewDetails: (consultation: Consultation) => void;
}

const GeneralConsultationsList: React.FC<GeneralConsultationsListProps> = ({ consultations, onViewDetails }) => {
  return (
    <div className="unified-card">
      <div className="overflow-hidden rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>المشكلة</TableHead>
              <TableHead>مجهول؟</TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead>تاريخ الإنشاء</TableHead>
              <TableHead>المجدولة في</TableHead>
              <TableHead>المستخدم</TableHead>
              <TableHead>التخصص</TableHead>
              <TableHead>الطبيب</TableHead>
              <TableHead className="text-center">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {consultations.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="max-w-xs truncate" title={c.problem}>{c.problem}</TableCell>
                <TableCell>{c.isAnonymous ? 'نعم' : 'لا'}</TableCell>
                <TableCell>
                  <StatusBadge 
                    status={c.status === 'completed' ? 'approved' : c.status === 'cancelled' ? 'rejected' : 'pending'}
                    text={statusLabel(c.status)}
                  />
                </TableCell>
                <TableCell>{formatDate(c.created_at)}</TableCell>
                <TableCell>{formatDate(c.scheduled_at)}</TableCell>
                <TableCell>{c.user?.name ?? '-'}</TableCell>
                <TableCell>{c.medical_tag?.name}</TableCell>
                <TableCell>{c.doctor?.name ?? '-'}</TableCell>
                <TableCell>
                  <div className="flex justify-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onViewDetails(c)}
                      className="action-button action-button-secondary"
                    >
                      عرض التفاصيل
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="action-button action-button-ghost">
                          <MoreHorizontal size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="dropdown-content">
                        <DropdownMenuItem onClick={() => onViewDetails(c)} className="dropdown-item">
                          <span>عرض</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {consultations.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  لا توجد استشارات
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

function formatDate(value?: string) {
  if (!value) return '-';
  try {
    return new Date(value).toLocaleString('ar-EG', { hour12: false });
  } catch {
    return value;
  }
}

function statusLabel(s: string) {
  switch (s) {
    case 'scheduled':
      return 'مجدولة';
    case 'completed':
      return 'مكتملة';
    case 'cancelled':
      return 'ملغاة';
    case 'pending':
      return 'قيد الانتظار';
    default:
      return s;
  }
}

export default GeneralConsultationsList;


