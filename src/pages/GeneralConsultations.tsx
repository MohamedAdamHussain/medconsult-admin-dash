import React from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Stethoscope, Users, Clock, CheckCircle } from 'lucide-react';
import StatsCard from '@/components/dashboard/StatsCard';

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
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-medium mb-4 text-right">قائمة الاستشارات العامة</h3>
        <div className="text-center py-12">
          <Stethoscope className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 text-lg">سيتم عرض قائمة الاستشارات العامة هنا</p>
          <p className="text-gray-400 text-sm mt-2">جاري تطوير هذا القسم...</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default GeneralConsultations;