
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Specialty, FAQ } from '@/pages/Specialties';
import { Plus, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

interface AddEditSpecialtyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  specialty: Specialty | null;
  onSave: (specialty: Specialty) => void;
  medicalQuestions: { id: string; question: string }[];
}

const AddEditSpecialtyDialog = ({
  open,
  onOpenChange,
  specialty,
  onSave,
  medicalQuestions
}: AddEditSpecialtyDialogProps) => {
  const [name, setName] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [questionIds, setQuestionIds] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [filterSpecialty, setFilterSpecialty] = useState('all');
  const [search, setSearch] = useState('');

  // اعداد البيانات عند فتح النافذة للتعديل
  useEffect(() => {
    if (specialty) {
      setName(specialty.name);
      setIsActive(specialty.isActive);
      setQuestionIds(specialty.questionIds || []);
    } else {
      resetForm();
    }
  }, [specialty, open]);

  // إعادة تعيين النموذج
  const resetForm = () => {
    setName('');
    setIsActive(true);
    setQuestionIds([]);
    setErrors({});
  };

  // التحقق من صحة البيانات
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors.name = 'اسم التخصص مطلوب';
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
      isActive,
      questionIds,
      doctorsCount: specialty?.doctorsCount || 0,
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
    
    // setFaqs([...faqs, newFAQ]); // This state is removed, so this function is no longer relevant
  };

  // تحديث سؤال شائع
  const updateFAQ = (id: string, field: 'question' | 'answer', value: string) => {
    // setFaqs(faqs.map(faq => 
    //   faq.id === id ? { ...faq, [field]: value } : faq
    // )); // This state is removed, so this function is no longer relevant
  };

  // حذف سؤال شائع
  const removeFAQ = (id: string) => {
    // setFaqs(faqs.filter(faq => faq.id !== id)); // This state is removed, so this function is no longer relevant
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
          {/* Switch isActive */}
          <div className="flex items-center gap-2">
            <Switch checked={isActive} onCheckedChange={setIsActive} id="isActive" />
            <Label htmlFor="isActive" className="select-none cursor-pointer">
              {isActive ? <span className="text-green-600 font-bold">نشط</span> : <span className="text-red-500 font-bold">غير نشط</span>}
            </Label>
          </div>
          {/* البحث عن الأسئلة الطبية بالكلمات */}
          <div className="mb-2">
            <Label>بحث عن سؤال طبي</Label>
            <Input
              type="text"
              placeholder="اكتب كلمة للبحث..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="text-right"
            />
          </div>
          {/* اختيار الأسئلة الطبية */}
          <div className="grid gap-2">
            <Label>الأسئلة الطبية المرتبطة</Label>
            <div className="flex flex-col gap-1 max-h-48 overflow-y-auto border rounded p-2">
              {medicalQuestions.filter(q => !search || q.question.includes(search)).map(q => (
                <label key={q.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={questionIds.includes(q.id)}
                    onChange={e => {
                      if (e.target.checked) {
                        setQuestionIds([...questionIds, q.id]);
                      } else {
                        setQuestionIds(questionIds.filter(id => id !== q.id));
                      }
                    }}
                  />
                  <span>{q.question}</span>
                </label>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {questionIds.map(id => {
                const q = medicalQuestions.find(q => q.id === id);
                return q ? <span key={id} className="bg-gray-100 px-2 py-1 rounded text-sm">{q.question}</span> : null;
              })}
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
