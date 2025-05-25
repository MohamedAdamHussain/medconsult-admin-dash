
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Patient, PatientConsultation } from '@/types/patients';

interface PatientDetailsProps {
  patient: Patient;
  consultations: PatientConsultation[];
}

const PatientDetails = ({ patient, consultations }: PatientDetailsProps) => {
  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const getStatusBadge = (status: Patient['status']) => {
    const statusConfig = {
      active: { label: 'نشط', className: 'bg-green-100 text-green-800' },
      blocked: { label: 'محظور', className: 'bg-red-100 text-red-800' },
      suspended: { label: 'معلق', className: 'bg-yellow-100 text-yellow-800' }
    };

    const config = statusConfig[status];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getConsultationStatusBadge = (status: PatientConsultation['status']) => {
    const statusConfig = {
      completed: { label: 'مكتملة', className: 'bg-green-100 text-green-800' },
      cancelled: { label: 'ملغية', className: 'bg-red-100 text-red-800' },
      in_progress: { label: 'جارية', className: 'bg-blue-100 text-blue-800' }
    };

    const config = statusConfig[status];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>المعلومات الشخصية</CardTitle>
            {getStatusBadge(patient.status)}
          </div>
        </CardHeader>
        <CardContent className="space-y-3 text-right">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <strong>الاسم:</strong> {patient.name}
            </div>
            <div>
              <strong>البريد الإلكتروني:</strong> {patient.email}
            </div>
            <div>
              <strong>الهاتف:</strong> {patient.phone}
            </div>
            <div>
              <strong>الجنس:</strong> {patient.gender === 'male' ? 'ذكر' : 'أنثى'}
            </div>
            <div>
              <strong>العمر:</strong> {calculateAge(patient.dateOfBirth)} سنة
            </div>
            <div>
              <strong>تاريخ التسجيل:</strong> {new Date(patient.registrationDate).toLocaleDateString('ar-SA')}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Medical Information */}
      <Card>
        <CardHeader>
          <CardTitle>المعلومات الطبية</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-right">
          <div className="grid grid-cols-2 gap-4">
            {patient.height && (
              <div>
                <strong>الطول:</strong> {patient.height} سم
              </div>
            )}
            {patient.weight && (
              <div>
                <strong>الوزن:</strong> {patient.weight} كج
              </div>
            )}
          </div>

          {patient.generalDiseases && patient.generalDiseases.length > 0 && (
            <div>
              <strong>الأمراض العامة:</strong>
              <div className="flex flex-wrap gap-2 mt-2">
                {patient.generalDiseases.map((disease, index) => (
                  <Badge key={index} variant="outline">{disease}</Badge>
                ))}
              </div>
            </div>
          )}

          {patient.chronicDiseases && patient.chronicDiseases.length > 0 && (
            <div>
              <strong>الأمراض المزمنة:</strong>
              <div className="flex flex-wrap gap-2 mt-2">
                {patient.chronicDiseases.map((disease, index) => (
                  <Badge key={index} variant="outline" className="bg-orange-100 text-orange-800">{disease}</Badge>
                ))}
              </div>
            </div>
          )}

          {patient.allergies && patient.allergies.length > 0 && (
            <div>
              <strong>الحساسية:</strong>
              <div className="flex flex-wrap gap-2 mt-2">
                {patient.allergies.map((allergy, index) => (
                  <Badge key={index} variant="outline" className="bg-red-100 text-red-800">{allergy}</Badge>
                ))}
              </div>
            </div>
          )}

          {patient.permanentMedications && patient.permanentMedications.length > 0 && (
            <div>
              <strong>الأدوية الدائمة:</strong>
              <div className="flex flex-wrap gap-2 mt-2">
                {patient.permanentMedications.map((medication, index) => (
                  <Badge key={index} variant="outline" className="bg-blue-100 text-blue-800">{medication}</Badge>
                ))}
              </div>
            </div>
          )}

          {patient.previousSurgeries && patient.previousSurgeries.length > 0 && (
            <div>
              <strong>العمليات الجراحية السابقة:</strong>
              <div className="flex flex-wrap gap-2 mt-2">
                {patient.previousSurgeries.map((surgery, index) => (
                  <Badge key={index} variant="outline" className="bg-purple-100 text-purple-800">{surgery}</Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Consultations History */}
      <Card>
        <CardHeader>
          <CardTitle>سجل الاستشارات ({consultations.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {consultations.length === 0 ? (
            <p className="text-gray-500 text-center py-4">لا توجد استشارات</p>
          ) : (
            <div className="space-y-4">
              {consultations.map((consultation) => (
                <div key={consultation.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="text-right">
                      <div className="font-semibold">{consultation.doctorName}</div>
                      <div className="text-sm text-gray-600">{consultation.specialty}</div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {getConsultationStatusBadge(consultation.status)}
                      <div className="text-sm text-gray-600">
                        {new Date(consultation.date).toLocaleDateString('ar-SA')}
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="text-right space-y-1">
                    <div><strong>الشكوى:</strong> {consultation.complaint}</div>
                    {consultation.diagnosis && (
                      <div><strong>التشخيص:</strong> {consultation.diagnosis}</div>
                    )}
                    {consultation.prescription && (
                      <div><strong>الوصفة:</strong> {consultation.prescription}</div>
                    )}
                    <div><strong>التكلفة:</strong> {consultation.cost} ريال</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientDetails;
