import React, { useState, useMemo } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import PatientsList from '@/components/patients/PatientsList';
import PatientDetails from '@/components/patients/PatientDetails';
import PatientsFilter from '@/components/patients/PatientsFilter';
import PatientForm from '@/components/patients/PatientForm';
import AddEditPatientDialog from '@/components/patients/AddEditPatientDialog';
import { usePatients } from '@/hooks/usePatients';
import { Patient, CreatePatientRequest, UpdatePatientRequest } from '@/types/patients';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import ExportButton from '@/components/shared/ExportButton';
import Pagination from '@/components/shared/Pagination';
import { AlertTriangle, Loader2, Plus, RefreshCw, Search } from 'lucide-react';

const Patients = () => {
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [filterGender, setFilterGender] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  
  const {
    patients,
    isLoading,
    error,
    refetch,
    createPatient,
    updatePatient,
    deletePatient,
    isCreating,
    isUpdating,
    isDeleting,
  } = usePatients();

  // فتح نافذة التعديل مع بيانات المريض المحدد
  const handleEditPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setOpenAddDialog(true);
  };

  // معالجة حفظ المريض (إنشاء أو تحديث)
  const handleSavePatient = (data: CreatePatientRequest | { id: number; data: UpdatePatientRequest }) => {
    if ('id' in data) {
      // تحديث مريض موجود
      updatePatient(data);
    } else {
      // تسجيل مريض جديد
      createPatient(data);
    }
  };

  // معالجة حذف المريض
  const handleDeletePatient = (id: number) => {
    deletePatient(id);
  };

  // فلترة المرضى
  const filteredPatients = useMemo(() => {
    return patients.filter(patient => {
      // فلترة حسب البحث
      const matchesSearch = !search || 
        (patient.fullName || patient.name || '').toLowerCase().includes(search.toLowerCase()) ||
        patient.email.toLowerCase().includes(search.toLowerCase()) ||
        (patient.phoneNumber || patient.phone || '').includes(search);

      // فلترة حسب الجنس
      const matchesGender = filterGender === 'all' || patient.gender === filterGender;

      // فلترة حسب الحالة
      const matchesStatus = filterStatus === 'all' || patient.status === filterStatus;

      return matchesSearch && matchesGender && matchesStatus;
    });
  }, [patients, search, filterGender, filterStatus]);

  // إحصائيات المرضى
  const malePatients = patients.filter(p => p.gender === 'male').length;
  const femalePatients = patients.filter(p => p.gender === 'female').length;
  const activePatients = patients.filter(p => p.status === 'active' || p.status === 'مفعل').length;

  // Export columns configuration for patients
  const patientExportColumns = [
    { key: 'fullName', title: 'اسم المريض' },
    { key: 'email', title: 'البريد الإلكتروني' },
    { key: 'phoneNumber', title: 'الهاتف' },
    { key: 'gender', title: 'الجنس' },
    { key: 'birthday', title: 'تاريخ الميلاد' },
    { key: 'address', title: 'العنوان' },
    { key: 'status', title: 'الحالة' },
    { key: 'created_at', title: 'تاريخ التسجيل' }
  ];

  return (
    <DashboardLayout>
      <div className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-primary-main text-right w-full md:w-auto">إدارة المرضى</h1>
            <p className="text-gray-500 mt-2 text-right w-full">إدارة بيانات المرضى المسجلين ومتابعة حالاتهم</p>
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
            <ExportButton
              data={filteredPatients}
              columns={patientExportColumns}
              filename="patients_list"
              title="قائمة المرضى"
            />
            <Button 
              onClick={() => {
                setSelectedPatient(null);
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
              تسجيل مريض جديد
            </Button>
          </div>
        </div>

        {/* عرض الأخطاء */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                <p>حدث خطأ أثناء تحميل البيانات. يرجى المحاولة مرة أخرى.</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* البحث والفلترة */}
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
                  placeholder="بحث بالاسم، البريد، أو الهاتف..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="text-right"
                />
              </div>
              <div>
                <Select value={filterGender} onValueChange={setFilterGender}>
                  <SelectTrigger className="text-right">
                    <SelectValue placeholder="فلترة حسب الجنس" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">كل الأجناس</SelectItem>
                    <SelectItem value="male">ذكر</SelectItem>
                    <SelectItem value="female">أنثى</SelectItem>
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
                    <SelectItem value="مفعل">مفعل</SelectItem>
                    <SelectItem value="blocked">محظور</SelectItem>
                    <SelectItem value="غير مفعل">غير مفعل</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearch('');
                    setFilterGender('all');
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
            <CardTitle className="text-lg">المرضى المسجلون</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="list">
              <TabsList className="mb-4">
                <TabsTrigger value="list">قائمة المرضى ({patients.length})</TabsTrigger>
                <TabsTrigger value="stats">إحصائيات</TabsTrigger>
              </TabsList>
              
              <TabsContent value="list">
                {isLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <span className="mr-2">جاري تحميل المرضى...</span>
                  </div>
                ) : (
                  <PatientsList 
                    patients={filteredPatients}
                    onViewDetails={(patient) => {
                      setSelectedPatient(patient);
                      setIsDetailsDialogOpen(true);
                    }}
                    onEditPatient={handleEditPatient}
                    onUpdateStatus={(id, status) => {
                      // يمكن إضافة وظيفة تحديث الحالة لاحقاً
                      console.log('Update status:', id, status);
                    }}
                  />
                )}
              </TabsContent>
              
              <TabsContent value="stats">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600">إجمالي المرضى</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-600">{patients.length}</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600">المرضى الذكور</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">{malePatients}</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600">المرضى الإناث</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-pink-600">{femalePatients}</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-gray-600">المرضى النشطون</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-purple-600">{activePatients}</div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredPatients.map((patient) => (
                    <Card key={patient.id}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">{patient.fullName || patient.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <p><span className="font-medium">البريد:</span> {patient.email}</p>
                          <p><span className="font-medium">الهاتف:</span> {patient.phoneNumber || patient.phone}</p>
                          <p><span className="font-medium">الجنس:</span> {patient.gender === 'male' ? 'ذكر' : 'أنثى'}</p>
                          <p><span className="font-medium">العنوان:</span> {patient.address || 'غير محدد'}</p>
                          {patient.birthday && (
                            <p><span className="font-medium">تاريخ الميلاد:</span> {new Date(patient.birthday).toLocaleDateString('ar-SA')}</p>
                          )}
                          {patient.created_at && (
                            <p><span className="font-medium">تاريخ التسجيل:</span> {new Date(patient.created_at).toLocaleDateString('ar-SA')}</p>
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
      
      {/* نافذة إضافة/تعديل المريض */}
      <AddEditPatientDialog
        open={openAddDialog}
        onOpenChange={(open) => {
          setOpenAddDialog(open);
          if (!open) {
            setSelectedPatient(null);
          }
        }}
        patient={selectedPatient}
        onSave={handleSavePatient}
        isLoading={isCreating || isUpdating}
      />

      {/* نافذة تفاصيل المريض */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl text-right">تفاصيل المريض</DialogTitle>
          </DialogHeader>
          
          {selectedPatient && (
            <PatientDetails 
              patient={selectedPatient}
              consultations={[]} // يمكن إضافة الاستشارات لاحقاً
            />
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Patients;
