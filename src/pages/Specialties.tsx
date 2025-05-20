
import React, { useState } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SpecialtiesList from '@/components/specialties/SpecialtiesList';
import AddEditSpecialtyDialog from '@/components/specialties/AddEditSpecialtyDialog';
import { Plus } from 'lucide-react';

// نوع البيانات للأسئلة الشائعة
export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

// نوع البيانات للتخصصات الطبية
export interface Specialty {
  id: string;
  name: string;
  description: string;
  iconName: string;
  doctorsCount: number;
  faqs: FAQ[];
}

// بيانات افتراضية للتخصصات
const initialSpecialties: Specialty[] = [
  {
    id: '1',
    name: 'طب القلب',
    description: 'تخصص في تشخيص وعلاج أمراض القلب والأوعية الدموية',
    iconName: 'heart',
    doctorsCount: 42,
    faqs: [
      { id: '1-1', question: 'ما هي أعراض النوبة القلبية؟', answer: 'تشمل الأعراض ألم في الصدر، ضيق في التنفس، تعرق بارد، غثيان وألم في الذراع اليسرى.' },
      { id: '1-2', question: 'هل ارتفاع الكولسترول يسبب أمراض القلب؟', answer: 'نعم، ارتفاع الكولسترول يمكن أن يؤدي إلى تراكم اللويحات في الشرايين مما يزيد من خطر الإصابة بأمراض القلب.' }
    ]
  },
  {
    id: '2',
    name: 'طب الأطفال',
    description: 'رعاية صحية للأطفال منذ الولادة وحتى مرحلة المراهقة',
    iconName: 'baby',
    doctorsCount: 38,
    faqs: [
      { id: '2-1', question: 'متى يجب أن يحصل طفلي على اللقاحات الأساسية؟', answer: 'تبدأ اللقاحات الأساسية عادة من الشهر الثاني من العمر وتستمر حسب جدول محدد حتى سن المدرسة.' },
      { id: '2-2', question: 'ما هي علامات الجفاف عند الأطفال؟', answer: 'تشمل قلة التبول، جفاف الفم واللسان، عدم وجود دموع عند البكاء، وخمول غير طبيعي.' }
    ]
  },
  {
    id: '3',
    name: 'طب الأسنان',
    description: 'علاج مشاكل الفم والأسنان واللثة',
    iconName: 'tooth',
    doctorsCount: 53,
    faqs: [
      { id: '3-1', question: 'كم مرة يجب تنظيف الأسنان بالفرشاة؟', answer: 'يُنصح بتنظيف الأسنان بالفرشاة مرتين يومياً، صباحاً ومساءً، لمدة لا تقل عن دقيقتين في كل مرة.' },
      { id: '3-2', question: 'متى يجب زيارة طبيب الأسنان؟', answer: 'يُنصح بزيارة طبيب الأسنان مرتين سنوياً للفحص والتنظيف الدوري، أو عند الشعور بأي ألم أو مشكلة.' }
    ]
  }
];

const Specialties = () => {
  const [specialties, setSpecialties] = useState<Specialty[]>(initialSpecialties);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty | null>(null);
  
  // إضافة تخصص جديد
  const handleAddSpecialty = (specialty: Specialty) => {
    setSpecialties([...specialties, specialty]);
  };
  
  // تحديث تخصص موجود
  const handleUpdateSpecialty = (updatedSpecialty: Specialty) => {
    setSpecialties(specialties.map(specialty => 
      specialty.id === updatedSpecialty.id ? updatedSpecialty : specialty
    ));
  };
  
  // حذف تخصص
  const handleDeleteSpecialty = (id: string) => {
    setSpecialties(specialties.filter(specialty => specialty.id !== id));
  };
  
  // فتح نافذة التعديل مع بيانات التخصص المحدد
  const handleEditSpecialty = (specialty: Specialty) => {
    setSelectedSpecialty(specialty);
    setOpenAddDialog(true);
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">إدارة التخصصات الطبية</h1>
          <Button 
            onClick={() => {
              setSelectedSpecialty(null);
              setOpenAddDialog(true);
            }}
          >
            <Plus className="ml-2" />
            إضافة تخصص جديد
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">التخصصات الطبية</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="list">
              <TabsList className="mb-4">
                <TabsTrigger value="list">كل التخصصات</TabsTrigger>
                <TabsTrigger value="stats">إحصائيات</TabsTrigger>
              </TabsList>
              
              <TabsContent value="list">
                <SpecialtiesList 
                  specialties={specialties}
                  onEdit={handleEditSpecialty}
                  onDelete={handleDeleteSpecialty}
                />
              </TabsContent>
              
              <TabsContent value="stats">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {specialties.map((specialty) => (
                    <Card key={specialty.id}>
                      <CardHeader>
                        <CardTitle>{specialty.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>عدد الأطباء: {specialty.doctorsCount}</p>
                        <p>عدد الأسئلة الشائعة: {specialty.faqs.length}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      {/* نافذة إضافة/تعديل التخصص */}
      <AddEditSpecialtyDialog
        open={openAddDialog}
        onOpenChange={setOpenAddDialog}
        specialty={selectedSpecialty}
        onSave={(specialty) => {
          if (selectedSpecialty) {
            handleUpdateSpecialty(specialty);
          } else {
            handleAddSpecialty(specialty);
          }
        }}
      />
    </DashboardLayout>
  );
};

export default Specialties;
