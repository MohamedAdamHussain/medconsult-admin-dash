
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

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  rating: number;
  status: string;
  city: string;
  joinDate: string;
  patients: number;
  consultations: number;
  documents: {
    certificate: string;
    license: string;
    id: string;
  };
  contacts: {
    phone: string;
    email: string;
  };
}

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
  return (
    <div className="rounded-lg border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-right">الطبيب</TableHead>
            <TableHead className="text-right">التخصص</TableHead>
            <TableHead className="text-right">التقييم</TableHead>
            <TableHead className="text-right">المدينة</TableHead>
            <TableHead className="text-right">الحالة</TableHead>
            <TableHead className="text-right">الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {doctors.map((doctor) => (
            <TableRow key={doctor.id}>
              <TableCell className="font-medium">{doctor.name}</TableCell>
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
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onViewDetails(doctor)}
                  >
                    عرض التفاصيل
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onToggleStatus(doctor.id)}>
                        {doctor.status === 'active' ? (
                          <div className="flex items-center gap-2">
                            <UserX size={16} />
                            <span>تعطيل</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <UserCheck size={16} />
                            <span>تفعيل</span>
                          </div>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onSendNotification(doctor.id)}>
                        <div className="flex items-center gap-2">
                          <Bell size={16} />
                          <span>إرسال إشعار</span>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => console.log('تعديل', doctor.id)}>
                        <div className="flex items-center gap-2">
                          <Edit size={16} />
                          <span>تعديل البيانات</span>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDeleteDoctor(doctor.id)}>
                        <div className="flex items-center gap-2 text-red-500">
                          <Trash2 size={16} />
                          <span>حذف</span>
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {doctors.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                لا توجد نتائج مطابقة لبحثك
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default DoctorsList;
