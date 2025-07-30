
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit, Ban, AlertTriangle, User } from 'lucide-react';
import { Patient } from '@/types/patients';

interface PatientsListProps {
  patients: Patient[];
  onViewDetails: (patient: Patient) => void;
  onEditPatient: (patient: Patient) => void;
  onUpdateStatus: (patientId: string, status: Patient['status']) => void;
}

const PatientsList = ({ patients, onViewDetails, onEditPatient, onUpdateStatus }: PatientsListProps) => {
  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string, className: string }> = {
      active: { label: 'نشط', className: 'bg-green-100 text-green-800' },
      blocked: { label: 'محظور', className: 'bg-red-100 text-red-800' },
      suspended: { label: 'معلق', className: 'bg-yellow-100 text-yellow-800' },
      'مفعل': { label: 'نشط', className: 'bg-green-100 text-green-800' },
      'غير مفعل': { label: 'محظور', className: 'bg-red-100 text-red-800' }
    };

    const config = statusConfig[status] || statusConfig.blocked;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

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

  if (patients.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">لا توجد مرضى مطابقين للبحث</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {patients.map((patient) => (
        <Card key={patient.id} className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg text-right">{patient.name}</CardTitle>
              {getStatusBadge(patient.status)}
            </div>
          </CardHeader>
          
          <CardContent className="space-y-3">
            <div className="text-sm text-gray-600 text-right space-y-1">
              <div>الجنس: {getGenderLabel(patient.gender)}</div>
              <div>العمر: {calculateAge(patient.dateOfBirth || patient.birthday)} {calculateAge(patient.dateOfBirth || patient.birthday) !== 'غير محدد' ? 'سنة' : ''}</div>
              {patient.phone && <div>الهاتف: {patient.phone}</div>}
              {patient.address && <div>العنوان: {patient.address}</div>}
              {patient.height && <div>الطول: {patient.height} سم</div>}
              {patient.weight && <div>الوزن: {patient.weight} كجم</div>}
              {patient.registrationDate && (
                <div>تاريخ التسجيل: {new Date(patient.registrationDate).toLocaleDateString('ar-SA')}</div>
              )}
              {patient.totalConsultations !== undefined && (
                <div>عدد الاستشارات: {patient.totalConsultations}</div>
              )}
              {patient.lastConsultationDate && (
                <div>آخر استشارة: {new Date(patient.lastConsultationDate).toLocaleDateString('ar-SA')}</div>
              )}
            </div>

            <div className="flex gap-2 pt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewDetails(patient)}
                className="flex-1"
              >
                <Eye className="h-4 w-4 ml-1" />
                عرض
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEditPatient(patient)}
                className="flex-1"
              >
                <Edit className="h-4 w-4 ml-1" />
                تعديل
              </Button>

              {patient.status === 'active' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onUpdateStatus(patient.id, 'suspended')}
                  className="px-2"
                >
                  <AlertTriangle className="h-4 w-4" />
                </Button>
              )}

              {patient.status !== 'blocked' && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onUpdateStatus(patient.id, 'blocked')}
                  className="px-2"
                >
                  <Ban className="h-4 w-4" />
                </Button>
              )}

              {patient.status !== 'active' && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => onUpdateStatus(patient.id, 'active')}
                  className="px-2"
                >
                  تفعيل
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PatientsList;
