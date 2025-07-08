
import React from 'react';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Doctor } from '@/types/doctors';

interface AddDoctorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddDoctor: (doctor: Omit<Doctor, 'id'>) => void;
  specialties: string[];
  cities: string[];
}

const AddDoctorDialog: React.FC<AddDoctorDialogProps> = ({
  open,
  onOpenChange,
  onAddDoctor,
  specialties,
  cities
}) => {
  const form = useForm({
    defaultValues: {
      name: '',
      specialty: '',
      city: '',
      phone: '',
      email: '',
      certificate: '',
      license: '',
      idDocument: '',
      address: '',
      facebook: '',
      twitter: '',
      instagram: '',
      linkedin: '',
    }
  });

  const onSubmit = (data: any) => {
    const newDoctor: Omit<Doctor, 'id'> = {
      name: data.name,
      specialty: data.specialty,
      specialties: [{
        id: '1',
        name: data.specialty,
        consultationPrice: 0,
        experienceYears: 0,
        description: ''
      }],
      rating: 0,
      status: 'active',
      city: data.city,
      joinDate: new Date().toISOString().split('T')[0],
      patients: 0,
      consultations: 0,
      activityPoints: 0,
      age: 30,
      gender: 'male',
      documents: {
        certificates: [data.certificate],
        license: data.license,
        id: data.idDocument,
        syndicate: '',
      },
      contacts: {
        phone: data.phone,
        email: data.email,
      },
      socialMedia: {
        facebook: data.facebook || undefined,
        twitter: data.twitter || undefined,
        instagram: data.instagram || undefined,
        linkedin: data.linkedin || undefined,
      },
      clinicLocation: {
        address: data.address,
      }
    };

    onAddDoctor(newDoctor);
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-right">إضافة طبيب جديد</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* معلومات أساسية */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-right">المعلومات الأساسية</h3>
              
              <FormField
                control={form.control}
                name="name"
                rules={{ required: "الاسم مطلوب" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-right block">اسم الطبيب</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="د. محمد أحمد" className="text-right" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="specialty"
                rules={{ required: "التخصص مطلوب" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-right block">التخصص</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="text-right">
                          <SelectValue placeholder="اختر التخصص" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {specialties.map((specialty) => (
                          <SelectItem key={specialty} value={specialty}>
                            {specialty}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                rules={{ required: "المدينة مطلوبة" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-right block">المدينة</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="text-right">
                          <SelectValue placeholder="اختر المدينة" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* معلومات الاتصال */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-right">معلومات الاتصال</h3>
              
              <FormField
                control={form.control}
                name="phone"
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
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-right block">عنوان العيادة</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="شارع الملك فهد، الرياض" className="text-right" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* الوثائق */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-right">الوثائق المطلوبة</h3>
              
              <FormField
                control={form.control}
                name="certificate"
                rules={{ required: "شهادة التخصص مطلوبة" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-right block">شهادة التخصص</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="شهادة تخصص طب القلب" className="text-right" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="license"
                rules={{ required: "ترخيص المزاولة مطلوب" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-right block">ترخيص مزاولة المهنة</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="ترخيص مزاولة المهنة" className="text-right" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="idDocument"
                rules={{ required: "بطاقة الهوية مطلوبة" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-right block">بطاقة الهوية</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="بطاقة الهوية" className="text-right" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* وسائل التواصل الاجتماعي (اختيارية) */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-right">وسائل التواصل الاجتماعي (اختيارية)</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="facebook"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-right block">فيسبوك</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://facebook.com/..." className="text-right" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="twitter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-right block">تويتر</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://twitter.com/..." className="text-right" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="instagram"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-right block">إنستجرام</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://instagram.com/..." className="text-right" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="linkedin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-right block">لينكد إن</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://linkedin.com/..." className="text-right" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                إلغاء
              </Button>
              <Button type="submit">
                إضافة الطبيب
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddDoctorDialog;
