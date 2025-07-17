
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, X } from 'lucide-react';
import { ComplaintFilters } from '@/types/complaints';

interface ComplaintsFilterProps {
  filters: ComplaintFilters;
  onFiltersChange: (filters: ComplaintFilters) => void;
}

const ComplaintsFilter = ({ filters, onFiltersChange }: ComplaintsFilterProps) => {
  const handleFilterChange = (key: keyof ComplaintFilters, value: string) => {
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="البحث في الشكاوى..."
              value={filters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="pr-10"
            />
          </div>

          {/* Type Filter */}
          <Select value={filters.type || 'all'} onValueChange={(value) => handleFilterChange('type', value)}>
            <SelectTrigger>
              <SelectValue placeholder="نوع الشكوى" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الأنواع</SelectItem>
              <SelectItem value="technical">تقنية</SelectItem>
              <SelectItem value="doctor_behavior">سلوك طبيب</SelectItem>
              <SelectItem value="payment">دفع</SelectItem>
              <SelectItem value="service">خدمة</SelectItem>
              <SelectItem value="other">أخرى</SelectItem>
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select value={filters.status || 'all'} onValueChange={(value) => handleFilterChange('status', value)}>
            <SelectTrigger>
              <SelectValue placeholder="الحالة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الحالات</SelectItem>
              <SelectItem value="open">مفتوحة</SelectItem>
              <SelectItem value="in_progress">قيد المعالجة</SelectItem>
              <SelectItem value="closed">مغلقة</SelectItem>
            </SelectContent>
          </Select>

          {/* Priority Filter */}
          {/*
          <Select value={filters.priority || 'all'} onValueChange={(value) => handleFilterChange('priority', value)}>
            <SelectTrigger>
              <SelectValue placeholder="الأولوية" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الأولويات</SelectItem>
              <SelectItem value="low">منخفضة</SelectItem>
              <SelectItem value="medium">متوسطة</SelectItem>
              <SelectItem value="high">عالية</SelectItem>
              <SelectItem value="urgent">عاجلة</SelectItem>
            </SelectContent>
          </Select>
          */}

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button 
              variant="outline" 
              onClick={clearFilters}
              className="w-full"
            >
              <X className="h-4 w-4 ml-2" />
              مسح الفلاتر
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ComplaintsFilter;
