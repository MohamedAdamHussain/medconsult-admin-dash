import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// نوع البيانات للمرحلة الثانية
export interface DoctorRegistrationStep2Data {
  fullName: string;
  phoneNumber: string;
  address: string;
  birthday: string;
  gender: string;
  bio: string;
  work_days: string[];
  work_time_in: string;
  work_time_out: string;
  time_for_waiting: string;
  yearOfExper: string;
  consultation_fee: string;
  description: string;
  photoPath: File | null;
  certificate_images: File[];
  photo: File | null;
}

interface DoctorRegistrationStep2DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: DoctorRegistrationStep2Data) => void;
  isLoading: boolean;
}

const DoctorRegistrationStep2Dialog: React.FC<DoctorRegistrationStep2DialogProps> = ({ 
  open, 
  onOpenChange, 
  onSubmit, 
  isLoading 
}) => {
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [certificateFiles, setCertificateFiles] = useState<File[]>([]);
  const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  
  const form = useForm<DoctorRegistrationStep2Data>({
    defaultValues: {
      fullName: '',
      phoneNumber: '',
      address: '',
      birthday: '',
      gender: 'man',
      bio: '',
      work_days: [],
      work_time_in: '',
      work_time_out: '',
      time_for_waiting: '',
      yearOfExper: '',
      consultation_fee: '',
      description: '',
      photoPath: null,
      certificate_images: [],
      photo: null,
    }
  });

  // معالجة اختيار صورة الطبيب
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setPhotoFile(files[0]);
      form.setValue('photoPath', files[0]);
    }
  };

  // معالجة اختيار شهادات التخصص
  const handleCertificatesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      setCertificateFiles(fileArray);
      form.setValue('certificate_images', fileArray);
    }
  };

  // معالجة اختيار صورة الملف الشخصي
  const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setProfilePhotoFile(files[0]);
      form.setValue('photo', files[0]);
    }
  };

  // معالجة اختيار أيام العمل
  const handleDayChange = (day: string, checked: boolean) => {
    let updatedDays = [...selectedDays];
    
    if (checked) {
      updatedDays.push(day);
    } else {
      updatedDays = updatedDays.filter(d => d !== day);
    }
    
    setSelectedDays(updatedDays);
    form.setValue('work_days', updatedDays);
  };

  // معالجة إرسال النموذج
  const handleFormSubmit = (data: DoctorRegistrationStep2Data) => {
    // التأكد من إضافة الملفات المحددة
    data.photoPath = photoFile;
    data.certificate_images = certificateFiles;
    data.photo = profilePhotoFile;
    data.work_days = selectedDays;
    
    onSubmit(data);
  };

  // أيام الأسبوع
  const weekDays = [
    { id: 'sun', label: 'الأحد' },
    { id: 'mon', label: 'الإثنين' },
    { id: 'tue', label: 'الثلاثاء' },
    { id: 'wed', label: 'الأربعاء' },
    { id: 'thu', label: 'الخميس' },
    { id: 'fri', label: 'الجمعة' },
    { id: 'sat', label: 'السبت' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-right">المرحلة الثانية: استكمال بيانات الطبيب</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-right">المعلومات الشخصية</h3>
              
              <FormField
                control={form.control}
                name="fullName"
                rules={{ required: "الاسم الكامل مطلوب" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-right block">الاسم الكامل</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="د. محمد أحمد" className="text-right" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                rules={{ required: "رقم الهاتف مطلوب" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-right block">رقم الهاتف</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="05xxxxxxxx" className="text-right" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                rules={{ required: "العنوان مطلوب" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-right block">العنوان</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="شارع الملك فهد، الرياض" className="text-right" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="birthday"
                  rules={{ required: "تاريخ الميلاد مطلوب" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-right block">تاريخ الميلاد</FormLabel>
                      <FormControl>
                        <Input {...field} type="date" className="text-right" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  rules={{ required: "الجنس مطلوب" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-right block">الجنس</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="text-right">
                            <SelectValue placeholder="اختر الجنس" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="man">ذكر</SelectItem>
                          <SelectItem value="woman">أنثى</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="bio"
                rules={{ required: "السيرة الذاتية مطلوبة" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-right block">السيرة الذاتية</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="نبذة مختصرة عن الطبيب وخبراته" 
                        className="text-right min-h-[100px]" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-right">معلومات العمل</h3>
              
              <div className="space-y-2">
                <FormLabel className="text-right block">أيام العمل</FormLabel>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {weekDays.map((day) => (
                    <div key={day.id} className="flex items-center space-x-2 space-x-reverse">
                      <Checkbox 
                        id={day.id} 
                        checked={selectedDays.includes(day.id)}
                        onCheckedChange={(checked) => handleDayChange(day.id, checked as boolean)}
                      />
                      <label
                        htmlFor={day.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {day.label}
                      </label>
                    </div>
                  ))}
                </div>
                {form.formState.errors.work_days && (
                  <p className="text-sm font-medium text-destructive">
                    {form.formState.errors.work_days.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="work_time_in"
                  rules={{ required: "وقت بدء العمل مطلوب" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-right block">وقت بدء العمل</FormLabel>
                      <FormControl>
                        <Input {...field} type="time" className="text-right" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="work_time_out"
                  rules={{ required: "وقت انتهاء العمل مطلوب" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-right block">وقت انتهاء العمل</FormLabel>
                      <FormControl>
                        <Input {...field} type="time" className="text-right" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="time_for_waiting"
                rules={{ required: "وقت الانتظار مطلوب" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-right block">وقت الانتظار (بالدقائق)</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" placeholder="20" className="text-right" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-right">معلومات التخصص</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="yearOfExper"
                  rules={{ required: "سنوات الخبرة مطلوبة" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-right block">سنوات الخبرة</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" placeholder="5" className="text-right" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="consultation_fee"
                  rules={{ required: "رسوم الاستشارة مطلوبة" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-right block">رسوم الاستشارة</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" placeholder="300" className="text-right" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                rules={{ required: "وصف التخصص مطلوب" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-right block">وصف التخصص</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="وصف مفصل للتخصص والخدمات المقدمة" 
                        className="text-right min-h-[100px]" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-right">الصور والمستندات</h3>
              
              <FormField
                control={form.control}
                name="photoPath"
                rules={{ required: "صورة الطبيب مطلوبة" }}
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel className="text-right block">صورة الطبيب (photoPath)</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="file" 
                        accept="image/*" 
                        onChange={handlePhotoChange}
                        className="text-right"
                      />
                    </FormControl>
                    {photoFile && (
                      <div className="text-xs text-gray-500 text-right">
                        تم اختيار: {photoFile.name}
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="certificate_images"
                rules={{ required: "شهادات التخصص مطلوبة" }}
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel className="text-right block">شهادات التخصص (certificate_images)</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="file" 
                        multiple 
                        accept="image/*,.pdf" 
                        onChange={handleCertificatesChange}
                        className="text-right"
                      />
                    </FormControl>
                    {certificateFiles.length > 0 && (
                      <div className="text-xs text-gray-500 text-right">
                        <ul className="list-disc list-inside">
                          {certificateFiles.map((file, index) => (
                            <li key={index}>{file.name}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="photo"
                rules={{ required: "صورة الملف الشخصي مطلوبة" }}
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel className="text-right block">صورة الملف الشخصي (photo)</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="file" 
                        accept="image/*" 
                        onChange={handleProfilePhotoChange}
                        className="text-right"
                      />
                    </FormControl>
                    {profilePhotoFile && (
                      <div className="text-xs text-gray-500 text-right">
                        تم اختيار: {profilePhotoFile.name}
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                إلغاء
              </Button>
              <Button type="submit" disabled={isLoading} className="min-w-[120px]">
                {isLoading ? (
                  <>
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    جاري التسجيل...
                  </>
                ) : (
                  "تسجيل الطبيب"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default DoctorRegistrationStep2Dialog;