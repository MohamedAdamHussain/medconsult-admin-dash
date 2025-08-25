
import React, { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import StatusBadge from '@/components/dashboard/StatusBadge';
import { Button } from '@/components/ui/button';
import { 
  Search,
  Filter,
  Check,
  X,
  MessageSquare,
  FileText,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Star,
  Trophy,
  UserCheck
} from 'lucide-react';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

// Sample data
const applications = [
  {
    id: 1,
    name: 'د. أحمد محمد',
    specialty: 'قلب وأوعية دموية',
    specialties: [
      {
        id: '1',
        name: 'قلب وأوعية دموية',
        consultationPrice: 200,
        experienceYears: 15,
        description: 'خبرة واسعة في جراحة القلب والقسطرة القلبية'
      },
      {
        id: '2',
        name: 'طب الطوارئ',
        consultationPrice: 150,
        experienceYears: 8,
        description: 'تخصص فرعي في حالات الطوارئ القلبية'
      }
    ],
    city: 'الرياض',
    status: 'new' as const,
    date: '2025-05-15',
    age: 42,
    gender: 'male' as const,
    profileImage: '/api/placeholder/120/120',
    activityPoints: 2450,
    documents: {
      certificates: ['cert1.pdf', 'cert2.pdf'],
      license: 'ترخيص مزاولة المهنة',
      id: 'بطاقة هوية',
      syndicate: 'بطاقة النقابة',
    },
    contacts: {
      phone: '05xxxxxxxx',
      email: 'ahmed@example.com',
    },
    socialMedia: {
      facebook: 'https://facebook.com/dr.ahmed',
      twitter: 'https://twitter.com/dr.ahmed',
      linkedin: 'https://linkedin.com/in/dr.ahmed'
    },
    clinicLocation: {
      address: 'شارع الملك فهد، الرياض 12345',
      coordinates: {
        lat: 24.7136,
        lng: 46.6753
      }
    }
  },
  {
    id: 2,
    name: 'د. سارة علي',
    specialty: 'أمراض جلدية',
    specialties: [
      {
        id: '3',
        name: 'أمراض جلدية',
        consultationPrice: 180,
        experienceYears: 12,
        description: 'تخصص في الأمراض الجلدية والتجميل'
      }
    ],
    city: 'جدة',
    status: 'pending' as const,
    date: '2025-05-10',
    age: 38,
    gender: 'female' as const,
    profileImage: '/api/placeholder/120/120',
    activityPoints: 1980,
    documents: {
      certificates: ['derma_cert.pdf'],
      license: 'ترخيص مزاولة المهنة',
      id: 'بطاقة هوية',
      syndicate: 'بطاقة النقابة',
    },
    contacts: {
      phone: '05xxxxxxxx',
      email: 'sara@example.com',
    },
    socialMedia: {
      facebook: 'https://facebook.com/dr.sara',
      instagram: 'https://instagram.com/dr.sara'
    },
    clinicLocation: {
      address: 'شارع التحلية، جدة 21589'
    }
  },
  {
    id: 3,
    name: 'د. محمد خالد',
    specialty: 'طب أطفال',
    specialties: [
      {
        id: '4',
        name: 'طب أطفال',
        consultationPrice: 160,
        experienceYears: 10,
        description: 'تخصص في رعاية الأطفال وحديثي الولادة'
      }
    ],
    city: 'الدمام',
    status: 'rejected' as const,
    date: '2025-05-05',
    age: 35,
    gender: 'male' as const,
    activityPoints: 1120,
    documents: {
      certificates: ['pediatric_cert.pdf'],
      license: 'ترخيص مزاولة المهنة',
      id: 'بطاقة هوية',
      syndicate: 'بطاقة النقابة',
    },
    contacts: {
      phone: '05xxxxxxxx',
      email: 'mohamed@example.com',
    },
    socialMedia: {
      linkedin: 'https://linkedin.com/in/dr.mohamed'
    },
    clinicLocation: {
      address: 'شارع الخليج، الدمام 31952'
    }
  },
  {
    id: 4,
    name: 'د. نورة سعد',
    specialty: 'طب نفسي',
    specialties: [
      {
        id: '5',
        name: 'طب نفسي',
        consultationPrice: 220,
        experienceYears: 8,
        description: 'تخصص في العلاج النفسي والسلوكي'
      }
    ],
    city: 'الرياض',
    status: 'approved' as const,
    date: '2025-05-01',
    age: 33,
    gender: 'female' as const,
    profileImage: '/api/placeholder/120/120',
    activityPoints: 1760,
    documents: {
      certificates: ['psych_cert.pdf'],
      license: 'ترخيص مزاولة المهنة',
      id: 'بطاقة هوية',
      syndicate: 'بطاقة النقابة',
    },
    contacts: {
      phone: '05xxxxxxxx',
      email: 'nora@example.com',
    },
    socialMedia: {
      twitter: 'https://twitter.com/dr.nora',
      instagram: 'https://instagram.com/dr.nora'
    },
    clinicLocation: {
      address: 'حي العليا، الرياض 11564'
    }
  },
  {
    id: 5,
    name: 'د. فيصل عبدالله',
    specialty: 'جراحة العظام',
    specialties: [
      {
        id: '6',
        name: 'جراحة العظام',
        consultationPrice: 250,
        experienceYears: 18,
        description: 'تخصص في جراحة العظام والمفاصل'
      },
      {
        id: '7',
        name: 'الطب الرياضي',
        consultationPrice: 200,
        experienceYears: 5,
        description: 'تخصص فرعي في إصابات الرياضيين'
      }
    ],
    city: 'مكة',
    status: 'new' as const,
    date: '2025-05-18',
    age: 48,
    gender: 'male' as const,
    activityPoints: 2210,
    documents: {
      certificates: ['ortho_cert.pdf', 'sports_cert.pdf'],
      license: 'ترخيص مزاولة المهنة',
      id: 'بطاقة هوية',
      syndicate: 'بطاقة النقابة',
    },
    contacts: {
      phone: '05xxxxxxxx',
      email: 'faisal@example.com',
    },
    socialMedia: {
      facebook: 'https://facebook.com/dr.faisal',
      linkedin: 'https://linkedin.com/in/dr.faisal'
    },
    clinicLocation: {
      address: 'حي الشوقية، مكة المكرمة 24231'
    }
  },
];

const DoctorApplications = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApplication, setSelectedApplication] = useState<typeof applications[0] | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredApplications = applications.filter(app => 
    app.name.includes(searchQuery) || 
    app.specialty.includes(searchQuery) || 
    app.city.includes(searchQuery)
  );

  const handleViewDetails = (app: typeof applications[0]) => {
    setSelectedApplication(app);
    setDialogOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-right">طلبات تسجيل الأطباء</h1>
        <p className="text-gray-500 mt-1 text-right">عرض ومراجعة طلبات تسجيل الأطباء الجدد</p>
      </div>
      
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 items-end">
        <div className="flex-1 relative">
          <Label htmlFor="search" className="block mb-2 text-right">بحث</Label>
          <div className="relative">
            <Input
              id="search"
              placeholder="ابحث بالاسم، التخصص، أو المدينة"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 text-right"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>
        </div>
        
        <Button variant="outline" className="flex items-center gap-2">
          <Filter size={18} />
          <span>تصفية</span>
        </Button>
      </div>
      
      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.map((app) => (
          <Card key={app.id} className="overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center">
              <CardContent className="flex-1 p-6">
                <div className="flex flex-col sm:flex-row justify-between">
                  <div className="mb-3 sm:mb-0 text-right">
                    <h3 className="text-lg font-semibold">{app.name}</h3>
                    <p className="text-gray-500">{app.specialty} | {app.city}</p>
                    <p className="text-sm text-gray-400">تاريخ التقديم: {app.date}</p>
                  </div>
                  
                  <div className="flex items-start justify-end">
                    <StatusBadge status={app.status} />
                  </div>
                </div>
              </CardContent>
              
              <div className="p-4 md:p-6 border-t md:border-t-0 md:border-r border-gray-100 flex justify-end">
                <Button 
                  variant="outline" 
                  className="min-w-[120px]"
                  onClick={() => handleViewDetails(app)}
                >
                  عرض التفاصيل
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      {/* Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl text-right max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedApplication?.name}</DialogTitle>
            <DialogDescription>
              {selectedApplication?.specialty} | {selectedApplication?.city}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-8">
            {/* الصورة الشخصية ومعلومات أساسية */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full min-w-0">
              <Card className="rounded-lg shadow-sm min-h-[120px]">
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
                        <AvatarImage src={selectedApplication?.profileImage} alt={selectedApplication?.name} />
                        <AvatarFallback className="text-2xl">
                          {selectedApplication?.name.split(' ')[1]?.charAt(0) || selectedApplication?.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">الاسم</span>
                      <span className="font-medium">{selectedApplication?.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">العمر</span>
                      <span>{selectedApplication?.age} سنة</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">الجنس</span>
                      <span>{selectedApplication?.gender === 'male' ? 'ذكر' : 'أنثى'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">التخصص الرئيسي</span>
                      <span>{selectedApplication?.specialty}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">المدينة</span>
                      <div className="flex items-center gap-1">
                        <MapPin size={16} className="text-gray-400" />
                        <span>{selectedApplication?.city}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">تاريخ التقديم</span>
                      <div className="flex items-center gap-1">
                        <Calendar size={16} className="text-gray-400" />
                        <span>{selectedApplication?.date}</span>
                      </div>
                    </div>
                    {selectedApplication?.activityPoints && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">نقاط النشاط</span>
                        <div className="flex items-center gap-1">
                          <Trophy size={16} className="text-blue-500" />
                          <span className="font-semibold text-blue-600">{selectedApplication?.activityPoints}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* معلومات التواصل */}
              <Card className="rounded-lg shadow-sm min-h-[120px]">
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
                        <span>{selectedApplication?.contacts.email}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">رقم الهاتف</span>
                      <div className="flex items-center gap-1">
                        <Phone size={16} className="text-gray-400" />
                        <span>{selectedApplication?.contacts.phone}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* مكان العيادة ووسائل التواصل الاجتماعي */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full min-w-0">
              {/* مكان العيادة */}
              {selectedApplication?.clinicLocation && (
                <Card className="rounded-lg shadow-sm min-h-[120px]">
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
                        <span className="text-gray-700">{selectedApplication?.clinicLocation.address}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* وسائل التواصل الاجتماعي */}
              {selectedApplication?.socialMedia && Object.keys(selectedApplication.socialMedia).length > 0 && (
                <Card className="rounded-lg shadow-sm min-h-[120px]">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <span>🌐</span>
                      <span>وسائل التواصل الاجتماعي</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(selectedApplication.socialMedia).map(([platform, url]) => {
                        if (!url) return null;
                        const getSocialIcon = (platform: string) => {
                          switch (platform) {
                            case 'facebook': return '📘';
                            case 'twitter': return '🐦';
                            case 'instagram': return '📸';
                            case 'linkedin': return '💼';
                            default: return '🔗';
                          }
                        };
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
            <Card className="rounded-lg shadow-sm min-h-[120px]">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <UserCheck size={20} />
                  <span>التخصصات</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedApplication?.specialties?.map((specialty, index) => (
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
            <Card className="rounded-lg shadow-sm min-h-[120px]">
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
                    {selectedApplication?.documents.certificates?.map((cert, index) => (
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
                  {selectedApplication?.documents.syndicate && (
                    <div className="p-3 border rounded-md flex justify-between items-center">
                      <div className="text-sm font-medium">بطاقة النقابة</div>
                      <Button variant="outline" size="sm">عرض</Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <DialogFooter className="flex flex-col sm:flex-row gap-3 mt-6 sm:justify-end">
            <Button variant="destructive" className="flex items-center gap-2">
              <X size={16} />
              <span>رفض</span>
            </Button>
            {/* <Button variant="outline" className="flex items-center gap-2">
              <MessageSquare size={16} />
              <span>طلب تعديل</span>
            </Button> */}
            <Button className="flex items-center gap-2">
              <Check size={16} />
              <span>قبول</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default DoctorApplications;
