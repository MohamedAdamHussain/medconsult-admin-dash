import React from 'react';
import { MedicalQuestion } from '@/types/questions';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash } from 'lucide-react';

interface QuestionsListProps {
  questions: MedicalQuestion[];
  onEdit: (question: MedicalQuestion) => void;
  onDelete: (id: number) => void;
  isDeleting?: boolean;
}

const QuestionsList = ({ questions, onEdit, onDelete, isDeleting = false }: QuestionsListProps) => {
  return (
    <div className="unified-card">
      <div className="overflow-hidden rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">المحتوى</TableHead>
              <TableHead className="text-right">التخصصات</TableHead>
              <TableHead className="text-right">الحالة</TableHead>
              <TableHead className="text-right">تاريخ الإنشاء</TableHead>
              <TableHead className="text-center">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {questions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  لا توجد أسئلة طبية
                </TableCell>
              </TableRow>
            ) : (
              questions.map((question) => (
                <TableRow key={question.id}>
                  <TableCell className="font-medium max-w-md">
                    <div className="truncate" title={question.content}>
                      {question.content}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {question.medical_tags && question.medical_tags.length > 0 ? (
                        question.medical_tags.map((tag) => (
                          <Badge 
                            key={tag.id} 
                            variant="secondary" 
                            className="text-xs"
                          >
                            {tag.name_ar || tag.name}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-gray-500 text-sm">
                          لا توجد تخصصات
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`status-badge ${question.isActive === 1 ? 'status-badge-approved' : 'status-badge-rejected'}`}>
                      {question.isActive === 1 ? 'نشط' : 'غير نشط'}
                    </span>
                  </TableCell>
                  <TableCell>
                    {question.created_at ? (
                      <span className="text-sm text-gray-600">
                        {new Date(question.created_at).toLocaleDateString('ar-SA')}
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
                        onClick={() => onEdit(question)}
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
                          if (confirm('هل أنت متأكد من حذف هذا السؤال؟')) {
                            onDelete(question.id);
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

export default QuestionsList;