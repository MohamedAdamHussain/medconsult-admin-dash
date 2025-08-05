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


// نوع البيانات للمرحلة الأولى
export interface DoctorRegistrationStep1Data {
  email: string;
  password: string;
  certificate_images: File[];
  medical_tag_id: string;
  start_time: string;
  end_time: string;
}

interface DoctorRegistrationStep1DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: DoctorRegistrationStep1Data) => void;
  isLoading: boolean;
}

const DoctorRegistrationStep1Dialog: React.FC<DoctorRegistrationStep1DialogProps> = ({ 
  open, 
  onOpenChange, 
  onSubmit, 
  isLoading 
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [medicalTags, setMedicalTags] = useState<MedicalTag[]>([]);
  const [isLoadingTags, setIsLoadingTags] = useState(false);
  
  const form = useForm<DoctorRegistrationStep1Data>({
    defaultValues: {
      email: '',
      password: '',
      certificate_images: [],
      medical_tag_id: '',
      start_time: '',
      end_time: '',
    }
  });

  // جلب التخصصات الطبية من API
  useEffect(() => {
    const fetchMedicalTags = async () => {
      setIsLoadingTags(true);
      try {
        const response = await api.get('/admin/medical-tags/');
        if (response.data && response.data.status === 'success') {
          setMedicalTags(response.data.data);
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

  // معالجة اختيار الملفات
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      setSelectedFiles(fileArray);
      form.setValue('certificate_images', fileArray);
    }
  };

  // معالجة إرسال النموذج
  const handleFormSubmit = (data: DoctorRegistrationStep1Data) => {
    // التأكد من إضافة الملفات المحددة
    data.certificate_images = selectedFiles;
    onSubmit(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-right">المرحلة الأولى: تسجيل طبيب جديد</DialogTitle>
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
                        ) : (
                          medicalTags.map((tag) => (
                            <SelectItem key={tag.id} value={tag.id.toString()}>
                              {tag.name}
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
                        accept="image/*,.pdf" 
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
                        "يمكنك اختيار ملفات متعددة (صور أو PDF)"
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
              <Button type="submit" disabled={isLoading || isLoadingTags} className="min-w-[120px]">
                {isLoading ? (
                  <>
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    جاري التسجيل...
                  </>
                ) : (
                  "التالي"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default DoctorRegistrationStep1Dialog;
