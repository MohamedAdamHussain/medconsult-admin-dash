
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

// Types for export data
export interface ExportColumn {
  key: string;
  title: string;
  width?: number;
}

export interface ExportOptions {
  filename: string;
  title: string;
  columns: ExportColumn[];
  data: any[];
  format: 'excel' | 'pdf';
}

// Excel export function
export const exportToExcel = (options: ExportOptions) => {
  const { filename, title, columns, data } = options;
  
  // Create workbook and worksheet
  const wb = XLSX.utils.book_new();
  
  // Prepare data with headers
  const headers = columns.map(col => col.title);
  const rows = data.map(item => 
    columns.map(col => item[col.key] || '')
  );
  
  const wsData = [headers, ...rows];
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  
  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, title);
  
  // Save file
  XLSX.writeFile(wb, `${filename}.xlsx`);
};

// PDF export function
export const exportToPDF = (options: ExportOptions) => {
  const { filename, title, columns, data } = options;
  
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(16);
  doc.text(title, 20, 20);
  
  // Prepare table data
  const headers = columns.map(col => col.title);
  const rows = data.map(item => 
    columns.map(col => String(item[col.key] || ''))
  );
  
  // Add table
  (doc as any).autoTable({
    head: [headers],
    body: rows,
    startY: 30,
    styles: {
      font: 'helvetica',
      fontSize: 8,
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255
    }
  });
  
  // Save PDF
  doc.save(`${filename}.pdf`);
};

// Main export function
export const exportData = (options: ExportOptions) => {
  if (options.format === 'excel') {
    exportToExcel(options);
  } else if (options.format === 'pdf') {
    exportToPDF(options);
  }
};
