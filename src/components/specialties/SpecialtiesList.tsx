
import React from 'react';
import { MedicalTag } from '@/types/specialties';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash, Image } from 'lucide-react';

interface SpecialtiesListProps {
  specialties: MedicalTag[];
  onEdit: (specialty: MedicalTag) => void;
  onDelete: (id: number) => void;
  isDeleting?: boolean;
}

const SpecialtiesList = ({ specialties, onEdit, onDelete, isDeleting = false }: SpecialtiesListProps) => {
  return (
    <div className="unified-card">
      <div className="overflow-hidden rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>الأيقونة</TableHead>
              <TableHead>اسم التخصص</TableHead>
              <TableHead>الاسم العربي</TableHead>
              <TableHead>الوصف</TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead>تاريخ الإنشاء</TableHead>
              <TableHead className="text-center">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {specialties.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  لا توجد تخصصات طبية
                </TableCell>
              </TableRow>
            ) : (
              specialties.map((specialty) => (
                <TableRow key={specialty.id}>
                  <TableCell>
                    {specialty.icon ? (
                      <img 
                        src={specialty.icon} 
                        alt={specialty.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <Image className="w-4 h-4 text-gray-400" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{specialty.name}</TableCell>
                  <TableCell>{specialty.name_ar || '-'}</TableCell>
                  <TableCell>
                    {specialty.description ? (
                      <span className="text-sm text-gray-600 max-w-xs truncate block">
                        {specialty.description}
                      </span>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell>
                    <span className={`status-badge ${specialty.is_active ? 'status-badge-approved' : 'status-badge-rejected'}`}>
                      {specialty.is_active ? 'مفعل' : 'غير مفعل'}
                    </span>
                  </TableCell>
                  <TableCell>
                    {specialty.created_at ? (
                      <span className="text-sm text-gray-600">
                        {new Date(specialty.created_at).toLocaleDateString('ar-SA')}
                      </span>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-2">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => onEdit(specialty)}
                        className="action-button action-button-ghost"
                        disabled={isDeleting}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="action-button action-button-ghost text-destructive hover:text-destructive" 
                        onClick={() => {
                          if (confirm('هل أنت متأكد من حذف هذا التخصص؟')) {
                            onDelete(specialty.id);
                          }
                        }}
                        disabled={isDeleting}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default SpecialtiesList;
