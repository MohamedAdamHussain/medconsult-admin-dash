import React from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Appointment } from '@/types/appointments';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Loader2 } from 'lucide-react';

interface AppointmentsTableProps {
  appointments: Appointment[];
  isLoading: boolean;
  isError: boolean;
}

// Day options for display
const dayOptions = [
  { value: 'Monday', label: 'الإثنين' },
  { value: 'Tuesday', label: 'الثلاثاء' },
  { value: 'Wednesday', label: 'الأربعاء' },
  { value: 'Thursday', label: 'الخميس' },
  { value: 'Friday', label: 'الجمعة' },
  { value: 'Saturday', label: 'السبت' },
  { value: 'Sunday', label: 'الأحد' },
];

const AppointmentsTable: React.FC<AppointmentsTableProps> = ({ 
  appointments, 
  isLoading, 
  isError 
}) => {
  // Function to get Arabic day name
  const getArabicDayName = (day: string) => {
    const option = dayOptions.find(d => d.value === day);
    return option ? option.label : day;
  };

  // Function to format date
  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'yyyy/MM/dd', { locale: ar });
    } catch (error) {
      return dateStr;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500 py-4">
        حدث خطأ أثناء تحميل البيانات. يرجى المحاولة مرة أخرى.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-right">#</TableHead>
          <TableHead className="text-right">الطبيب</TableHead>
          <TableHead className="text-right">المريض</TableHead>
          <TableHead className="text-right">التاريخ</TableHead>
          <TableHead className="text-right">اليوم</TableHead>
          <TableHead className="text-right">الوقت</TableHead>
          <TableHead className="text-right">ملاحظات</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {appointments.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center text-gray-500">لا توجد مواعيد</TableCell>
          </TableRow>
        ) : (
          appointments.map((appointment, idx) => (
            <TableRow key={appointment.id}>
              <TableCell>{idx + 1}</TableCell>
              <TableCell>{appointment.doctor.user.fullName}</TableCell>
              <TableCell>{appointment.patient.user.fullName}</TableCell>
              <TableCell>{formatDate(appointment.date)}</TableCell>
              <TableCell>{getArabicDayName(appointment.day)}</TableCell>
              <TableCell>{appointment.time}</TableCell>
              <TableCell>{appointment.user_note || appointment.doctor_note || '-'}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default AppointmentsTable;