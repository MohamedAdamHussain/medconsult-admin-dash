import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash, Eye } from 'lucide-react';
import { MedicalQuestion } from '@/types/questions';

interface QuestionCardProps {
  question: MedicalQuestion;
  onEdit: (question: MedicalQuestion) => void;
  onDelete: (id: number) => void;
  onView?: (question: MedicalQuestion) => void;
  isDeleting?: boolean;
}

const QuestionCard = ({ question, onEdit, onDelete, onView, isDeleting = false }: QuestionCardProps) => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base line-clamp-2 flex-1">{question.content}</CardTitle>
          <div className="flex gap-1 ml-2">
            {onView && (
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => onView(question)}
                className="h-8 w-8 p-0"
                disabled={isDeleting}
              >
                <Eye className="h-3 w-3" />
              </Button>
            )}
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={() => onEdit(question)}
              className="h-8 w-8 p-0"
              disabled={isDeleting}
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={() => {
                if (confirm('هل أنت متأكد من حذف هذا السؤال؟')) {
                  onDelete(question.id);
                }
              }}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              disabled={isDeleting}
            >
              <Trash className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* معرف السؤال */}
        <div className="flex justify-between text-sm">
          <span className="font-medium text-gray-600">معرف السؤال:</span>
          <span className="font-mono text-blue-600">#{question.id}</span>
        </div>

        {/* التخصص الرئيسي */}
        <div className="flex justify-between text-sm">
          <span className="font-medium text-gray-600">التخصص الرئيسي:</span>
          <span className="font-mono text-purple-600">#{question.specialty_id}</span>
        </div>

        {/* التخصصات المرتبطة */}
        <div>
          <span className="font-medium text-gray-600 text-sm">التخصصات المرتبطة:</span>
          <div className="flex flex-wrap gap-1 mt-1">
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
              <span className="text-gray-500 text-xs">لا توجد تخصصات مرتبطة</span>
            )}
          </div>
        </div>

        {/* السؤال الأب */}
        {question.parent_question_id && (
          <div className="flex justify-between text-sm">
            <span className="font-medium text-gray-600">السؤال الأب:</span>
            <span className="font-mono text-orange-600">#{question.parent_question_id}</span>
          </div>
        )}

        {/* قيمة الإجابة الأب */}
        {question.parent_answer_value && (
          <div>
            <span className="font-medium text-gray-600 text-sm">قيمة الإجابة الأب:</span>
            <div className="mt-1">
              <Badge variant="outline" className="text-xs">
                {question.parent_answer_value}
              </Badge>
            </div>
          </div>
        )}

        {/* حالة النشاط */}
        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-600 text-sm">الحالة:</span>
          <Badge 
            variant={question.isActive === 1 ? "default" : "destructive"}
            className="text-xs"
          >
            {question.isActive === 1 ? 'نشط' : 'غير نشط'}
          </Badge>
        </div>

        {/* تاريخ الإنشاء والتحديث */}
        <div className="pt-2 border-t border-gray-100 space-y-1">
          <div className="flex justify-between text-xs text-gray-500">
            <span>تاريخ الإنشاء:</span>
            <span>{new Date(question.created_at).toLocaleDateString('ar-SA')}</span>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>آخر تحديث:</span>
            <span>{new Date(question.updated_at).toLocaleDateString('ar-SA')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionCard;