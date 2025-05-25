
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, X, Plus } from 'lucide-react';
import { PatientFilters } from '@/types/patients';

interface PatientsFilterProps {
  filters: PatientFilters;
  onFiltersChange: (filters: PatientFilters) => void;
  onAddPatient: () => void;
}

const PatientsFilter = ({ filters, onFiltersChange, onAddPatient }: PatientsFilterProps) => {
  const handleFilterChange = (key: keyof PatientFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value === 'all' ? undefined : value
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Object.values(filters).some(value => value);

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="البحث في المرضى..."
              value={filters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="pr-10"
            />
          </div>

          {/* Status Filter */}
          <Select value={filters.status || 'all'} onValueChange={(value) => handleFilterChange('status', value)}>
            <SelectTrigger>
              <SelectValue placeholder="حالة الحساب" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الحالات</SelectItem>
              <SelectItem value="active">نشط</SelectItem>
              <SelectItem value="blocked">محظور</SelectItem>
              <SelectItem value="suspended">معلق</SelectItem>
            </SelectContent>
          </Select>

          {/* Gender Filter */}
          <Select value={filters.gender || 'all'} onValueChange={(value) => handleFilterChange('gender', value)}>
            <SelectTrigger>
              <SelectValue placeholder="الجنس" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">الكل</SelectItem>
              <SelectItem value="male">ذكر</SelectItem>
              <SelectItem value="female">أنثى</SelectItem>
            </SelectContent>
          </Select>

          {/* Registration Date From */}
          <Input
            type="date"
            placeholder="تاريخ التسجيل من"
            value={filters.registrationDateFrom || ''}
            onChange={(e) => handleFilterChange('registrationDateFrom', e.target.value)}
          />

          {/* Registration Date To */}
          <Input
            type="date"
            placeholder="تاريخ التسجيل إلى"
            value={filters.registrationDateTo || ''}
            onChange={(e) => handleFilterChange('registrationDateTo', e.target.value)}
          />

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button onClick={onAddPatient} className="flex-1">
              <Plus className="h-4 w-4 ml-2" />
              إضافة مريض
            </Button>
            
            {hasActiveFilters && (
              <Button 
                variant="outline" 
                onClick={clearFilters}
                className="px-3"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientsFilter;
