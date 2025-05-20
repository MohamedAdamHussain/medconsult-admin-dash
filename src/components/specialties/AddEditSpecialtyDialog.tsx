
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Specialty, FAQ } from '@/pages/Specialties';
import { Plus, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface AddEditSpecialtyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  specialty: Specialty | null;
  onSave: (specialty: Specialty) => void;
}

const AddEditSpecialtyDialog = ({
  open,
  onOpenChange,
  specialty,
  onSave
}: AddEditSpecialtyDialogProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [iconName, setIconName] = useState('');
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // اعداد البيانات عند فتح النافذة للتعديل
  useEffect(() => {
    if (specialty) {
      setName(specialty.name);
      setDescription(specialty.description);
      setIconName(specialty.iconName);
      setFaqs(specialty.faqs);
    } else {
      resetForm();
    }
  }, [specialty, open]);

  // إعادة تعيين النموذج
  const resetForm = () => {
    setName('');
    setDescription('');
    setIconName('');
    setFaqs([]);
    setErrors({});
  };

  // التحقق من صحة البيانات
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors.name = 'اسم التخصص مطلوب';
    }
    
    if (!description.trim()) {
      newErrors.description = 'الوصف مطلوب';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // حفظ التخصص
  const handleSave = () => {
    if (!validateForm()) return;
    
    const newSpecialty: Specialty = {
      id: specialty?.id || Math.random().toString(36).substring(2, 11),
      name,
      description,
      iconName: iconName || 'medical-cross',
      doctorsCount: specialty?.doctorsCount || 0,
      faqs
    };
    
    onSave(newSpecialty);
    onOpenChange(false);
  };

  // إضافة سؤال شائع جديد
  const addNewFAQ = () => {
    const newFAQ: FAQ = {
      id: Math.random().toString(36).substring(2, 11),
      question: '',
      answer: ''
    };
    
    setFaqs([...faqs, newFAQ]);
  };

  // تحديث سؤال شائع
  const updateFAQ = (id: string, field: 'question' | 'answer', value: string) => {
    setFaqs(faqs.map(faq => 
      faq.id === id ? { ...faq, [field]: value } : faq
    ));
  };

  // حذف سؤال شائع
  const removeFAQ = (id: string) => {
    setFaqs(faqs.filter(faq => faq.id !== id));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            {specialty ? 'تعديل التخصص الطبي' : 'إضافة تخصص طبي جديد'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">اسم التخصص</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={errors.name ? 'border-destructive' : ''}
            />
            {errors.name && <p className="text-destructive text-sm">{errors.name}</p>}
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">وصف التخصص</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={errors.description ? 'border-destructive' : ''}
            />
            {errors.description && <p className="text-destructive text-sm">{errors.description}</p>}
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="iconName">اسم الأيقونة</Label>
            <Input
              id="iconName"
              value={iconName}
              onChange={(e) => setIconName(e.target.value)}
              placeholder="medical-cross"
            />
            <p className="text-sm text-muted-foreground">
              اسم الأيقونة من مكتبة الأيقونات، مثال: heart, baby, tooth
            </p>
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between items-center">
              <Label>الأسئلة الشائعة</Label>
              <Button type="button" variant="outline" size="sm" onClick={addNewFAQ}>
                <Plus className="h-4 w-4 ml-2" /> إضافة سؤال
              </Button>
            </div>
            
            <div className="space-y-4 mt-4 max-h-[300px] overflow-y-auto p-1">
              {faqs.map((faq, index) => (
                <Card key={faq.id} className="relative">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute left-2 top-2"
                    onClick={() => removeFAQ(faq.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  
                  <CardContent className="pt-6">
                    <div className="grid gap-3">
                      <div className="grid gap-1">
                        <Label htmlFor={`question-${index}`}>السؤال</Label>
                        <Input
                          id={`question-${index}`}
                          value={faq.question}
                          onChange={(e) => updateFAQ(faq.id, 'question', e.target.value)}
                        />
                      </div>
                      
                      <div className="grid gap-1">
                        <Label htmlFor={`answer-${index}`}>الإجابة</Label>
                        <Textarea
                          id={`answer-${index}`}
                          value={faq.answer}
                          onChange={(e) => updateFAQ(faq.id, 'answer', e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {faqs.length === 0 && (
                <p className="text-center text-muted-foreground py-4">
                  لا توجد أسئلة شائعة. أضف سؤالاً باستخدام الزر أعلاه.
                </p>
              )}
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            إلغاء
          </Button>
          <Button onClick={handleSave}>
            {specialty ? 'حفظ التغييرات' : 'إضافة تخصص'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditSpecialtyDialog;
