
import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import AlertItem from '@/components/dashboard/AlertItem';
import DashboardChart from '@/components/dashboard/DashboardChart';
import { 
  Users, 
  User, 
  MessageSquare, 
  AlertTriangle, 
  FileText
} from 'lucide-react';

// Sample chart data
const specialtyData = [
  { name: 'باطنية', value: 45 },
  { name: 'جلدية', value: 30 },
  { name: 'عظام', value: 25 },
  { name: 'نفسية', value: 20 },
  { name: 'أطفال', value: 18 },
  { name: 'أسنان', value: 15 }
];

const engagementData = [
  { name: 'استجابة عالية', value: 65, color: '#28a745' },
  { name: 'استجابة متوسطة', value: 25, color: '#ffc107' },
  { name: 'استجابة منخفضة', value: 10, color: '#dc3545' }
];

const complaintData = [
  { name: 'تقنية', value: 40, color: '#007BFF' },
  { name: 'سلوك طبيب', value: 30, color: '#dc3545' },
  { name: 'دفع', value: 20, color: '#ffc107' },
  { name: 'أخرى', value: 10, color: '#6c757d' }
];

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-right">لوحة التحكم</h1>
        <p className="text-gray-500 mt-1 text-right">مرحبًا بك في لوحة تحكم منصة الاستشارات الطبية</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatsCard 
          title="الأطباء النشطين" 
          value="124" 
          icon={<Users className="h-6 w-6" />} 
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard 
          title="المرضى المسجلين" 
          value="1,438" 
          icon={<User className="h-6 w-6" />} 
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard 
          title="الاستشارات (أخر 7 أيام)" 
          value="532" 
          icon={<MessageSquare className="h-6 w-6" />} 
          trend={{ value: 5, isPositive: true }}
        />
        <StatsCard 
          title="الشكاوى المفتوحة" 
          value="17" 
          icon={<AlertTriangle className="h-6 w-6" />} 
          trend={{ value: 3, isPositive: false }}
        />
        <StatsCard 
          title="طلبات قيد المراجعة" 
          value="32" 
          icon={<FileText className="h-6 w-6" />} 
        />
      </div>
      
      {/* Charts and Alerts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts Section */}
        <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <DashboardChart 
            title="الاستشارات حسب التخصص" 
            type="bar" 
            data={specialtyData} 
          />
          <DashboardChart 
            title="نسب تفاعل الأطباء" 
            type="pie" 
            data={engagementData} 
            colors={['#28a745', '#ffc107', '#dc3545']}
          />
          <div className="md:col-span-2">
            <DashboardChart 
              title="الشكاوى حسب النوع" 
              type="pie" 
              data={complaintData} 
              colors={['#007BFF', '#dc3545', '#ffc107', '#6c757d']}
            />
          </div>
        </div>
        
        {/* Alerts Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6 h-full">
            <h3 className="text-xl font-medium mb-4 text-right">تنبيهات مهمة</h3>
            
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
    </DashboardLayout>
  );
};

export default Dashboard;
