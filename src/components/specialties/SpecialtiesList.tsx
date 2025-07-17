
import React from 'react';
import { Specialty } from '@/pages/Specialties';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash } from 'lucide-react';

interface SpecialtiesListProps {
  specialties: Specialty[];
  onEdit: (specialty: Specialty) => void;
  onDelete: (id: string) => void;
}

const SpecialtiesList = ({ specialties, onEdit, onDelete }: SpecialtiesListProps) => {
  return (
    <div className="unified-card">
      <div className="overflow-hidden rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>اسم التخصص</TableHead>
              <TableHead>عدد الأطباء</TableHead>
              <TableHead>عدد الأسئلة المرتبطة</TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead className="text-center">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {specialties.map((specialty) => (
              <TableRow key={specialty.id}>
                <TableCell className="font-medium">{specialty.name}</TableCell>
                <TableCell>{specialty.doctorsCount}</TableCell>
                <TableCell>{specialty.questionIds ? specialty.questionIds.length : 0}</TableCell>
                <TableCell>
                  <span className={`status-badge ${specialty.isActive ? 'status-badge-approved' : 'status-badge-rejected'}`}>
                    {specialty.isActive ? 'مفعل' : 'غير مفعل'}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex justify-center gap-2">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => onEdit(specialty)}
                      className="action-button action-button-ghost"
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
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default SpecialtiesList;
