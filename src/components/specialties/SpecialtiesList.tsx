
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
            <TableHead className="text-right">الوصف</TableHead>
            <TableHead className="text-right">عدد الأطباء</TableHead>
            <TableHead className="text-right">الأسئلة الشائعة</TableHead>
            <TableHead className="text-center">الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {specialties.map((specialty) => (
            <TableRow key={specialty.id}>
              <TableCell className="font-medium">{specialty.name}</TableCell>
              <TableCell className="max-w-xs truncate">{specialty.description}</TableCell>
              <TableCell>{specialty.doctorsCount}</TableCell>
              <TableCell>{specialty.faqs.length}</TableCell>
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

      <h2 className="text-xl font-bold mt-8 mb-4">الأسئلة الشائعة حسب التخصص</h2>
      
      <Accordion type="single" collapsible className="w-full">
        {specialties.map((specialty) => (
          <AccordionItem key={specialty.id} value={specialty.id}>
            <AccordionTrigger className="text-lg font-medium">
              {specialty.name} <span className="text-sm text-muted-foreground mr-2">({specialty.faqs.length} سؤال)</span>
            </AccordionTrigger>
            <AccordionContent>
              {specialty.faqs.length > 0 ? (
                <div className="space-y-4">
                  {specialty.faqs.map((faq) => (
                    <div key={faq.id} className="border rounded-md p-4">
                      <h3 className="text-md font-semibold flex items-center">
                        <ChevronRight className="h-4 w-4 ml-2" />
                        {faq.question}
                      </h3>
                      <p className="text-muted-foreground mt-2 pr-6">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">لا توجد أسئلة شائعة لهذا التخصص.</p>
              )}
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-4"
                onClick={() => onEdit(specialty)}
              >
                تعديل الأسئلة الشائعة
              </Button>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default SpecialtiesList;
