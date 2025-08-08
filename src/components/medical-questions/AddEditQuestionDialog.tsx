import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { MedicalQuestion, CreateMedicalQuestionRequest, UpdateMedicalQuestionRequest } from '@/types/questions';
import { MedicalTag } from '@/types/specialties';

interface AddEditQuestionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  question?: MedicalQuestion | null;
  onSave: (data: CreateMedicalQuestionRequest | { id: number; data: UpdateMedicalQuestionRequest }) => void;
  specialties: MedicalTag[];
  isLoading?: boolean;
}

const AddEditQuestionDialog = ({
  open,
  onOpenChange,
  question,
  onSave,
  specialties,
  isLoading = false
}: AddEditQuestionDialogProps) => {
  const [content, setContent] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [selectedSpecialtyIds, setSelectedSpecialtyIds] = useState<number[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // إعداد البيانات عند فتح النافذة للتعديل
  useEffect(() => {
    if (question) {
      setContent(question.content);
      setIsActive(question.isActive === 1);
      // استخراج معرفات التخصصات من medical_tags
      const tagIds = question.medical_tags?.map(tag => tag.id) || [];
      setSelectedSpecialtyIds(tagIds);
    } else {
      resetForm();
    }
  }, [question, open]);

  // إعادة تعيين النموذج
  const resetForm = () => {
    setContent('');
    setIsActive(true);
    setSelectedSpecialtyIds([]);
    setErrors({});
  };

  // التحقق من صحة البيانات
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!content.trim()) {
      newErrors.content = 'محتوى السؤال مطلوب';
    }
    
    if (content.length > 1000) {
      newErrors.content = 'محتوى السؤال يجب أن يكون أقل من 1000 حرف';
    }
    
    if (selectedSpecialtyIds.length === 0) {
      newErrors.specialties = 'يجب اختيار تخصص واحد على الأقل';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // معالجة تغيير اختيار التخصصات
  const handleSpecialtyChange = (specialtyId: number, checked: boolean) => {
    if (checked) {
      setSelectedSpecialtyIds([...selectedSpecialtyIds, specialtyId]);
    } else {
      setSelectedSpecialtyIds(selectedSpecialtyIds.filter(id => id !== specialtyId));
    }
    
    // إزالة خطأ التخصصات إن وجد
    if (errors.specialties) {
      const newErrors = { ...errors };
      delete newErrors.specialties;
      setErrors(newErrors);
    }
  };

  // حفظ السؤال
  const handleSave = () => {
    if (!validateForm()) return;
    
    if (question) {
      // تحديث سؤال موجود
      const updateData: UpdateMedicalQuestionRequest = {
        content,
        isActive,
        specialty_ids: selectedSpecialtyIds,
      };
      
      onSave({ id: question.id, data: updateData });
    } else {
      // إنشاء سؤال جديد
      const createData: CreateMedicalQuestionRequest = {
        content,
        isActive,
        specialty_ids: selectedSpecialtyIds,
      };
      
      onSave(createData);
    }
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            {question ? 'تعديل السؤال الطبي' : 'إضافة سؤال طبي جديد'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {/* محتوى السؤال */}
          <div className="grid gap-2">
            <Label htmlFor="content">محتوى السؤال *</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className={errors.content ? 'border-destructive' : ''}
              placeholder="أدخل نص السؤال الطبي"
              rows={4}
              maxLength={1000}
            />
            <div className="flex justify-between text-sm text-gray-500">
              {errors.content && <span className="text-destructive">{errors.content}</span>}
              <span className="mr-auto">{content.length}/1000</span>
            </div>
          </div>

          {/* اختيار التخصصات */}
          <div className="grid gap-2">
            <Label>التخصصات المرتبطة *</Label>
            <div className="border rounded-lg p-4 max-h-48 overflow-y-auto">
              {specialties.length === 0 ? (
                <p className="text-gray-500 text-center">لا توجد تخصصات متاحة</p>
              ) : (
                <div className="grid gap-2">
                  {specialties.map((specialty) => (
                    <div key={specialty.id} className="flex items-center space-x-2 space-x-reverse">
                      <Checkbox
                        id={`specialty-${specialty.id}`}
                        checked={selectedSpecialtyIds.includes(specialty.id)}
                        onCheckedChange={(checked) => 
                          handleSpecialtyChange(specialty.id, checked as boolean)
                        }
                      />
                      <Label 
                        htmlFor={`specialty-${specialty.id}`}
                        className="text-sm font-normal cursor-pointer flex-1"
                      >
                        {specialty.name}
                        {specialty.name_ar && (
                          <span className="text-gray-500 mr-2">({specialty.name_ar})</span>
                        )}
                      </Label>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {errors.specialties && (
              <p className="text-destructive text-sm">{errors.specialties}</p>
            )}
            
            {/* عرض التخصصات المختارة */}
            {selectedSpecialtyIds.length > 0 && (
              <div className="mt-2">
                <p className="text-sm font-medium mb-2">التخصصات المختارة:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedSpecialtyIds.map(id => {
                    const specialty = specialties.find(s => s.id === id);
                    return specialty ? (
                      <span 
                        key={id} 
                        className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm"
                      >
                        {specialty.name}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            )}
          </div>

          {/* حالة النشاط */}
          <div className="flex items-center gap-2">
            <Switch checked={isActive} onCheckedChange={setIsActive} id="isActive" />
            <Label htmlFor="isActive" className="select-none cursor-pointer">
              {isActive ? (
                <span className="text-green-600 font-bold">نشط</span>
              ) : (
                <span className="text-red-500 font-bold">غير نشط</span>
              )}
            </Label>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            إلغاء
          </Button>
          <Button 
            onClick={handleSave}
            disabled={isLoading || selectedSpecialtyIds.length === 0}
          >
            {isLoading ? (
              'جاري الحفظ...'
            ) : (
              question ? 'حفظ التغييرات' : 'إضافة السؤال'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditQuestionDialog;