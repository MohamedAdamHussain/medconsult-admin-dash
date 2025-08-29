import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import StatsCard from "@/components/dashboard/StatsCard";
import AlertItem from "@/components/dashboard/AlertItem";
import DashboardChart from "@/components/dashboard/DashboardChart";
import {
  Users,
  User,
  MessageSquare,
  AlertTriangle,
  FileText,
  Stethoscope,
  Crown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api, { safeGet } from "@/lib/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

// لا توجد بيانات ثابتة؛ يتم الجلب من الواجهة الخلفية فقط

const engagementData = [
  { name: "استجابة عالية", value: 65, color: "#28a745" },
  { name: "استجابة متوسطة", value: 25, color: "#ffc107" },
  { name: "استجابة منخفضة", value: 10, color: "#dc3545" },
];

// سيتم جلب بيانات الشكاوى ديناميكيًا حسب نوع الشكوى (مريض/طبيب)
type ComplaintsByTypeResponse = {
  type: "patient" | "doctor";
  count: number;
  complaints: unknown[];
};

type UsersCountByRoleResponse = {
  data: { doctor: number; patient: number; admin: number };
};

type GeneralConsultationsCountResponse = {
  General_consultations_count: number;
};

type SpecialConsultationsCountResponse = {
  Special_consultations_count: number;
};

type ComplaintsCountResponse = { count: number };

const Dashboard = () => {
  const navigate = useNavigate();
  const [apiData, setApiData] = useState<unknown>(null);
  const [apiError, setApiError] = useState<{ message: string } | null>(null);
  const [userCounts, setUserCounts] = useState<{
    doctor: number;
    patient: number;
    admin: number;
  }>({ doctor: 0, patient: 0, admin: 0 });
  const [userCountsError, setUserCountsError] = useState<{ message: string } | null>(null);
  const [generalConsultationCount, setGeneralConsultationCount] =
    useState<number>(0);
  const [generalConsultationCountError, setGeneralConsultationCountError] =
    useState<{ message: string } | null>(null);
  const [specialConsultationCount, setSpecialConsultationCount] =
    useState<number>(0);
  const [specialConsultationCountError, setSpecialConsultationCountError] =
    useState<{ message: string } | null>(null);
  const [complaintsCount, setComplaintsCount] =
    useState<number>(0);
  const [complaintsCountError, setComplaintsCountError] =
    useState<{ message: string } | null>(null);
  const [patientComplaintsCount, setPatientComplaintsCount] =
    useState<number>(0);
  const [doctorComplaintsCount, setDoctorComplaintsCount] = useState<number>(0);
  const [complaintsError, setComplaintsError] = useState<{ message: string } | null>(null);
  const [specialtyConsultations, setSpecialtyConsultations] = useState<{ name: string; value: number }[]>([]);
  const [specialtyConsultationsError, setSpecialtyConsultationsError] = useState<{ message: string } | null>(null);
  const [isSpecialtiesDialogOpen, setIsSpecialtiesDialogOpen] = useState(false);

  // useEffect(() => {
  //   // مثال عملي لاستدعاء API مع معالجة الأخطاء
  //   safeGet('/test') // غيّر المسار حسب ما هو متاح في الـ API لديك
  //     .then(({ data, error }) => {
  //       setApiData(data);
  //       setApiError(error);
  //     });
  // }, []);

  useEffect(() => {
    // جلب إحصائيات المستخدمين حسب الدور
    safeGet<UsersCountByRoleResponse>("/admin/users/count-by-role").then(({ data, error }) => {
      if (data && data.data) {
        setUserCounts(data.data);
      }
      setUserCountsError(error);
    });
  }, []);
  useEffect(() => {
    safeGet<GeneralConsultationsCountResponse>("/admin/consultations/general/count").then(({ data, error }) => {
      if (data && data.General_consultations_count !== undefined) {
        setGeneralConsultationCount(data.General_consultations_count);
      }
      setGeneralConsultationCountError(error);
    });
  }, []);
  useEffect(() => {
    safeGet<SpecialConsultationsCountResponse>("/admin/consultations/special/count").then(({ data, error }) => {
      if (data && data.Special_consultations_count !== undefined) {
        setSpecialConsultationCount(data.Special_consultations_count);
      }
      setSpecialConsultationCountError(error);
    });
  }, []);
  useEffect(() => {
    safeGet<ComplaintsCountResponse>('/complaints/count')
      .then(({ data, error }) => {
        if (data && data.count !== undefined) {
          setComplaintsCount(data.count);
        }
        setComplaintsCountError(error);
      });
  }, []);

  useEffect(() => {
    // جلب عدد الشكاوى من المرضى
    safeGet<ComplaintsByTypeResponse>(
      "/admin/complaintsByType?type=patient"
    ).then(({ data, error }) => {
      if (data) setPatientComplaintsCount(data.count || 0);
      if (error) setComplaintsError(error);
    });
    // جلب عدد الشكاوى من الأطباء
    safeGet<ComplaintsByTypeResponse>(
      "/admin/complaintsByType?type=doctor"
    ).then(({ data, error }) => {
      if (data) setDoctorComplaintsCount(data.count || 0);
      if (error) setComplaintsError(error);
    });
  }, []);

  useEffect(() => {
    // جلب الاستشارات حسب التخصص
    safeGet<{ status: boolean; data: Array<{ medical_tag_id: number; consultations_count: number; medical_tag: { name: string; name_ar: string } }> }>(
      'admin/consultations/count-by-specialty'
    ).then(({ data, error }) => {
      if (data && Array.isArray(data.data)) {
        const mapped = data.data.map((item) => ({
          name: item.medical_tag?.name_ar || item.medical_tag?.name || `#${item.medical_tag_id}`,
          value: Number(item.consultations_count) || 0,
        }));
        setSpecialtyConsultations(mapped);
      }
      setSpecialtyConsultationsError(error);
    });
  }, []);
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-right">لوحة التحكم</h1>
        <p className="text-gray-500 mt-1 text-right">
          مرحبًا بك في لوحة تحكم منصة الاستشارات الطبية
        </p>
      </div>

      {/* عرض نتيجة استدعاء الـ API */}
      <div className="mb-4">
        {apiError && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-2 text-right">
            {apiError.message}
          </div>
        )}
        {apiData && (
          <div className="bg-green-100 text-green-700 p-2 rounded mb-2 text-right">
            نتيجة الـ API:{" "}
            {typeof apiData === "object"
              ? JSON.stringify(apiData)
              : String(apiData)}
          </div>
        )}
      </div>

      {/* عرض رسالة خطأ في حال فشل جلب الإحصائيات */}
      {userCountsError && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-2 text-right">
          {userCountsError.message}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <StatsCard
          title="الأطباء المسجلين"
          value={userCounts.doctor}
          icon={<Users className="h-6 w-6" />}
          trend={{ value: 0, isPositive: true }}
        />
        <StatsCard
          title="المرضى المسجلين"
          value={userCounts.patient}
          icon={<User className="h-6 w-6" />}
          trend={{ value: 0, isPositive: true }}
        />
        <div
          className="cursor-pointer transition-transform hover:scale-105"
          onClick={() => navigate("/all/consultations/general")}
        >
          <StatsCard
            title="الاستشارات العامة"
            value={generalConsultationCount}
            icon={<Stethoscope className="h-6 w-6" />}
            trend={{ value: 8, isPositive: true }}
          />
        </div>
        <StatsCard
          title="الاستشارات الخاصة"
          value={specialConsultationCount}
          icon={<Crown className="h-6 w-6" />}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="الشكاوى"
          value={complaintsCount}
          icon={<AlertTriangle className="h-6 w-6" />}
          trend={{ value: 3, isPositive: false }}
        />
      </div>

      {/* Charts and Alerts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts Section */}
        <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Complaints by Type chart moved to the top */}
          <DashboardChart
            title="الشكاوى حسب المصدر"
            type="pie"
            data={[
              { name: "شكاوى المرضى", value: patientComplaintsCount },
              { name: "شكاوى الأطباء", value: doctorComplaintsCount },
            ]}
            colors={["#007BFF", "#dc3545"]}
          />
          <DashboardChart
            title="نسب تفاعل الأطباء"
            type="pie"
            data={engagementData}
            colors={["#28a745", "#ffc107", "#dc3545"]}
          />
          <div className="md:col-span-2">
            {/* Consultations by Specialty - Top 5 and view all */}
            <div className="relative">
              <div className="absolute left-4 top-4">
                <button
                  onClick={() => setIsSpecialtiesDialogOpen(true)}
                  className="text-sm text-primary underline"
                >
                  عرض الكل
                </button>
              </div>
              <div className="cursor-pointer" onClick={() => setIsSpecialtiesDialogOpen(true)}>
                <DashboardChart
                  title="الاستشارات حسب التخصص (أكبر 5)"
                  type="line"
                  data={[...specialtyConsultations].sort((a,b)=>b.value-a.value).slice(0,5)}
                  colors={["#007BFF"]}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Alerts Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6 h-full">
            <h3 className="text-xl font-medium mb-4 text-right">
              تنبيهات مهمة
            </h3>

            <div className="space-y-4">
              <AlertItem
                type="info"
                title="طلبات تسجيل جديدة"
                message="هناك 8 طلبات تسجيل جديدة بحاجة إلى مراجعة"
                time="منذ 45 دقيقة"
              />
              <AlertItem
                type="warning"
                title="شكوى عاجلة"
                message="تم استلام شكوى عاجلة من مريض حول مشكلة تقنية"
                time="منذ ساعتين"
              />
              <AlertItem
                type="error"
                title="مشكلة في الدفع"
                message="تعذر إكمال 3 عمليات دفع بسبب خطأ تقني"
                time="منذ 3 ساعات"
              />
              <AlertItem
                type="success"
                title="تم قبول طبيب جديد"
                message="تم قبول د. أحمد محمد في تخصص الباطنية"
                time="منذ 5 ساعات"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Dialog: All specialties list */}
      <Dialog open={isSpecialtiesDialogOpen} onOpenChange={setIsSpecialtiesDialogOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-right">الاستشارات حسب التخصص</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-2">
              {[...specialtyConsultations].sort((a,b)=>b.value-a.value).map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="font-medium">{item.name}</span>
                  <span className="text-muted-foreground">{item.value}</span>
                </div>
              ))}
              {specialtyConsultations.length === 0 && (
                <div className="text-center py-6 text-muted-foreground">لا توجد بيانات</div>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Dashboard;
