
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
  isActive: boolean;
  questionIds: string[];
  doctorsCount: number;
}

// نوع بيانات السؤال الطبي (نفس تعريف MedicalQuestions.tsx)
interface MedicalQuestion {
  id: string;
  question: string;
  specialty: string;
}

// بيانات افتراضية للتخصصات
const initialSpecialties: Specialty[] = [
  {
    id: '1',
    name: 'طب القلب',
    isActive: true,
    questionIds: [],
    doctorsCount: 42,
  },
  {
    id: '2',
    name: 'طب الأطفال',
    isActive: true,
    questionIds: [],
    doctorsCount: 38,
  },
  {
    id: '3',
    name: 'طب الأسنان',
    isActive: false,
    questionIds: [],
    doctorsCount: 53,
  }
];

// بيانات افتراضية للأسئلة الطبية (يمكن تعديلها لاحقاً)
const initialMedicalQuestions: MedicalQuestion[] = [
  { id: '1', question: 'هل تعاني من أمراض مزمنة؟', specialty: 'cardiology' },
  { id: '2', question: 'هل لديك حساسية من أدوية معينة؟', specialty: 'dermatology' },
  { id: '3', question: 'هل تتناول أدوية بشكل دائم؟', specialty: 'cardiology' },
  { id: '4', question: 'هل أجريت عمليات جراحية سابقة؟', specialty: 'orthopedics' },
  { id: '5', question: 'هل تعاني من ارتفاع ضغط الدم؟', specialty: 'cardiology' },
  { id: '6', question: 'هل لديك تاريخ عائلي مع أمراض القلب؟', specialty: 'cardiology' },
  { id: '7', question: 'هل تعاني من مشاكل في التنفس؟', specialty: 'pediatrics' },
  { id: '8', question: 'هل تعاني من آلام في المفاصل؟', specialty: 'orthopedics' },
  { id: '9', question: 'هل لديك مشاكل في الرؤية أو السمع؟', specialty: 'neurology' },
  { id: '10', question: 'هل تعاني من صداع متكرر؟', specialty: 'neurology' },
  { id: '11', question: 'هل لديك مشاكل في الجهاز الهضمي؟', specialty: 'pediatrics' },
  { id: '12', question: 'هل تعاني من طفح جلدي متكرر؟', specialty: 'dermatology' },
  { id: '13', question: 'هل لديك مشاكل في النوم؟', specialty: 'neurology' },
  { id: '14', question: 'هل تعاني من فقدان الوزن غير المبرر؟', specialty: 'pediatrics' },
  { id: '15', question: 'هل لديك مشاكل في الأسنان أو اللثة؟', specialty: 'orthopedics' },
  { id: '16', question: 'هل تعاني من دوار أو إغماء؟', specialty: 'cardiology' },
  { id: '17', question: 'هل لديك مشاكل في الكلى أو الكبد؟', specialty: 'pediatrics' },
  { id: '18', question: 'هل تعاني من التهابات متكررة؟', specialty: 'pediatrics' },
  { id: '19', question: 'هل لديك مشاكل في التبول أو الإخراج؟', specialty: 'pediatrics' },
  { id: '20', question: 'هل تعاني من مشاكل في الجلد أو الشعر؟', specialty: 'dermatology' },
  { id: '21', question: 'هل لديك مشاكل في التركيز أو الذاكرة؟', specialty: 'neurology' },
  { id: '22', question: 'هل تعاني من ألم في الصدر عند الجهد؟', specialty: 'cardiology' },
  { id: '23', question: 'هل لديك مشاكل في الشهية؟', specialty: 'pediatrics' },
  { id: '24', question: 'هل تعاني من تورم في الأطراف؟', specialty: 'cardiology' },
  { id: '25', question: 'هل لديك مشاكل في التعرق الزائد؟', specialty: 'neurology' },
];

const Specialties = () => {
  const [specialties, setSpecialties] = useState<Specialty[]>(initialSpecialties);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty | null>(null);
  const [medicalQuestions] = useState<MedicalQuestion[]>(initialMedicalQuestions);
  
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
                        <p>عدد الأسئلة الشائعة: {specialty.questionIds.length}</p>
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
        medicalQuestions={medicalQuestions}
      />
    </DashboardLayout>
  );
};

export default Specialties;
