
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { FileText, Mail, Phone, User, MapPin, Calendar, Users, MessageCircle, Star, Trophy, UserCheck } from 'lucide-react';
import { Doctor } from '@/types/doctors';

interface DoctorDetailsProps {
  doctor: Doctor;
}

const DoctorDetails: React.FC<DoctorDetailsProps> = ({ doctor }) => {
  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'facebook':
        return '📘';
      case 'twitter':
        return '🐦';
      case 'instagram':
        return '📸';
      case 'linkedin':
        return '💼';
      default:
        return '🔗';
    }
  };

  console.log(doctor.name+"Lll")

  return (
    <div className="space-y-6 pt-4 text-right">
      {/* الصورة الشخصية ومعلومات أساسية */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-xl">
              <User size={20} />
              <span>معلومات الطبيب</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* الصورة الشخصية */}
              <div className="flex items-center justify-center mb-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={doctor.profileImage} alt={doctor.name} />
                  <AvatarFallback className="text-2xl">
                    {doctor.name.split(' ')[1]?.charAt(0) || doctor.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-500">الاسم</span>
                <span className="font-medium">{doctor.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">العمر</span>
                <span>{doctor.age} سنة</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">الجنس</span>
                <span>{doctor.gender === 'male' ? 'ذكر' : 'أنثى'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">التخصص الرئيسي</span>
                <span>{doctor.specialty}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">التقييم</span>
                <div className="flex items-center gap-1">
                  <Star size={16} className="text-amber-500 fill-amber-500" />
                  <span>{doctor.rating}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">المدينة</span>
                <div className="flex items-center gap-1">
                  <MapPin size={16} className="text-gray-400" />
                  <span>{doctor.city}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">تاريخ الانضمام</span>
                <div className="flex items-center gap-1">
                  <Calendar size={16} className="text-gray-400" />
                  <span>{doctor.joinDate}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">نقاط النشاط</span>
                <div className="flex items-center gap-1">
                  <Trophy size={16} className="text-blue-500" />
                  <span className="font-semibold text-blue-600">{doctor.activityPoints}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* معلومات التواصل والإحصاءات */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Mail size={20} />
              <span>معلومات التواصل</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">البريد الإلكتروني</span>
                <div className="flex items-center gap-1">
                  <Mail size={16} className="text-gray-400" />
                  <span>{doctor.contacts.email}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">رقم الهاتف</span>
                <div className="flex items-center gap-1">
                  <Phone size={16} className="text-gray-400" />
                  <span>{doctor?.contacts.phone}</span>
                </div>
              </div>
              <div className="mt-8 pt-4 border-t">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <div className="flex items-center justify-center gap-2 text-blue-600 mb-1">
                      <Users size={18} />
                      <span className="font-semibold">المرضى</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-700">{doctor.patients}</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 text-center">
                    <div className="flex items-center justify-center gap-2 text-purple-600 mb-1">
                      <MessageCircle size={18} />
                      <span className="font-semibold">الاستشارات</span>
                    </div>
                    <p className="text-2xl font-bold text-purple-700">{doctor.consultations}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* مكان العيادة ووسائل التواصل الاجتماعي */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* مكان العيادة */}
        {doctor.clinicLocation && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-xl">
                <MapPin size={20} />
                <span>مكان العيادة</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <MapPin size={16} className="text-gray-400 mt-1" />
                  <span className="text-gray-700">{doctor.clinicLocation.address}</span>
                </div>
                {doctor.clinicLocation.coordinates && (
                  <Button variant="outline" size="sm" className="w-full">
                    عرض على الخريطة
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* وسائل التواصل الاجتماعي */}
        {doctor.socialMedia && Object.keys(doctor.socialMedia).length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-xl">
                <span>🌐</span>
                <span>وسائل التواصل الاجتماعي</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(doctor.socialMedia).map(([platform, url]) => {
                  if (!url) return null;
                  return (
                    <div key={platform} className="flex items-center justify-between">
                      <span className="text-gray-500 flex items-center gap-2">
                        <span>{getSocialIcon(platform)}</span>
                        <span className="capitalize">{platform}</span>
                      </span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open(url, '_blank')}
                      >
                        زيارة
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* قسم التخصصات */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-xl">
            <UserCheck size={20} />
            <span>التخصصات</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {doctor.specialty ? doctor.specialty : "لا يوجد"}
            {doctor?.specialties?.map((specialty, index) => (
              <div key={specialty.id} className="border rounded-lg p-4 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-semibold">
                        تخصص #{index + 1}
                      </Badge>
                      <h4 className="font-bold text-lg">{specialty.name}</h4>
                    </div>
                    <p className="text-gray-600">{specialty.description}</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">سعر الاستشارة</span>
                      <span className="font-semibold text-green-600">{specialty.consultationPrice} ريال</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">سنوات الخبرة</span>
                      <span className="font-semibold">{specialty.experienceYears} سنة</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* المستندات */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-xl">
            <FileText size={20} />
            <span>الوثائق المرفوعة</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* شهادات التخصص */}
            <div className="space-y-3">
              <h5 className="font-semibold text-sm text-gray-700">شهادات التخصص</h5>
              {doctor?.documents?.certificates.map((cert, index) => (
                <div key={index} className="p-3 border rounded-md flex justify-between items-center">
                  <div className="text-sm font-medium">شهادة التخصص #{index + 1}</div>
                  <Button variant="outline" size="sm">عرض</Button>
                </div>
              ))}
            </div>
            
            {/* باقي الوثائق */}
            <div className="p-3 border rounded-md flex justify-between items-center">
              <div className="text-sm font-medium">ترخيص مزاولة المهنة</div>
              <Button variant="outline" size="sm">عرض</Button>
            </div>
            <div className="p-3 border rounded-md flex justify-between items-center">
              <div className="text-sm font-medium">بطاقة الهوية</div>
              <Button variant="outline" size="sm">عرض</Button>
            </div>
            {doctor?.documents?.syndicate && (
              <div className="p-3 border rounded-md flex justify-between items-center">
                <div className="text-sm font-medium">بطاقة النقابة</div>
                <Button variant="outline" size="sm">عرض</Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorDetails;
