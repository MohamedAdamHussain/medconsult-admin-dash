
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
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Eye, Edit, Ban, AlertTriangle, User, UserCheck, UserX, Bell, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { Patient } from '@/types/patients';

interface PatientsListProps {
  patients: Patient[];
  onViewDetails: (patient: Patient) => void;
  onEditPatient: (patient: Patient) => void;
  onUpdateStatus: (patientId: string, status: Patient['status']) => void;
  onDeletePatient?: (patientId: string) => void;
  onSendNotification?: (patientId: string) => void;
}

const PatientsList = ({ 
  patients, 
  onViewDetails, 
  onEditPatient, 
  onUpdateStatus, 
  onDeletePatient, 
  onSendNotification 
}: PatientsListProps) => {
  const getGenderLabel = (gender: string) => {
    return gender === 'male' ? 'ذكر' : 'أنثى';
  };

  const calculateAge = (dateOfBirth?: string) => {
    if (!dateOfBirth) return 'غير محدد';
    
    try {
      const today = new Date();
      const birthDate = new Date(dateOfBirth);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      return age;
    } catch (error) {
      return 'غير محدد';
    }
  };

  return (
    <div className="unified-card">
      <div className="overflow-hidden rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>اسم المريض</TableHead>
              <TableHead>البريد الإلكتروني</TableHead>
              <TableHead>الهاتف</TableHead>
              <TableHead>الجنس</TableHead>
              <TableHead>العمر</TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead className="text-center">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell className="font-medium">
                  {patient.fullName || patient.name}
                </TableCell>
                <TableCell>{patient.email}</TableCell>
                <TableCell>{patient.phoneNumber || patient.phone || 'غير محدد'}</TableCell>
                <TableCell>{getGenderLabel(patient.gender)}</TableCell>
                <TableCell>
                  {calculateAge(patient.dateOfBirth || patient.birthday)}
                  {calculateAge(patient.dateOfBirth || patient.birthday) !== 'غير محدد' ? ' سنة' : ''}
                </TableCell>
                <TableCell>
                  <StatusBadge 
                    status={patient.status === 'active' || patient.status === 'مفعل' ? 'approved' : 'rejected'} 
                    text={patient.status === 'active' || patient.status === 'مفعل' ? 'مفعل' : 'غير مفعل'} 
                  />
                </TableCell>
                <TableCell>
                  <div className="flex justify-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onViewDetails(patient)}
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
                        <DropdownMenuItem onClick={() => onUpdateStatus(patient.id, patient.status === 'active' || patient.status === 'مفعل' ? 'blocked' : 'active')} className="dropdown-item">
                          {patient.status === 'active' || patient.status === 'مفعل' ? (
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
                        {onSendNotification && (
                          <DropdownMenuItem onClick={() => onSendNotification(patient.id)} className="dropdown-item">
                            <Bell size={16} />
                            <span>إرسال إشعار</span>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => onEditPatient(patient)} className="dropdown-item">
                          <Edit size={16} />
                          <span>تعديل البيانات</span>
                        </DropdownMenuItem>
                        {onDeletePatient && (
                          <DropdownMenuItem onClick={() => onDeletePatient(patient.id)} className="dropdown-item text-destructive">
                            <Trash2 size={16} />
                            <span>حذف</span>
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {patients.length === 0 && (
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

export default PatientsList;
