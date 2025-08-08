import React, { useState, useMemo } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Plus, Search, RefreshCw, Loader2 } from 'lucide-react';
import { useMedicalQuestions } from '@/hooks/useMedicalQuestions';
import { useMedicalTags } from '@/hooks/useMedicalTags';
import { MedicalQuestion, CreateMedicalQuestionRequest, UpdateMedicalQuestionRequest } from '@/types/questions';
import AddEditQuestionDialog from '@/components/medical-questions/AddEditQuestionDialog';
import QuestionsList from '@/components/medical-questions/QuestionsList';
import QuestionCard from '@/components/medical-questions/QuestionCard';

const MedicalQuestions: React.FC = () => {
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<MedicalQuestion | null>(null);
  const [filterSpecialty, setFilterSpecialty] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [search, setSearch] = useState('');
  
  const {
    medicalQuestions,
    isLoading: questionsLoading,
    error: questionsError,
    refetch: refetchQuestions,
    createMedicalQuestion,
    updateMedicalQuestion,
    deleteMedicalQuestion,
    isCreating,
    isUpdating,
    isDeleting,
  } = useMedicalQuestions();

  const {
    medicalTags: specialties,
    isLoading: specialtiesLoading,
    error: specialtiesError,
  } = useMedicalTags();

  // فتح نافذة التعديل مع بيانات السؤال المحدد
  const handleEditQuestion = (question: MedicalQuestion) => {
    setSelectedQuestion(question);
    setOpenAddDialog(true);
  };

  // معالجة حفظ السؤال (إنشاء أو تحديث)
  const handleSaveQuestion = (data: CreateMedicalQuestionRequest | { id: number; data: UpdateMedicalQuestionRequest }) => {
    if ('id' in data) {
      // تحديث سؤال موجود
      updateMedicalQuestion(data);
    } else {
      // إنشاء سؤال جديد
      createMedicalQuestion(data);
    }
  };

  // معالجة حذف السؤال
  const handleDeleteQuestion = (id: number) => {
    deleteMedicalQuestion(id);
  };

  // فلترة الأسئلة
  const filteredQuestions = useMemo(() => {
    return medicalQuestions.filter(question => {
      // فلترة حسب البحث
      const matchesSearch = !search || 
        question.content.toLowerCase().includes(search.toLowerCase());

      // فلترة حسب التخصص
      const matchesSpecialty = filterSpecialty === 'all' || 
        question.medical_tags?.some(tag => tag.id === parseInt(filterSpecialty));

      // فلترة حسب الحالة
      const matchesStatus = filterStatus === 'all' || 
        (filterStatus === 'active' && question.isActive === 1) ||
        (filterStatus === 'inactive' && question.isActive === 0);

      return matchesSearch && matchesSpecialty && matchesStatus;
    });
  }, [medicalQuestions, search, filterSpecialty, filterStatus]);

  // إحصائيات الأسئلة
  const activeQuestions = medicalQuestions.filter(q => q.isActive === 1).length;
  const inactiveQuestions = medicalQuestions.filter(q => q.isActive === 0).length;

  return (
    <DashboardLayout>
      <div className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-primary-main text-right w-full md:w-auto">إدارة الأسئلة الطبية الشائعة</h1>
            <p className="text-gray-500 mt-2 text-right w-full">إدارة الأسئلة التي يمكن أن يطرحها الأطباء على المرضى حسب التخصص</p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => refetchQuestions()}
              variant="outline"
              disabled={questionsLoading}
            >
              <RefreshCw className={`ml-2 h-4 w-4 ${questionsLoading ? 'animate-spin' : ''}`} />
              تحديث
            </Button>
            <Button 
              onClick={() => {
                setSelectedQuestion(null);
                setOpenAddDialog(true);
              }}
              className="bg-primary-main text-white hover:bg-blue-700"
              disabled={isCreating}
            >
              {isCreating ? (
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              ) : (
                <Plus className="ml-2" />
              )}
              إضافة سؤال جديد
            </Button>
          </div>
        </div>

        {/* عرض الأخطاء */}
        {(questionsError || specialtiesError) && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-600 text-center">
                حدث خطأ أثناء تحميل البيانات. يرجى المحاولة مرة أخرى.
              </p>
            </CardContent>
          </Card>
        )}

        {/* الفلترة والبحث */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-right flex items-center gap-2">
              <Search size={18} />
              <span>البحث والفلترة</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Input
                  placeholder="بحث في محتوى السؤال..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="text-right"
                />
              </div>
              <div>
                <Select value={filterSpecialty} onValueChange={setFilterSpecialty}>
                  <SelectTrigger className="text-right">
                    <SelectValue placeholder="فلترة حسب التخصص" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">كل التخصصات</SelectItem>
                    {specialties.map(specialty => (
                      <SelectItem key={specialty.id} value={specialty.id.toString()}>
                        {specialty.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="text-right">
                    <SelectValue placeholder="فلترة حسب الحالة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">كل الحالات</SelectItem>
                    <SelectItem value="active">نشط</SelectItem>
                    <SelectItem value="inactive">غير نشط</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearch('');
                    setFilterSpecialty('all');
                    setFilterStatus('all');
                  }}
                  className="w-full"
                >
                  مسح الفلاتر
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">الأسئلة الطبية</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="list">
              <TabsList className="mb-4">
                <TabsTrigger value="list">قائمة الأسئلة ({medicalQuestions.length})</TabsTrigger>
                <TabsTrigger value="cards">عرض البطاقات</TabsTrigger>
                <TabsTrigger value="stats">إحصائيات</TabsTrigger>
              </TabsList>
              
              <TabsContent value="list">
                {questionsLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <span className="mr-2">جاري تحميل الأسئلة...</span>
                  </div>
                ) : (
                  <QuestionsList 
                    questions={filteredQuestions}
                    onEdit={handleEditQuestion}
                    onDelete={handleDeleteQuestion}
                    isDeleting={isDeleting}
                  />
                )}
              </TabsContent>
              
              <TabsContent value="cards">
                {questionsLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <span className="mr-2">جاري تحميل الأسئلة...</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredQuestions.map((question) => (
                      <QuestionCard
                        key={question.id}
                        question={question}
                        onEdit={handleEditQuestion}
                        onDelete={handleDeleteQuestion}
                        isDeleting={isDeleting}
                      />
                    ))}
                    {filteredQuestions.length === 0 && (
                      <div className="col-span-full text-center py-8 text-gray-500">
                        لا توجد أسئلة تطابق معايير البحث
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="stats">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600">إجمالي الأسئلة</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-600">{medicalQuestions.length}</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600">الأسئلة النشطة</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">{activeQuestions}</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600">الأسئلة غير النشطة</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-red-600">{inactiveQuestions}</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600">معدل النشاط</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-purple-600">
                        {medicalQuestions.length > 0 ? Math.round((activeQuestions / medicalQuestions.length) * 100) : 0}%
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredQuestions.map((question) => (
                    <Card key={question.id}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base line-clamp-2">{question.content}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium">التخصصات:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {question.medical_tags && question.medical_tags.length > 0 ? (
                                question.medical_tags.map((tag) => (
                                  <span 
                                    key={tag.id}
                                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs"
                                  >
                                    {tag.name_ar || tag.name}
                                  </span>
                                ))
                              ) : (
                                <span className="text-gray-500">
                                  لا توجد تخصصات
                                </span>
                              )}
                            </div>
                          </div>
                          <p>
                            <span className="font-medium">الحالة:</span> 
                            <span className={`mr-1 ${question.isActive === 1 ? 'text-green-600' : 'text-red-600'}`}>
                              {question.isActive === 1 ? 'نشط' : 'غير نشط'}
                            </span>
                          </p>
                          <p>
                            <span className="font-medium">التخصص الرئيسي:</span> 
                            <span className="mr-1 text-gray-600">#{question.specialty_id}</span>
                          </p>
                          {question.parent_question_id && (
                            <p>
                              <span className="font-medium">السؤال الأب:</span> 
                              <span className="mr-1 text-gray-600">#{question.parent_question_id}</span>
                            </p>
                          )}
                          {question.parent_answer_value && (
                            <p>
                              <span className="font-medium">قيمة الإجابة الأب:</span> 
                              <span className="mr-1 text-gray-600">{question.parent_answer_value}</span>
                            </p>
                          )}
                          <p>
                            <span className="font-medium">تاريخ الإنشاء:</span> 
                            {new Date(question.created_at).toLocaleDateString('ar-SA')}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      {/* نافذة إضافة/تعديل السؤال */}
      <AddEditQuestionDialog
        open={openAddDialog}
        onOpenChange={(open) => {
          setOpenAddDialog(open);
          if (!open) {
            setSelectedQuestion(null);
          }
        }}
        question={selectedQuestion}
        onSave={handleSaveQuestion}
        specialties={specialties}
        isLoading={isCreating || isUpdating}
      />
    </DashboardLayout>
  );
};

export default MedicalQuestions; 