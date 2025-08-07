
import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Upload, X, Image } from 'lucide-react';
import { MedicalTag, CreateMedicalTagRequest, UpdateMedicalTagRequest } from '@/types/specialties';

interface AddEditSpecialtyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  specialty: MedicalTag | null;
  onSave: (data: CreateMedicalTagRequest | { id: number; data: UpdateMedicalTagRequest }) => void;
  isLoading?: boolean;
}

const AddEditSpecialtyDialog = ({
  open,
  onOpenChange,
  specialty,
  onSave,
  isLoading = false
}: AddEditSpecialtyDialogProps) => {
  const [name, setName] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [icon, setIcon] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // اعداد البيانات عند فتح النافذة للتعديل
  useEffect(() => {
    if (specialty) {
      setName(specialty.name);
      setNameAr(specialty.name_ar || '');
      setDescription(specialty.description || '');
      setIsActive(specialty.is_active);
      setIconPreview(specialty.icon || '');
    } else {
      resetForm();
    }
  }, [specialty, open]);

  // إعادة تعيين النموذج
  const resetForm = () => {
    setName('');
    setNameAr('');
    setDescription('');
    setIsActive(true);
    setIcon(null);
    setIconPreview('');
    setErrors({});
  };

  // التحقق من صحة البيانات
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors.name = 'اسم التخصص مطلوب';
    }
    
    if (name.length > 255) {
      newErrors.name = 'اسم التخصص يجب أن يكون أقل من 255 حرف';
    }
    
    if (nameAr && nameAr.length > 255) {
      newErrors.nameAr = 'الاسم العربي يجب أن يكون أقل من 255 حرف';
    }
    
    if (icon && icon.size > 2048 * 1024) {
      newErrors.icon = 'حجم الصورة يجب أن يكون أقل من 2 ميجابايت';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // معالجة رفع الصورة
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // التحقق من نوع الملف
      if (!file.type.startsWith('image/')) {
        setErrors({ ...errors, icon: 'يجب أن يكون الملف صورة' });
        return;
      }
      
      // التحقق من حجم الملف
      if (file.size > 2048 * 1024) {
        setErrors({ ...errors, icon: 'حجم الصورة يجب أن يكون أقل من 2 ميجابايت' });
        return;
      }
      
      setIcon(file);
      
      // إنشاء معاينة للصورة
      const reader = new FileReader();
      reader.onload = (e) => {
        setIconPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      // إزالة خطأ الصورة إن وجد
      if (errors.icon) {
        const newErrors = { ...errors };
        delete newErrors.icon;
        setErrors(newErrors);
      }
    }
  };

  // حذف الصورة
  const removeIcon = () => {
    setIcon(null);
    setIconPreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // حفظ التخصص
  const handleSave = () => {
    if (!validateForm()) return;
    
    if (specialty) {
      // تحديث تخصص موجود
      const updateData: UpdateMedicalTagRequest = {
        name,
        name_ar: nameAr || undefined,
        description: description || undefined,
        is_active: isActive,
      };
      
      if (icon) {
        updateData.icon = icon;
      }
      
      onSave({ id: specialty.id, data: updateData });
    } else {
      // إنشاء تخصص جديد
      const createData: CreateMedicalTagRequest = {
        name,
        name_ar: nameAr || undefined,
        description: description || undefined,
        is_active: isActive,
      };
      
      if (icon) {
        createData.icon = icon;
      }
      
      onSave(createData);
    }
    
    onOpenChange(false);
  };



  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            {specialty ? 'تعديل التخصص الطبي' : 'إضافة تخصص طبي جديد'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {/* اسم التخصص */}
          <div className="grid gap-2">
            <Label htmlFor="name">اسم التخصص *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={errors.name ? 'border-destructive' : ''}
              placeholder="أدخل اسم التخصص"
              maxLength={255}
            />
            {errors.name && <p className="text-destructive text-sm">{errors.name}</p>}
          </div>

          {/* الاسم العربي */}
          <div className="grid gap-2">
            <Label htmlFor="nameAr">الاسم العربي</Label>
            <Input
              id="nameAr"
              value={nameAr}
              onChange={(e) => setNameAr(e.target.value)}
              className={errors.nameAr ? 'border-destructive' : ''}
              placeholder="أدخل الاسم العربي (اختياري)"
              maxLength={255}
            />
            {errors.nameAr && <p className="text-destructive text-sm">{errors.nameAr}</p>}
          </div>

          {/* الوصف */}
          <div className="grid gap-2">
            <Label htmlFor="description">الوصف</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="أدخل وصف التخصص (اختياري)"
              rows={3}
            />
          </div>

          {/* رفع الصورة */}
          <div className="grid gap-2">
            <Label>أيقونة التخصص</Label>
            <div className="flex flex-col gap-2">
              {iconPreview && (
                <div className="relative w-20 h-20 border rounded-lg overflow-hidden">
                  <img 
                    src={iconPreview} 
                    alt="معاينة الأيقونة" 
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeIcon}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
              
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2"
                >
                  <Upload size={16} />
                  {iconPreview ? 'تغيير الصورة' : 'رفع صورة'}
                </Button>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
              
              <p className="text-sm text-gray-500">
                الحد الأقصى: 2 ميجابايت. الصيغ المدعومة: JPG, PNG, GIF
              </p>
              
              {errors.icon && <p className="text-destructive text-sm">{errors.icon}</p>}
            </div>
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
            disabled={isLoading}
          >
            {isLoading ? (
              'جاري الحفظ...'
            ) : (
              specialty ? 'حفظ التغييرات' : 'إضافة تخصص'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditSpecialtyDialog;
