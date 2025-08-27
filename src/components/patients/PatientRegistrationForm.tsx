import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Upload, User, Lock, Heart, Camera } from 'lucide-react';
import { usePatientRegistration, PatientRegistrationRequest } from '@/hooks/usePatientRegistration';

// مخطط التحقق من صحة البيانات
const patientRegistrationSchema = z.object({
  name: z.string().min(2, 'الاسم يجب أن يكون على الأقل حرفين'),
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون على الأقل 6 أحرف'),
  password_confirmation: z.string(),
  phone: z.string().optional(),
  gender: z.enum(['male', 'female'], { required_error: 'يرجى اختيار الجنس' }),
  birthday: z.string().optional(),
  address: z.string().optional(),
  height: z.number().min(50).max(250).optional(),
  weight: z.number().min(20).max(300).optional(),
}).refine((data) => data.password === data.password_confirmation, {
  message: "كلمات المرور غير متطابقة",
  path: ["password_confirmation"],
});

type FormData = z.infer<typeof patientRegistrationSchema>;

interface PatientRegistrationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PatientRegistrationForm = ({ open, onOpenChange }: PatientRegistrationFormProps) => {
  const { registerPatient, isRegistering } = usePatientRegistration();
  
  // حالات للبيانات الطبية والصور
  const [generalDiseases, setGeneralDiseases] = useState<string[]>([]);
  const [chronicDiseases, setChronicDiseases] = useState<string[]>([]);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [permanentMedications, setPermanentMedications] = useState<string[]>([]);
  const [previousSurgeries, setPreviousSurgeries] = useState<string[]>([]);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [medicalImages, setMedicalImages] = useState<File[]>([]);
  
  // حالات للإدخال المؤقت
  const [newDisease, setNewDisease] = useState('');
  const [newChronicDisease, setNewChronicDisease] = useState('');
  const [newAllergy, setNewAllergy] = useState('');
  const [newMedication, setNewMedication] = useState('');
  const [newSurgery, setNewSurgery] = useState('');

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<FormData>({
    resolver: zodResolver(patientRegistrationSchema),
    defaultValues: {
      gender: 'male',
    }
  });

  // إعادة تعيين النموذج
  const resetForm = () => {
    reset();
    setGeneralDiseases([]);
    setChronicDiseases([]);
    setAllergies([]);
    setPermanentMedications([]);
    setPreviousSurgeries([]);
    setProfileImage(null);
    setMedicalImages([]);
    setNewDisease('');
    setNewChronicDisease('');
    setNewAllergy('');
    setNewMedication('');
    setNewSurgery('');
  };

  // معالجة إرسال النموذج
  const onSubmit = (data: FormData) => {
    const registrationData: PatientRegistrationRequest = {
      name: data.name,
      email: data.email,
      password: data.password,
      password_confirmation: data.password_confirmation,
      phone: data.phone,
      gender: data.gender,
      birthday: data.birthday,
      address: data.address,
      height: data.height,
      weight: data.weight,
      general_diseases: generalDiseases,
      chronic_diseases: chronicDiseases,
      allergies,
      permanent_medications: permanentMedications,
      previous_surgeries: previousSurgeries,
      profile_image: profileImage || undefined,
      medical_images: medicalImages,
    };

    registerPatient(registrationData, {
      onSuccess: () => {
        onOpenChange(false);
        resetForm();
      }
    });
  };

  // دوال إضافة العناصر للقوائم
  const addToList = (value: string, setter: React.Dispatch<React.SetStateAction<string[]>>, resetInput: () => void) => {
    if (value.trim()) {
      setter(prev => [...prev, value.trim()]);
      resetInput();
    }
  };

  // دوال حذف العناصر من القوائم
  const removeFromList = (index: number, setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter(prev => prev.filter((_, i) => i !== index));
  };

