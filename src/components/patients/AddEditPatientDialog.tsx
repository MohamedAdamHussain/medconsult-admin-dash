import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Upload, X } from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Patient, CreatePatientRequest, UpdatePatientRequest } from '@/types/patients';

interface AddEditPatientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patient?: Patient | null;
  onSave: (data: CreatePatientRequest | { id: number; data: UpdatePatientRequest }) => void;
  isLoading?: boolean;
}

const AddEditPatientDialog = ({
  open,
  onOpenChange,
  patient,
  onSave,
  isLoading = false
}: AddEditPatientDialogProps) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [birthday, setBirthday] = useState<Date | undefined>(undefined);
  const [gender, setGender] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // إعداد البيانات عند فتح النافذة للتعديل
  useEffect(() => {
    if (patient) {
      setFullName(patient.fullName || patient.name || '');
      setEmail(patient.email);
      setPassword(''); // لا نعرض كلمة المرور الحالية
      setPhoneNumber(patient.phoneNumber || patient.phone || '');
      setAddress(patient.address || '');
      setGender(patient.gender || '');
      
      if (patient.birthday) {
        setBirthday(new Date(patient.birthday));
      }
      
      if (patient.photo || patient.profileImage) {
        setPhotoPreview(patient.photo || patient.profileImage || null);
      }
    } else {
      resetForm();
    }
  }, [patient, open]);

  // إعادة تعيين النموذج
  const resetForm = () => {
    setFullName('');
    setEmail('');
    setPassword('');
    setPhoneNumber('');
    setAddress('');
    setBirthday(undefined);
    setGender('');
    setPhoto(null);
    setPhotoPreview(null);
    setErrors({});
  };

  // التحقق من صحة البيانات
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!fullName.trim()) {
      newErrors.fullName = 'الاسم الكامل مطلوب';
    }
    
    if (!email.trim()) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'البريد الإلكتروني غير صحيح';
    }
    
    if (!patient && !password.trim()) {
      newErrors.password = 'كلمة المرور مطلوبة';
    } else if (!patient && password.length < 8) {
      newErrors.password = 'كلمة المرور يجب أن تكون 8 أحرف على الأقل';
    }
    
    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = 'رقم الهاتف مطلوب';
    }
    
    if (!address.trim()) {
      newErrors.address = 'العنوان مطلوب';
    }
    
    if (!birthday) {
      newErrors.birthday = 'تاريخ الميلاد مطلوب';
    }
    
    if (!gender) {
      newErrors.gender = 'الجنس مطلوب';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // معالجة تغيير الصورة
  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // التحقق من نوع الملف
      if (!file.type.startsWith('image/')) {
        setErrors({ ...errors, photo: 'يجب أن يكون الملف صورة' });
        return;
      }
      
      // التحقق من حجم الملف (2MB)
      if (file.size > 2 * 1024 * 1024) {
        setErrors({ ...errors, photo: 'حجم الصورة يجب أن يكون أقل من 2 ميجابايت' });
        return;
      }
      
      setPhoto(file);
      
      // إنشاء معاينة للصورة
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      // إزالة خطأ الصورة إن وجد
      const newErrors = { ...errors };
      delete newErrors.photo;
      setErrors(newErrors);
    }
  };

  // إزالة الصورة
  const removePhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
  };

  // حفظ المريض
  const handleSave = () => {
    if (!validateForm()) return;
    
    if (patient) {
      // تحديث مريض موجود
      const updateData: UpdatePatientRequest = {
        fullName,
        email,
        phoneNumber,
        address,
        birthday: birthday ? format(birthday, 'yyyy-MM-dd') : undefined,
        gender,
      };
      
      if (photo) {
        updateData.photo = photo;
      }
      
      onSave({ id: patient.id as number, data: updateData });
    } else {
      // تسجيل مريض جديد
      const createData: CreatePatientRequest = {
        fullName,
        email,
        password,
        phoneNumber,
        address,
        birthday: format(birthday!, 'yyyy-MM-dd'),
        gender,
      };
      
      if (photo) {
        createData.photo = photo;
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
            {patient ? 'تعديل بيانات المريض' : 'تسجيل مريض جديد'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {/* الصورة الشخصية */}
          <div className="grid gap-2">
            <Label>الصورة الشخصية</Label>
            <div className="flex items-center gap-4">
              {photoPreview ? (
                <div className="relative">
                  <img 
                    src={photoPreview} 
                    alt="معاينة الصورة" 
                    className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                    onClick={removePhoto}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
                  <Upload className="h-8 w-8 text-gray-400" />
                </div>
              )}
              
              <div className="flex-1">
                <Input
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
                  onChange={handlePhotoChange}
                  className="cursor-pointer"
                />
                <p className="text-xs text-gray-500 mt-1">
                  اختر صورة (JPEG, PNG, JPG - حد أقصى 2MB)
                </p>
              </div>
            </div>
            {errors.photo && <p className="text-destructive text-sm">{errors.photo}</p>}
          </div>

          {/* الاسم الكامل */}
          <div className="grid gap-2">
            <Label htmlFor="fullName">الاسم الكامل *</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={errors.fullName ? 'border-destructive' : ''}
              placeholder="أدخل الاسم الكامل"
            />
            {errors.fullName && <p className="text-destructive text-sm">{errors.fullName}</p>}
          </div>

          {/* البريد الإلكتروني */}
          <div className="grid gap-2">
            <Label htmlFor="email">البريد الإلكتروني *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={errors.email ? 'border-destructive' : ''}
              placeholder="أدخل البريد الإلكتروني"
            />
            {errors.email && <p className="text-destructive text-sm">{errors.email}</p>}
          </div>

          {/* كلمة المرور (للتسجيل الجديد فقط) */}
          {!patient && (
            <div className="grid gap-2">
              <Label htmlFor="password">كلمة المرور *</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={errors.password ? 'border-destructive' : ''}
                placeholder="أدخل كلمة المرور (8 أحرف على الأقل)"
                minLength={8}
              />
              {errors.password && <p className="text-destructive text-sm">{errors.password}</p>}
            </div>
          )}

          {/* رقم الهاتف */}
          <div className="grid gap-2">
            <Label htmlFor="phoneNumber">رقم الهاتف *</Label>
            <Input
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className={errors.phoneNumber ? 'border-destructive' : ''}
              placeholder="أدخل رقم الهاتف"
            />
            {errors.phoneNumber && <p className="text-destructive text-sm">{errors.phoneNumber}</p>}
          </div>

          {/* العنوان */}
          <div className="grid gap-2">
            <Label htmlFor="address">العنوان *</Label>
            <Textarea
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={errors.address ? 'border-destructive' : ''}
              placeholder="أدخل العنوان"
              rows={3}
            />
            {errors.address && <p className="text-destructive text-sm">{errors.address}</p>}
          </div>

          {/* تاريخ الميلاد */}
          <div className="grid gap-2">
            <Label>تاريخ الميلاد *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal",
                    !birthday && "text-muted-foreground",
                    errors.birthday && "border-destructive"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {birthday ? format(birthday, 'PPP', { locale: ar }) : 'اختر تاريخ الميلاد'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={birthday}
                  onSelect={setBirthday}
                  disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.birthday && <p className="text-destructive text-sm">{errors.birthday}</p>}
          </div>

          {/* الجنس */}
          <div className="grid gap-2">
            <Label>الجنس *</Label>
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger className={errors.gender ? 'border-destructive' : ''}>
                <SelectValue placeholder="اختر الجنس" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">ذكر</SelectItem>
                <SelectItem value="female">أنثى</SelectItem>
              </SelectContent>
            </Select>
            {errors.gender && <p className="text-destructive text-sm">{errors.gender}</p>}
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
              patient ? 'حفظ التغييرات' : 'تسجيل المريض'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditPatientDialog;