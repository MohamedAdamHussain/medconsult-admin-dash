import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Search } from 'lucide-react';

interface AppointmentsFilterProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  dateFilter: string;
  setDateFilter: (value: string) => void;
  dayFilter: string;
  setDayFilter: (value: string) => void;
}

const AppointmentsFilter: React.FC<AppointmentsFilterProps> = ({
  searchTerm,
  setSearchTerm,
  dateFilter,
  setDateFilter,
  dayFilter,
  setDayFilter,
}) => {
  // Day options for filter
  const dayOptions = [
    { value: 'Monday', label: 'الإثنين' },
    { value: 'Tuesday', label: 'الثلاثاء' },
    { value: 'Wednesday', label: 'الأربعاء' },
    { value: 'Thursday', label: 'الخميس' },
    { value: 'Friday', label: 'الجمعة' },
    { value: 'Saturday', label: 'السبت' },
    { value: 'Sunday', label: 'الأحد' },
  ];

  return (
    <div className="flex flex-wrap gap-2 items-center w-full md:w-auto">
      <Select value={dayFilter} onValueChange={setDayFilter}>
        <SelectTrigger className="w-40 text-right">
          <SelectValue placeholder="كل الأيام" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">كل الأيام</SelectItem>
          {dayOptions.map(day => (
            <SelectItem key={day.value} value={day.value}>{day.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        type="date"
        value={dateFilter}
        onChange={e => setDateFilter(e.target.value)}
        className="w-40 text-right"
      />
      <div className="relative w-64">
        <Input
          placeholder="بحث..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="text-right pr-8"
        />
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
      </div>
    </div>
  );
};

export default AppointmentsFilter;