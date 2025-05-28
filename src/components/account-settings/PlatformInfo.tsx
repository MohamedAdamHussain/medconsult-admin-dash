
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Save, Image } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PlatformInfo = () => {
  const { toast } = useToast();
  const [platformData, setPlatformData] = useState({
    name: 'منصة الاستشارات الطبية',
    description: 'منصة شاملة لتقديم الاستشارات الطبية عن بُعد',
    logo: '',
    privacyPolicy: 'سياسة الخصوصية الحالية...',
    termsOfService: 'شروط الخدمة الحالية...',
    contactEmail: 'info@medicalplatform.com',
    supportPhone: '+966123456789'
  });

  const handleInputChange = (field: string, value: string) => {
    setPlatformData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // Here you would typically save to backend
    toast({
      title: "تم الحفظ بنجاح",
      description: "تم تحديث معلومات المنصة بنجاح",
    });
  };

  const handleLogoUpload = () => {
    // Handle logo upload
    toast({
      title: "تم رفع الشعار",
      description: "تم رفع شعار المنصة بنجاح",
    });
  };

  return (
    <div className="space-y-6">
      {/* Logo Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right flex items-center gap-2">
            <Image size={20} />
            شعار المنصة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
              {platformData.logo ? (
                <img src={platformData.logo} alt="Logo" className="w-full h-full object-cover rounded-lg" />
              ) : (
                <Image size={32} className="text-gray-400" />
              )}
            </div>
            <Button onClick={handleLogoUpload} variant="outline" className="flex items-center gap-2">
              <Upload size={16} />
              رفع شعار جديد
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right">المعلومات الأساسية</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="platform-name" className="text-right block">اسم المنصة</Label>
              <Input
                id="platform-name"
                value={platformData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="text-right"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-email" className="text-right block">البريد الإلكتروني</Label>
              <Input
                id="contact-email"
                type="email"
                value={platformData.contactEmail}
                onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                className="text-right"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="support-phone" className="text-right block">رقم الدعم</Label>
            <Input
              id="support-phone"
              value={platformData.supportPhone}
              onChange={(e) => handleInputChange('supportPhone', e.target.value)}
              className="text-right"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description" className="text-right block">وصف المنصة</Label>
            <Textarea
              id="description"
              value={platformData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="text-right min-h-[100px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Policies Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right">السياسات والشروط</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="privacy-policy" className="text-right block">سياسة الخصوصية</Label>
            <Textarea
              id="privacy-policy"
              value={platformData.privacyPolicy}
              onChange={(e) => handleInputChange('privacyPolicy', e.target.value)}
              className="text-right min-h-[200px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="terms-of-service" className="text-right block">شروط الخدمة</Label>
            <Textarea
              id="terms-of-service"
              value={platformData.termsOfService}
              onChange={(e) => handleInputChange('termsOfService', e.target.value)}
              className="text-right min-h-[200px]"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} className="flex items-center gap-2">
          <Save size={16} />
          حفظ التغييرات
        </Button>
      </div>
    </div>
  );
};

export default PlatformInfo;
