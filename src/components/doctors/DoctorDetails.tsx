
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { FileText, Mail, Phone, User, MapPin, Calendar, Clock, Star, Trophy, UserCheck, Award, Heart } from 'lucide-react';
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
      default:
        return '🔗';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('ar-EG');
    } catch {
      return dateString;
    }
  };

  const calculateAge = (birthday: string) => {
    try {
      const birthDate = new Date(birthday);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      return age;
    } catch {
      return 'غير محدد';
    }
  };

  const hasSocialMedia = doctor.facebook_url || doctor.instagram_url || doctor.twitter_url;

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
                  <AvatarImage src={doctor.user.photoPath} alt={doctor.user.fullName} />
                  <AvatarFallback className="text-2xl">
                    {doctor.user.fullName !== 'Not Set' ? doctor.user.fullName.charAt(0) : 'د'}
                  </AvatarFallback>
                </Avatar>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-500">الاسم</span>
                <span className="font-medium">{doctor.user.fullName !== 'Not Set' ? doctor.user.fullName : 'غير محدد'}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-500">العمر</span>
                <span>{doctor.user.birthday !== '2025-08-27' ? `${calculateAge(doctor.user.birthday)} سنة` : 'غير محدد'}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-500">الجنس</span>
                <span>{doctor.user.gender !== 'Not Set' ? doctor.user.gender : 'غير محدد'}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-500">التقييم</span>
                <div className="flex items-center gap-1">
                  <Star size={16} className="text-amber-500 fill-amber-500" />
                  <span>{doctor.rating || 'غير محدد'}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-500">العنوان</span>
                <div className="flex items-center gap-1">
                  <MapPin size={16} className="text-gray-400" />
                  <span>{doctor.address || doctor.user.address !== 'Not Set' ? doctor.user.address : 'غير محدد'}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-500">تاريخ الانضمام</span>
                <div className="flex items-center gap-1">
                  <Calendar size={16} className="text-gray-400" />
                  <span>{formatDate(doctor.created_at)}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-500">نقاط النشاط</span>
                <div className="flex items-center gap-1">
                  <Trophy size={16} className="text-blue-500" />
                  <span className="font-semibold text-blue-600">{doctor.activatePoint || '0'}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* معلومات التواصل */}
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
                  <span>{doctor.user.email}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-500">رقم الهاتف</span>
                <div className="flex items-center gap-1">
                  <Phone size={16} className="text-gray-400" />
                  <span>{doctor.user.phoneNumber !== 'Not Set' ? doctor.user.phoneNumber : 'غير محدد'}</span>
                </div>
              </div>
              
              {doctor.bio && (
                <div className="mt-4 pt-4 border-t">
                  <div className="text-gray-500 mb-2">نبذة عن الطبيب</div>
                  <p className="text-gray-700 text-sm leading-relaxed">{doctor.bio}</p>
                    </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* أوقات العمل */}
      {(doctor.work_time_in || doctor.work_time_out) && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-xl">
              <Clock size={20} />
              <span>أوقات العمل</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {doctor.work_time_in && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">وقت بدء العمل</span>
                  <span className="font-medium">{doctor.work_time_in}</span>
                </div>
              )}
              {doctor.work_time_out && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">وقت انتهاء العمل</span>
                  <span className="font-medium">{doctor.work_time_out}</span>
                </div>
              )}
              {doctor.work_days && (
                <div className="md:col-span-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">أيام العمل</span>
                    <span className="font-medium">{doctor.work_days}</span>
                  </div>
                </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* وسائل التواصل الاجتماعي */}
      {hasSocialMedia && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-xl">
                <span>🌐</span>
                <span>وسائل التواصل الاجتماعي</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
              {doctor.facebook_url && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 flex items-center gap-2">
                    <span>📘</span>
                    <span>Facebook</span>
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open(doctor.facebook_url!, '_blank')}
                  >
                    زيارة
                  </Button>
                </div>
              )}
              {doctor.instagram_url && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 flex items-center gap-2">
                    <span>📸</span>
                    <span>Instagram</span>
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open(doctor.instagram_url!, '_blank')}
                  >
                    زيارة
                  </Button>
                </div>
              )}
              {doctor.twitter_url && (
                <div className="flex items-center justify-between">
                      <span className="text-gray-500 flex items-center gap-2">
                    <span>🐦</span>
                    <span>Twitter</span>
                      </span>
                      <Button 
                        variant="outline" 
                        size="sm"
                    onClick={() => window.open(doctor.twitter_url!, '_blank')}
                      >
                        زيارة
                      </Button>
                    </div>
              )}
              </div>
            </CardContent>
          </Card>
        )}

      {/* قسم التخصصات */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Heart size={20} />
            <span>التخصصات</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {doctor.specialties && doctor.specialties.length > 0 ? (
              doctor.specialties.map((specialty, index) => (
                <div key={index} className="border rounded-lg p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-semibold bg-blue-100 text-blue-800">
                        تخصص #{index + 1}
                      </Badge>
                        <h4 className="font-bold text-lg text-blue-900">{specialty.medical_tag.name_ar || specialty.medical_tag.name}</h4>
                    </div>
                      {specialty.medical_tag.description && (
                        <p className="text-gray-600 text-sm">{specialty.medical_tag.description}</p>
                      )}
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">سعر الاستشارة</span>
                        <span className="font-semibold text-green-600">{parseFloat(specialty.consultation_fee) > 0 ? `${specialty.consultation_fee} ريال` : 'مجاناً'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">سنوات الخبرة</span>
                        <span className="font-semibold">{specialty.yearOfExper} سنة</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">الحالة</span>
                        <Badge variant={specialty.is_active ? "default" : "secondary"}>
                          {specialty.is_active ? 'نشط' : 'غير نشط'}
                        </Badge>
                    </div>
                  </div>
                </div>
              </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <UserCheck size={48} className="mx-auto mb-4 text-gray-300" />
                <p>لا توجد تخصصات مسجلة</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* الشهادات */}
      {doctor.certificate_images && (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-xl">
              <Award size={20} />
              <span>الشهادات والوثائق</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-3">
              <h5 className="font-semibold text-sm text-gray-700">شهادات التخصص</h5>
                {doctor.certificate_images && doctor.certificate_images !== '[]' && (
                  <div className="p-3 border rounded-md flex justify-between items-center bg-blue-50">
                    <div className="text-sm font-medium">شهادة التخصص</div>
                <Button variant="outline" size="sm">عرض</Button>
              </div>
            )}
              </div>
          </div>
        </CardContent>
      </Card>
      )}
    </div>
  );
};

export default DoctorDetails;
