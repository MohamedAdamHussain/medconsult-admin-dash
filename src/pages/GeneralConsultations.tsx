import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Stethoscope, Users, Clock, CheckCircle } from 'lucide-react';
import StatsCard from '@/components/dashboard/StatsCard';
import useGeneralConsultations from '@/hooks/useGeneralConsultations';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import GeneralConsultationsListComponent from '@/components/consultations/GeneralConsultationsList';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Pagination from '@/components/shared/Pagination';

const GeneralConsultations = () => {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-right">الاستشارات العامة</h1>
        <p className="text-gray-500 mt-1 text-right">إدارة ومتابعة الاستشارات العامة في المنصة</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard 
          title="إجمالي الاستشارات" 
          value="324" 
          icon={<Stethoscope className="h-6 w-6" />} 
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard 
          title="الاستشارات النشطة" 
          value="145" 
          icon={<Users className="h-6 w-6" />} 
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard 
          title="في الانتظار" 
          value="32" 
          icon={<Clock className="h-6 w-6" />} 
          trend={{ value: 5, isPositive: false }}
        />
        <StatsCard 
          title="مكتملة" 
          value="147" 
          icon={<CheckCircle className="h-6 w-6" />} 
          trend={{ value: 15, isPositive: true }}
        />
      </div>

      {/* Main Content */}
      <GeneralConsultationsSection />
    </DashboardLayout>
  );
};

export default GeneralConsultations;

function GeneralConsultationsSection() {
  const [page, setPage] = React.useState(1);
  const { data, isLoading, isError, error } = useGeneralConsultations(page);
  const [selected, setSelected] = React.useState<any>(null);
  const [open, setOpen] = React.useState(false);

  const consultations = data?.data?.data || [];
  const currentPage = data?.data?.current_page || 1;
  const totalPages = data?.data?.last_page || 1;
  const totalItems = data?.data?.total || 0;
  const perPage = data?.data?.per_page || 10;

  return (
    <>
      <h3 className="text-xl font-medium mb-4 text-right">قائمة الاستشارات العامة</h3>
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-8 text-blue-600 font-bold gap-2">
          <span>يتم الآن تحميل الاستشارات، يرجى الانتظار...</span>
        </div>
      )}
      {isError && (
        <div className="flex flex-col items-center justify-center py-8 text-red-600 font-bold gap-2">
          <span>تعذر تحميل الاستشارات. تحقق من اتصالك أو حاول مرة أخرى لاحقًا.</span>
          <span className="text-xs text-red-400 mt-1">{(error as Error)?.message}</span>
        </div>
      )}
      {!isLoading && !isError && (
        <GeneralConsultationsListComponent 
          consultations={consultations}
          onViewDetails={(c) => {
            setSelected(c);
            setOpen(true);
          }}
        />
      )}

      {!isLoading && !isError && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(p) => setPage(p)}
          totalItems={totalItems}
          itemsPerPage={perPage}
        />
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl text-right">تفاصيل الاستشارة</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4 text-right">
              <div>
                <span className="font-semibold">المشكلة:</span> {selected.problem}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="font-semibold">الحالة:</span> {statusLabel(selected.status)}
                </div>
                <div>
                  <span className="font-semibold">مجهول؟</span> {selected.isAnonymous ? 'نعم' : 'لا'}
                </div>
                <div>
                  <span className="font-semibold">تاريخ الإنشاء:</span> {formatDate(selected.created_at)}
                </div>
                <div>
                  <span className="font-semibold">المجدولة في:</span> {formatDate(selected.scheduled_at)}
                </div>
                <div>
                  <span className="font-semibold">المستخدم:</span> {selected.user?.name ?? '-'}
                </div>
                <div>
                  <span className="font-semibold">التخصص:</span> {selected.medical_tag?.name}
                </div>
                <div>
                  <span className="font-semibold">الطبيب:</span> {selected.doctor?.name ?? '-'}
                </div>
              </div>
              {selected.media && (
                <div className="pt-2">
                  <span className="font-semibold block mb-2">الوسائط:</span>
                  <a href={selected.media} target="_blank" rel="noreferrer" className="text-primary underline break-all">عرض الوسائط</a>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function formatDate(value?: string) {
  if (!value) return '-';
  try {
    return format(new Date(value), 'yyyy/MM/dd HH:mm', { locale: ar });
  } catch {
    return value;
  }
}

function statusLabel(s: string) {
  switch (s) {
    case 'scheduled':
      return 'مجدولة';
    case 'completed':
      return 'مكتملة';
    case 'cancelled':
      return 'ملغاة';
    case 'pending':
      return 'قيد الانتظار';
    default:
      return s;
  }
}