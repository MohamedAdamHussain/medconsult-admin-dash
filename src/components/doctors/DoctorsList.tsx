
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
import { UserCheck, UserX, Edit, Bell, Trash2 } from 'lucide-react';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { Doctor } from '@/types/doctors';

interface DoctorsListProps {
  doctors: Doctor[];
  onViewDetails: (doctor: Doctor) => void;
  onToggleStatus: (doctorId: number) => void;
  onSendNotification: (doctorId: number) => void;
  onDeleteDoctor: (doctorId: number) => void;
}

const DoctorsList: React.FC<DoctorsListProps> = ({
  doctors,
  onViewDetails,
  onToggleStatus,
  onSendNotification,
  onDeleteDoctor
}) => {
  console.log(doctors)
  return (
    <div className="unified-card">
      <div className="overflow-hidden rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>اسم الطبيب</TableHead>
              <TableHead>البريد الإلكتروني</TableHead>
              <TableHead>التخصص</TableHead>
              <TableHead>التقييم</TableHead>
              <TableHead>المدينة</TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead className="text-center">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {doctors.map((doctor) => (
              <TableRow key={doctor.id}>
                <TableCell className="font-medium">{doctor.name}</TableCell>
                <TableCell>{doctor.contacts.email}</TableCell>
                <TableCell>{doctor.specialty}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <span className="text-amber-500">★</span>
                    <span>{doctor.rating}</span>
                  </div>
                </TableCell>
                <TableCell>{doctor.city}</TableCell>
                <TableCell>
                  <StatusBadge 
                    status={doctor.status === 'active' ? 'approved' : 'rejected'} 
                    text={doctor.status === 'active' ? 'مفعل' : 'موقوف'} 
                  />
                </TableCell>
                <TableCell>
                  <div className="flex justify-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onViewDetails(doctor)}
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
                        <DropdownMenuItem onClick={() => onToggleStatus(doctor.id)} className="dropdown-item">
                          {doctor.status === 'active' ? (
                            <>
                              <UserX size={16} />
                              <span>تعطيل</span>
                            </>
                          ) : (
                            <>
                              <UserCheck size={16} />
                              <span>تفعيل</span>
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onSendNotification(doctor.id)} className="dropdown-item">
                          <Bell size={16} />
                          <span>إرسال إشعار</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => console.log('تعديل', doctor.id)} className="dropdown-item">
                          <Edit size={16} />
                          <span>تعديل البيانات</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDeleteDoctor(doctor.id)} className="dropdown-item text-destructive">
                          <Trash2 size={16} />
                          <span>حذف</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {doctors.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  لا توجد نتائج مطابقة لبحثك
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DoctorsList;
