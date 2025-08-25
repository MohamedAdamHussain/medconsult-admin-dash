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
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary-main text-right w-full md:w-auto">
            إدارة المرضى
          </h1>
          <h2 className="text-xl font-semibold text-secondary-main mt-2 text-right">
            قائمة المرضى المسجلين
          </h2>
          <p className="text-muted mt-2 text-right w-full">
            يمكنك هنا إضافة، تعديل، أو حذف بيانات المرضى.
          </p>
        </div>
        <div className="flex flex-row-reverse gap-2 w-full md:w-auto justify-start md:justify-end">
          <Button 
            onClick={() => {
              console.log("Refetching patients");
              refetch()}}
            variant="outline"
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg shadow"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
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
            className="flex items-center gap-2 bg-primary-main text-white hover:bg-blue-700 px-4 py-2 rounded-lg shadow"
            disabled={isCreating}
          >
            {isCreating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus size={16} />
            )}
            تسجيل مريض جديد
          </Button>
        </div>
      </div>

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

      {/* رسالة تحميل */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-8 text-blue-600 font-bold gap-2">
          <Loader2 className="animate-spin h-8 w-8 mb-2" />
          <span>يتم الآن تحميل المرضى، يرجى الانتظار...</span>
        </div>
      )}
      
      {/* رسالة خطأ */}
      {error && (
        <div className="flex flex-col items-center justify-center py-8 text-red-600 font-bold gap-2">
          <AlertTriangle className="h-8 w-8 mb-2" />
          <span>
            تعذر تحميل المرضى. تحقق من اتصالك أو حاول مرة أخرى لاحقًا.
          </span>
          {error.message && (
            <span className="text-xs text-red-400 mt-1">{error.message}</span>
          )}
        </div>
      )}

      {/* قائمة المرضى */}
      {!isLoading && !error && (
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
          onDeletePatient={(id) => {
            handleDeletePatient(Number(id));
          }}
          onSendNotification={(id) => {
            console.log('Send notification to patient:', id);
          }}
        />
      )}
      
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
