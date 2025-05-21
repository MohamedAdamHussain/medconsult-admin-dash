
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Search, Filter } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export type FilterOption = {
  type: 'specialty' | 'status' | 'city';
  value: string;
}

interface SearchAndFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filters: FilterOption[];
  onAddFilter: (type: 'specialty' | 'status' | 'city', value: string) => void;
  onRemoveFilter: (type: 'specialty' | 'status' | 'city') => void;
  onClearFilters: () => void;
  specialties: string[];
  cities: string[];
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  searchQuery,
  onSearchChange,
  filters,
  onAddFilter,
  onRemoveFilter,
  onClearFilters,
  specialties,
  cities
}) => {
  return (
    <>
      {/* شريط البحث والفلترة */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 items-end">
        <div className="flex-1 relative">
          <Label htmlFor="search" className="block mb-2 text-right">بحث</Label>
          <div className="relative">
            <Input
              id="search"
              placeholder="ابحث بالاسم، التخصص، أو المدينة"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 text-right"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>
        </div>
        
        {/* قائمة الفلاتر */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter size={18} />
              <span>فلترة</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="p-2">
              <p className="text-sm font-medium mb-2">التخصص</p>
              {specialties.map((specialty) => (
                <DropdownMenuItem key={specialty} onClick={() => onAddFilter('specialty', specialty)}>
                  {specialty}
                </DropdownMenuItem>
              ))}
              
              <p className="text-sm font-medium mb-2 mt-4">المدينة</p>
              {cities.map((city) => (
                <DropdownMenuItem key={city} onClick={() => onAddFilter('city', city)}>
                  {city}
                </DropdownMenuItem>
              ))}
              
              <p className="text-sm font-medium mb-2 mt-4">الحالة</p>
              <DropdownMenuItem onClick={() => onAddFilter('status', 'active')}>
                مفعل
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAddFilter('status', 'inactive')}>
                موقوف
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* عرض الفلاتر النشطة */}
      {filters.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4 justify-end">
          {filters.map((filter) => (
            <div 
              key={`${filter.type}-${filter.value}`} 
              className="bg-gray-100 rounded-full px-3 py-1 text-sm flex items-center gap-1"
            >
              <span>
                {filter.type === 'specialty' && 'التخصص: '}
                {filter.type === 'status' && 'الحالة: '}
                {filter.type === 'city' && 'المدينة: '}
                {filter.value === 'active' ? 'مفعل' : 
                 filter.value === 'inactive' ? 'موقوف' : filter.value}
              </span>
              <button 
                onClick={() => onRemoveFilter(filter.type)} 
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
          ))}
          <button 
            onClick={onClearFilters}
            className="text-blue-500 text-sm hover:underline"
          >
            مسح الكل
          </button>
        </div>
      )}
    </>
  );
};

export default SearchAndFilter;
