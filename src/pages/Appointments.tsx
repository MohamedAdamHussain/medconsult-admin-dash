import React, { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useAppointmentsData } from '@/hooks/useAppointmentsData';
import AppointmentsTable from '@/components/appointments/AppointmentsTable';
import AppointmentsFilter from '@/components/appointments/AppointmentsFilter';

const AppointmentsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [dayFilter, setDayFilter] = useState('all');

  // Define filters for API call
  const filters = {
    search: searchTerm,
    date: dateFilter,
    day: dayFilter === 'all' ? '' : dayFilter,
  };

  // Fetch appointments data
  const { data, isLoading, isError } = useAppointmentsData(filters);
  const appointments = data?.data || [];

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-right">إدارة المواعيد</h1>
        <p className="text-gray-500 mt-1 text-right">جدولة ومتابعة مواعيد الأطباء مع المرضى</p>
      </div>

      {/* الفلترة */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-between">
        <AppointmentsFilter 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          dayFilter={dayFilter}
          setDayFilter={setDayFilter}
        />
      </div>

      {/* جدول المواعيد */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right flex items-center gap-2">
            <span>قائمة المواعيد</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AppointmentsTable 
            appointments={appointments}
            isLoading={isLoading}
            isError={isError}
          />
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default AppointmentsPage; 