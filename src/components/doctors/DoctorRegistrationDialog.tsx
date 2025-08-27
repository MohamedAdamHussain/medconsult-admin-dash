import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import api from '@/lib/api';
import { toast } from '@/hooks/use-toast';

// نوع البيانات للتخصص الطبي
interface MedicalTag {
  id: number;
  name: string;
  name_ar: string | null;
  description: string | null;
  icon: string | null;
  is_active: boolean;
}

// نوع البيانات لتسجيل الطبيب
export interface DoctorRegistrationData {
  email: string;
  password: string;
  certificate_images: File[];
  medical_tag_id: string;
  start_time: string;
  end_time: string;
  yearOfExper: string;
}

interface DoctorRegistrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: DoctorRegistrationData) => void;
  isLoading: boolean;
}

const DoctorRegistrationDialog: React.FC<DoctorRegistrationDialogProps> = ({ 
  open, 
  onOpenChange, 
  onSubmit, 
  isLoading 
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [medicalTags, setMedicalTags] = useState<MedicalTag[]>([]);
  const [isLoadingTags, setIsLoadingTags] = useState(false);
  
  const form = useForm<DoctorRegistrationData>({
    defaultValues: {
      email: '',
      password: '',
      certificate_images: [],
      medical_tag_id: '',
      start_time: '',
      end_time: '',
      yearOfExper: '',
    }
  });

  // جلب التخصصات الطبية من API
  useEffect(() => {
    const fetchMedicalTags = async () => {
      setIsLoadingTags(true);
      try {
        const response = await api.get('/admin/medical-tags/');
        if (response.data && response.data.status === 'success') {
          if (Array.isArray(response.data.data) && response.data.data.length > 0) {
            setMedicalTags(response.data.data);
          } else {
            // في حالة عدم وجود تخصصات
            setMedicalTags([]);
            toast({
              title: "لا توجد تخصصات طبية",
              description: "لم يتم العثور على أي تخصصات طبية. يرجى إضافة تخصصات أولاً.",
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "خطأ في جلب التخصصات",
            description: "تعذر جلب قائمة التخصصات الطبية",
            variant: "destructive",
          });
        }
      } catch (error: any) {
        toast({
          title: "خطأ في جلب التخصصات",
          description: error.response?.data?.message || "حدث خطأ أثناء جلب التخصصات الطبية",
          variant: "destructive",
        });
        console.error("Error fetching medical tags:", error);
      } finally {
        setIsLoadingTags(false);
      }
    };

    if (open) {
      fetchMedicalTags();
    }
  }, [open]);

  // التحقق من نوع وحجم الملف
  const validateFile = (file: File): boolean => {
    // التحقق من نوع الملف
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "نوع ملف غير صالح",
        description: "يجب أن تكون الصور بتنسيق JPEG أو PNG أو JPG فقط",
        variant: "destructive",
      });
      return false;
    }
    
    // التحقق من حجم الملف (الحد الأقصى 2 ميجابايت = 2048 كيلوبايت = 2097152 بايت)
    if (file.size > 2097152) {
      toast({
        title: "حجم الملف كبير جدًا",
        description: "يجب أن يكون حجم الصورة أقل من 2 ميجابايت",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };

  // معالجة اختيار الملفات
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      
      // التحقق من جميع الملفات
      const validFiles = fileArray.filter(file => validateFile(file));
      
      if (validFiles.length !== fileArray.length) {
        // إذا كان هناك ملفات غير صالحة، أعد تعيين حقل الإدخال
        e.target.value = '';
        return;
      }
      
      setSelectedFiles(validFiles);
      form.setValue('certificate_images', validFiles);
    }
  };

  // معالجة إرسال النموذج
  const handleFormSubmit = (data: DoctorRegistrationData) => {
    // التأكد من إضافة الملفات المحددة
    data.certificate_images = selectedFiles;
    
    // التحقق من أن وقت الانتهاء بعد وقت البدء
    const startTime = new Date(data.start_time);
    const endTime = new Date(data.end_time);
    
    if (endTime <= startTime) {
      toast({
        title: "خطأ في الوقت",
        description: "يجب أن يكون وقت الانتهاء بعد وقت البدء",
        variant: "destructive",
      });
      return;
    }
    
    onSubmit(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-right">تسجيل طبيب جديد</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                rules={{ 
                  required: "البريد الإلكتروني مطلوب",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "البريد الإلكتروني غير صحيح"
                  }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-right block">البريد الإلكتروني</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" placeholder="doctor@example.com" className="text-right" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                rules={{ 
                  required: "كلمة المرور مطلوبة",
                  minLength: {
                    value: 8,
                    message: "كلمة المرور يجب أن تكون على الأقل 8 أحرف"
                  }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-right block">كلمة المرور</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" placeholder="********" className="text-right" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="medical_tag_id"
                rules={{ required: "التخصص الطبي مطلوب" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-right block">التخصص الطبي</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="text-right">
                          <SelectValue placeholder={isLoadingTags ? "جاري تحميل التخصصات..." : "اختر التخصص الطبي"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {isLoadingTags ? (
                          <div className="flex items-center justify-center p-2">
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            <span>جاري التحميل...</span>
                          </div>
                        ) : medicalTags.length === 0 ? (
                          <div className="flex items-center justify-center p-2 text-amber-600">
                            <span>لا توجد تخصصات طبية متاحة</span>
                          </div>
                        ) : (
                          medicalTags.map((tag) => (
                            <SelectItem key={tag.id} value={tag.id.toString()}>
                              {tag.name_ar || tag.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="start_time"
                  rules={{ required: "وقت البدء مطلوب" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-right block">وقت بدء الدوام</FormLabel>
                      <FormControl>
                        <Input {...field} type="datetime-local" className="text-right" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="end_time"
                  rules={{ required: "وقت الانتهاء مطلوب" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-right block">وقت انتهاء الدوام</FormLabel>
                      <FormControl>
                        <Input {...field} type="datetime-local" className="text-right" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="yearOfExper"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-right block">سنوات الخبرة (اختياري)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="5 سنوات" className="text-right" />
                    </FormControl>
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
                    <FormLabel className="text-right block">شهادات التخصص</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="file" 
                        multiple 
                        accept="image/jpeg,image/png,image/jpg" 
                        onChange={handleFileChange}
                        className="text-right"
                      />
                    </FormControl>
                    <div className="text-xs text-gray-500 text-right">
                      {selectedFiles.length > 0 ? (
                        <ul className="list-disc list-inside">
                          {selectedFiles.map((file, index) => (
                            <li key={index}>{file.name}</li>
                          ))}
                        </ul>
                      ) : (
                        "يمكنك اختيار ملفات متعددة (صور JPEG, PNG, JPG فقط، الحد الأقصى 2 ميجابايت لكل صورة)"
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                إلغاء
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading || isLoadingTags || medicalTags.length === 0} 
                className="min-w-[120px]"
                title={medicalTags.length === 0 ? "لا يمكن تسجيل طبيب بدون تخصصات طبية" : ""}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    جاري التسجيل...
                  </>
                ) : medicalTags.length === 0 ? (
                  "لا توجد تخصصات"
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

export default DoctorRegistrationDialog;