  // معالجة رفع الصور
  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
    }
  };

  const handleMedicalImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setMedicalImages(prev => [...prev, ...files]);
  };

  const removeMedicalImage = (index: number) => {
    setMedicalImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">تسجيل مريض جديد</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                البيانات الأساسية
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                الأمان
              </TabsTrigger>
              <TabsTrigger value="medical" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                المعلومات الطبية
              </TabsTrigger>
              <TabsTrigger value="images" className="flex items-center gap-2">
                <Camera className="h-4 w-4" />
                الصور
              </TabsTrigger>
            </TabsList>

            {/* البيانات الأساسية */}
            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">الاسم الكامل *</Label>
                  <Input
                    id="name"
                    {...register('name')}
                    className={errors.name ? 'border-destructive' : ''}
                  />
                  {errors.name && <p className="text-destructive text-sm mt-1">{errors.name.message}</p>}
                </div>

                <div>
                  <Label htmlFor="email">البريد الإلكتروني *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    className={errors.email ? 'border-destructive' : ''}
                  />
                  {errors.email && <p className="text-destructive text-sm mt-1">{errors.email.message}</p>}
                </div>

                <div>
                  <Label htmlFor="phone">رقم الهاتف</Label>
                  <Input
                    id="phone"
                    {...register('phone')}
                  />
                </div>

                <div>
                  <Label htmlFor="gender">الجنس *</Label>
                  <Controller
                    name="gender"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className={errors.gender ? 'border-destructive' : ''}>
                          <SelectValue placeholder="اختر الجنس" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">ذكر</SelectItem>
                          <SelectItem value="female">أنثى</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.gender && <p className="text-destructive text-sm mt-1">{errors.gender.message}</p>}
                </div>

                <div>
                  <Label htmlFor="birthday">تاريخ الميلاد</Label>
                  <Input
                    id="birthday"
                    type="date"
                    {...register('birthday')}
                  />
                </div>

                <div>
                  <Label htmlFor="address">العنوان</Label>
                  <Input
                    id="address"
                    {...register('address')}
                  />
                </div>

                <div>
                  <Label htmlFor="height">الطول (سم)</Label>
                  <Input
                    id="height"
                    type="number"
                    min="50"
                    max="250"
                    {...register('height', { valueAsNumber: true })}
                  />
                  {errors.height && <p className="text-destructive text-sm mt-1">{errors.height.message}</p>}
                </div>

                <div>
                  <Label htmlFor="weight">الوزن (كغ)</Label>
                  <Input
                    id="weight"
                    type="number"
                    min="20"
                    max="300"
                    {...register('weight', { valueAsNumber: true })}
                  />
                  {errors.weight && <p className="text-destructive text-sm mt-1">{errors.weight.message}</p>}
                </div>
              </div>
            </TabsContent>

            {/* الأمان */}
            <TabsContent value="security" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="password">كلمة المرور *</Label>
                  <Input
                    id="password"
                    type="password"
                    {...register('password')}
                    className={errors.password ? 'border-destructive' : ''}
                  />
                  {errors.password && <p className="text-destructive text-sm mt-1">{errors.password.message}</p>}
                </div>

                <div>
                  <Label htmlFor="password_confirmation">تأكيد كلمة المرور *</Label>
                  <Input
                    id="password_confirmation"
                    type="password"
                    {...register('password_confirmation')}
                    className={errors.password_confirmation ? 'border-destructive' : ''}
                  />
                  {errors.password_confirmation && <p className="text-destructive text-sm mt-1">{errors.password_confirmation.message}</p>}
                </div>
              </div>
            </TabsContent>

            {/* المعلومات الطبية */}
            <TabsContent value="medical" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* الأمراض العامة */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">الأمراض العامة</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={newDisease}
                        onChange={(e) => setNewDisease(e.target.value)}
                        placeholder="أدخل مرض عام"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToList(newDisease, setGeneralDiseases, () => setNewDisease('')))}
                      />
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => addToList(newDisease, setGeneralDiseases, () => setNewDisease(''))}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {generalDiseases.map((disease, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {disease}
                          <X
                            className="h-3 w-3 ml-1 cursor-pointer"
                            onClick={() => removeFromList(index, setGeneralDiseases)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* الأمراض المزمنة */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">الأمراض المزمنة</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={newChronicDisease}
                        onChange={(e) => setNewChronicDisease(e.target.value)}
                        placeholder="أدخل مرض مزمن"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToList(newChronicDisease, setChronicDiseases, () => setNewChronicDisease('')))}
                      />
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => addToList(newChronicDisease, setChronicDiseases, () => setNewChronicDisease(''))}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {chronicDiseases.map((disease, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {disease}
                          <X
                            className="h-3 w-3 ml-1 cursor-pointer"
                            onClick={() => removeFromList(index, setChronicDiseases)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* الحساسية */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">الحساسية</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={newAllergy}
                        onChange={(e) => setNewAllergy(e.target.value)}
                        placeholder="أدخل نوع حساسية"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToList(newAllergy, setAllergies, () => setNewAllergy('')))}
                      />
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => addToList(newAllergy, setAllergies, () => setNewAllergy(''))}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {allergies.map((allergy, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {allergy}
                          <X
                            className="h-3 w-3 ml-1 cursor-pointer"
                            onClick={() => removeFromList(index, setAllergies)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* الأدوية الدائمة */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">الأدوية الدائمة</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={newMedication}
                        onChange={(e) => setNewMedication(e.target.value)}
                        placeholder="أدخل دواء دائم"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToList(newMedication, setPermanentMedications, () => setNewMedication('')))}
                      />
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => addToList(newMedication, setPermanentMedications, () => setNewMedication(''))}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {permanentMedications.map((medication, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {medication}
                          <X
                            className="h-3 w-3 ml-1 cursor-pointer"
                            onClick={() => removeFromList(index, setPermanentMedications)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* العمليات السابقة */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">العمليات الجراحية السابقة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newSurgery}
                      onChange={(e) => setNewSurgery(e.target.value)}
                      placeholder="أدخل عملية جراحية سابقة"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToList(newSurgery, setPreviousSurgeries, () => setNewSurgery('')))}
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => addToList(newSurgery, setPreviousSurgeries, () => setNewSurgery(''))}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {previousSurgeries.map((surgery, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {surgery}
                        <X
                          className="h-3 w-3 ml-1 cursor-pointer"
                          onClick={() => removeFromList(index, setPreviousSurgeries)}
                        />
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* الصور */}
            <TabsContent value="images" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* الصورة الشخصية */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">الصورة الشخصية</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleProfileImageChange}
                      />
                      {profileImage && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-green-600">✓ {profileImage.name}</span>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => setProfileImage(null)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* الصور الطبية */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">الصور الطبية</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleMedicalImagesChange}
                      />
                      {medicalImages.length > 0 && (
                        <div className="space-y-1">
                          {medicalImages.map((image, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <span className="text-sm text-green-600">✓ {image.name}</span>
                              <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                onClick={() => removeMedicalImage(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isRegistering}
            >
              إلغاء
            </Button>
            <Button type="submit" disabled={isRegistering}>
              {isRegistering ? 'جاري التسجيل...' : 'تسجيل المريض'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PatientRegistrationForm;