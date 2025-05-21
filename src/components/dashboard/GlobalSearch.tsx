
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Search, User, UserPlus, MessageSquare, AlertTriangle, FileBox } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type SearchResultType = 'doctor' | 'patient' | 'consultation' | 'complaint' | 'application';

interface SearchResult {
  id: number | string;
  type: SearchResultType;
  title: string;
  subtitle: string;
  route?: string;
}

// بيانات عينة للبحث - ستأتي من API في التطبيق الحقيقي
const sampleSearchData: SearchResult[] = [
  { id: 1, type: 'doctor', title: 'د. محمد أحمد', subtitle: 'طبيب قلب', route: '/doctors' },
  { id: 2, type: 'doctor', title: 'د. فاطمة علي', subtitle: 'طبيبة جلدية', route: '/doctors' },
  { id: 3, type: 'patient', title: 'أحمد محمود', subtitle: 'مريض', route: '/patients' },
  { id: 4, type: 'consultation', title: 'استشارة #1245', subtitle: 'د. خالد - قلب', route: '/patients' },
  { id: 5, type: 'complaint', title: 'شكوى #458', subtitle: 'مشكلة تقنية', route: '/complaints' },
  { id: 6, type: 'application', title: 'طلب تسجيل #123', subtitle: 'طبيب أسنان', route: '/doctor-applications' }
];

const getIconForType = (type: SearchResultType) => {
  switch (type) {
    case 'doctor':
      return <User className="h-4 w-4 text-blue-500" />;
    case 'patient':
      return <User className="h-4 w-4 text-green-500" />;
    case 'consultation':
      return <MessageSquare className="h-4 w-4 text-purple-500" />;
    case 'complaint':
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    case 'application':
      return <UserPlus className="h-4 w-4 text-amber-500" />;
    default:
      return <FileBox className="h-4 w-4" />;
  }
};

const getTypeLabel = (type: SearchResultType): string => {
  switch (type) {
    case 'doctor':
      return 'طبيب';
    case 'patient':
      return 'مريض';
    case 'consultation':
      return 'استشارة';
    case 'complaint':
      return 'شكوى';
    case 'application':
      return 'طلب تسجيل';
    default:
      return '';
  }
};

const GlobalSearch = () => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // هنا ستقوم بجلب النتائج من API 
    // في هذا المثال سنستخدم البيانات الثابتة
  };

  const filteredResults = searchQuery 
    ? sampleSearchData.filter(
        item => item.title.includes(searchQuery) || 
                item.subtitle.includes(searchQuery)
      )
    : [];

  const handleSelectResult = (result: SearchResult) => {
    // انتقل إلى الصفحة المناسبة
    if (result.route) {
      navigate(result.route);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex gap-2 items-center px-3">
          <Search className="h-4 w-4" />
          <span>بحث شامل</span>
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium text-muted-foreground">
            <span className="text-xs">Ctrl</span>K
          </kbd>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] p-0">
        <Command className="rounded-lg border shadow-md">
          <CommandInput 
            placeholder="ابحث عن أي شيء..." 
            value={searchQuery}
            onValueChange={handleSearch}
          />
          <CommandList>
            <CommandEmpty className="py-6 text-center text-sm">
              لا توجد نتائج مطابقة
            </CommandEmpty>
            
            {filteredResults.length > 0 && (
              <CommandGroup heading="نتائج البحث">
                {filteredResults.map((result) => (
                  <CommandItem 
                    key={`${result.type}-${result.id}`}
                    onSelect={() => handleSelectResult(result)}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center">
                      {getIconForType(result.type)}
                      <div className="mr-3">
                        <p className="text-sm font-medium">{result.title}</p>
                        <p className="text-xs text-muted-foreground">{result.subtitle}</p>
                      </div>
                    </div>
                    <span className="text-xs bg-slate-100 px-2 py-1 rounded-full">
                      {getTypeLabel(result.type)}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
};

export default GlobalSearch;
