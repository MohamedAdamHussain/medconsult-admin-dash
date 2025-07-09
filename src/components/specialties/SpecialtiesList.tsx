
import React from 'react';
import { Specialty } from '@/pages/Specialties';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash, ChevronRight } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface SpecialtiesListProps {
  specialties: Specialty[];
  onEdit: (specialty: Specialty) => void;
  onDelete: (id: string) => void;
}

const SpecialtiesList = ({ specialties, onEdit, onDelete }: SpecialtiesListProps) => {
  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-right">اسم التخصص</TableHead>
            {/* حذف عمود الوصف */}
            <TableHead className="text-right">عدد الأطباء</TableHead>
            <TableHead className="text-right">عدد الأسئلة المرتبطة</TableHead>
            <TableHead className="text-right">الحالة</TableHead>
            <TableHead className="text-center">الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {specialties.map((specialty) => (
            <TableRow key={specialty.id}>
              <TableCell className="font-medium">{specialty.name}</TableCell>
              {/* حذف حقل الوصف */}
              <TableCell>{specialty.doctorsCount}</TableCell>
              <TableCell>{specialty.questionIds ? specialty.questionIds.length : 0}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${specialty.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {specialty.isActive ? 'مفعل' : 'غير مفعل'}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex justify-center gap-2">
                  <Button size="sm" variant="ghost" onClick={() => onEdit(specialty)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="text-destructive" 
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
  );
};

export default SpecialtiesList;
