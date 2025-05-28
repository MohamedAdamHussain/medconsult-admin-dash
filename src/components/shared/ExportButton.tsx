
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Download, FileSpreadsheet, FileText } from 'lucide-react';
import { exportData, ExportOptions } from '@/utils/dataExport';

interface ExportButtonProps {
  data: any[];
  columns: Array<{
    key: string;
    title: string;
    width?: number;
  }>;
  filename: string;
  title: string;
  disabled?: boolean;
}

const ExportButton = ({ data, columns, filename, title, disabled = false }: ExportButtonProps) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format: 'excel' | 'pdf') => {
    if (data.length === 0) {
      return;
    }

    setIsExporting(true);
    
    try {
      const exportOptions: ExportOptions = {
        filename: `${filename}_${new Date().toISOString().split('T')[0]}`,
        title,
        columns,
        data,
        format
      };
      
      exportData(exportOptions);
    } catch (error) {
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          disabled={disabled || isExporting || data.length === 0}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          {isExporting ? 'جاري التصدير...' : 'تصدير'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport('excel')}>
          <FileSpreadsheet className="h-4 w-4 ml-2" />
          تصدير Excel
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('pdf')}>
          <FileText className="h-4 w-4 ml-2" />
          تصدير PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportButton;
