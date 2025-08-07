
import React, { useState } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SpecialtiesList from '@/components/specialties/SpecialtiesList';
import AddEditSpecialtyDialog from '@/components/specialties/AddEditSpecialtyDialog';
import { Plus, Loader2, RefreshCw } from 'lucide-react';
import { useMedicalTags } from '@/hooks/useMedicalTags';
import { MedicalTag, CreateMedicalTagRequest, UpdateMedicalTagRequest } from '@/types/specialties';

const Specialties = () => {
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState<MedicalTag | null>(null);
  
  const {
    medicalTags,
    isLoading,
    error,
    refetch,
    createMedicalTag,
    updateMedicalTag,
    deleteMedicalTag,
    isCreating,
    isUpdating,
    isDeleting,
  } = useMedicalTags();
  
  // فتح نافذة التعديل مع بيانات التخصص المحدد
  const handleEditSpecialty = (specialty: MedicalTag) => {
    setSelectedSpecialty(specialty);
    setOpenAddDialog(true);
  };

  // معالجة حفظ التخصص (إنشاء أو تحديث)
  const handleSaveSpecialty = (data: CreateMedicalTagRequest | { id: number; data: UpdateMedicalTagRequest }) => {
    if ('id' in data) {
      // تحديث تخصص موجود
      updateMedicalTag(data);
    } else {
      // إنشاء تخصص جديد
      createMedicalTag(data);
    }
  };

  // معالجة حذف التخصص
  const handleDeleteSpecialty = (id: number) => {
    deleteMedicalTag(id);
  };

  // إحصائيات التخصصات
  const activeSpecialties = medicalTags.filter(specialty => specialty.is_active).length;
  const inactiveSpecialties = medicalTags.filter(specialty => !specialty.is_active).length;

  return (
    <DashboardLayout>
      <div className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-primary-main text-right w-full md:w-auto">إدارة التخصصات الطبية</h1>
            <p className="text-gray-500 mt-2 text-right w-full">إدارة وإضافة وتعديل التخصصات الطبية المعتمدة في المنصة</p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => refetch()}
              variant="outline"
              disabled={isLoading}
            >
              <RefreshCw className={`ml-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              تحديث
            </Button>
            <Button 
              onClick={() => {
                setSelectedSpecialty(null);
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
              إضافة تخصص جديد
            </Button>
          </div>
        </div>

        {/* عرض الأخطاء */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-600 text-center">
                حدث خطأ أثناء تحميل البيانات. يرجى المحاولة مرة أخرى.
              </p>
            </CardContent>
          </Card>
        )}
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">التخصصات الطبية</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="list">
              <TabsList className="mb-4">
                <TabsTrigger value="list">كل التخصصات ({medicalTags.length})</TabsTrigger>
                <TabsTrigger value="stats">إحصائيات</TabsTrigger>
              </TabsList>
              
              <TabsContent value="list">
                {isLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <span className="mr-2">جاري تحميل التخصصات...</span>
                  </div>
                ) : (
                  <SpecialtiesList 
                    specialties={medicalTags}
                    onEdit={handleEditSpecialty}
                    onDelete={handleDeleteSpecialty}
                    isDeleting={isDeleting}
                  />
                )}
              </TabsContent>
              
              <TabsContent value="stats">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600">إجمالي التخصصات</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-600">{medicalTags.length}</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600">التخصصات النشطة</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">{activeSpecialties}</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600">التخصصات غير النشطة</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-red-600">{inactiveSpecialties}</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600">معدل النشاط</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-purple-600">
                        {medicalTags.length > 0 ? Math.round((activeSpecialties / medicalTags.length) * 100) : 0}%
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {medicalTags.map((specialty) => (
                    <Card key={specialty.id}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-2">
                          {specialty.icon && (
                            <img 
                              src={specialty.icon} 
                              alt={specialty.name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          )}
                          <CardTitle className="text-base">{specialty.name}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-1 text-sm">
                          {specialty.name_ar && (
                            <p><span className="font-medium">الاسم العربي:</span> {specialty.name_ar}</p>
                          )}
                          {specialty.description && (
                            <p><span className="font-medium">الوصف:</span> {specialty.description}</p>
                          )}
                          <p>
                            <span className="font-medium">الحالة:</span> 
                            <span className={`mr-1 ${specialty.is_active ? 'text-green-600' : 'text-red-600'}`}>
                              {specialty.is_active ? 'نشط' : 'غير نشط'}
                            </span>
                          </p>
                          {specialty.created_at && (
                            <p>
                              <span className="font-medium">تاريخ الإنشاء:</span> 
                              {new Date(specialty.created_at).toLocaleDateString('ar-SA')}
                            </p>
                          )}
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
      
      {/* نافذة إضافة/تعديل التخصص */}
      <AddEditSpecialtyDialog
        open={openAddDialog}
        onOpenChange={(open) => {
          setOpenAddDialog(open);
          if (!open) {
            setSelectedSpecialty(null);
          }
        }}
        specialty={selectedSpecialty}
        onSave={handleSaveSpecialty}
        isLoading={isCreating || isUpdating}
      />
    </DashboardLayout>
  );
};

export default Specialties;
