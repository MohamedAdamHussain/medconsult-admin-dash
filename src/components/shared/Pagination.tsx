import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage
}) => {
  // حساب نطاق الصفحات المعروضة
  const getPageRange = () => {
    const range = [];
    const maxVisiblePages = 5; // عدد الصفحات المرئية في وقت واحد
    
    let start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let end = Math.min(totalPages, start + maxVisiblePages - 1);
    
    // ضبط البداية إذا كانت النهاية قريبة من إجمالي الصفحات
    if (end === totalPages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }
    
    for (let i = start; i <= end; i++) {
      range.push(i);
    }
    
    return range;
  };

  // حساب نطاق العناصر المعروضة حاليًا
  const getItemsRange = () => {
    if (!totalItems || !itemsPerPage) return null;
    
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, totalItems);
    
    return { start, end };
  };

  const itemsRange = getItemsRange();
  const pageRange = getPageRange();

  return (
    <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-4">
      {/* معلومات العناصر */}
      {itemsRange && (
        <div className="text-sm text-muted-foreground">
          عرض {itemsRange.start} إلى {itemsRange.end} من أصل {totalItems} عنصر
        </div>
      )}
      
      {/* أزرار التنقل */}
      <div className="flex items-center gap-1">
        {/* زر الصفحة السابقة */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="h-8 w-8"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        
        {/* زر الصفحة الأولى */}
        {pageRange[0] > 1 && (
          <>
            <Button
              variant={currentPage === 1 ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(1)}
              className="h-8 w-8"
            >
              1
            </Button>
            {pageRange[0] > 2 && (
              <span className="mx-1 text-muted-foreground">...</span>
            )}
          </>
        )}
        
        {/* أزرار الصفحات */}
        {pageRange.map(page => (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(page)}
            className="h-8 w-8"
          >
            {page}
          </Button>
        ))}
        
        {/* زر الصفحة الأخيرة */}
        {pageRange[pageRange.length - 1] < totalPages && (
          <>
            {pageRange[pageRange.length - 1] < totalPages - 1 && (
              <span className="mx-1 text-muted-foreground">...</span>
            )}
            <Button
              variant={currentPage === totalPages ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(totalPages)}
              className="h-8 w-8"
            >
              {totalPages}
            </Button>
          </>
        )}
        
        {/* زر الصفحة التالية */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;