
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { Patient } from '@/types/patients';

interface PatientFormProps {
  patient?: Patient;
  onSubmit: (data: Partial<Patient>) => void;
  onCancel: () => void;
}

const PatientForm: React.FC<PatientFormProps> = ({ patient, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: patient?.name || '',
    email: patient?.email || '',
    phone: patient?.phone || '',
    dateOfBirth: patient?.dateOfBirth || '',
    gender: patient?.gender || 'male',
    height: patient?.height || '',
    weight: patient?.weight || '',
    generalDiseases: patient?.generalDiseases || [],
    chronicDiseases: patient?.chronicDiseases || [],
    allergies: patient?.allergies || [],
    permanentMedications: patient?.permanentMedications || [],
    previousSurgeries: patient?.previousSurgeries || [],
  });

  const [newItem, setNewItem] = useState({
    generalDisease: '',
    chronicDisease: '',
    allergy: '',
    medication: '',
    surgery: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addArrayItem = (field: keyof typeof formData, value: string) => {
    if (value.trim()) {
      const currentArray = formData[field];
      if (Array.isArray(currentArray)) {
        setFormData(prev => ({
          ...prev,
          [field]: [...currentArray, value.trim()]
        }));
      }
    }
  };

  const removeArrayItem = (field: keyof typeof formData, index: number) => {
    const currentArray = formData[field];
    if (Array.isArray(currentArray)) {
      setFormData(prev => ({
        ...prev,
        [field]: currentArray.filter((_, i) => i !== index)
      }));
    }
  };

  const handleAddItem = (type: string) => {
    const value = newItem[type as keyof typeof newItem];
    if (value.trim()) {
      const fieldMap = {
        generalDisease: 'generalDiseases',
        chronicDisease: 'chronicDiseases',
        allergy: 'allergies',
        medication: 'permanentMedications',
        surgery: 'previousSurgeries',
      };
      
      const field = fieldMap[type as keyof typeof fieldMap] as keyof typeof formData;
      addArrayItem(field, value);
      setNewItem(prev => ({ ...prev, [type]: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      height: formData.height ? Number(formData.height) : undefined,
      weight: formData.weight ? Number(formData.weight) : undefined,
    });
  };

  const renderArraySection = (
    title: string,
    field: keyof typeof formData,
    newItemKey: keyof typeof newItem,
    placeholder: string
  ) => {
    const items = formData[field];
    const arrayItems = Array.isArray(items) ? items : [];
    
    return (
      <div className="space-y-3">
        <Label className="text-sm font-medium">{title}</Label>
        <div className="flex gap-2">
          <Input
            placeholder={placeholder}
            value={newItem[newItemKey]}
            onChange={(e) => setNewItem(prev => ({ ...prev, [newItemKey]: e.target.value }))}
            className="text-right"
          />
          <Button 
            type="button" 
            onClick={() => handleAddItem(newItemKey)}
            size="sm"
          >
            إضافة
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {arrayItems.map((item, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1">
              <span>{item}</span>
              <X 
                size={14} 
                className="cursor-pointer" 
                onClick={() => removeArrayItem(field, index)}
              />
            </Badge>
          ))}
        </div>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* البيانات الأساسية */}
        <Card>
          <CardHeader>
            <CardTitle className="text-right">البيانات الأساسية</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">الاسم الكامل</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="text-right"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="text-right"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="phone">رقم الهاتف</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="text-right"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="dateOfBirth">تاريخ الميلاد</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label>الجنس</Label>
              <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                <SelectTrigger className="text-right">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">ذكر</SelectItem>
                  <SelectItem value="female">أنثى</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* البيانات الجسدية */}
        <Card>
          <CardHeader>
            <CardTitle className="text-right">البيانات الجسدية</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="height">الطول (سم)</Label>
              <Input
                id="height"
                type="number"
                value={formData.height}
                onChange={(e) => handleInputChange('height', e.target.value)}
                className="text-right"
              />
            </div>
            
            <div>
              <Label htmlFor="weight">الوزن (كيلو)</Label>
              <Input
                id="weight"
                type="number"
                value={formData.weight}
                onChange={(e) => handleInputChange('weight', e.target.value)}
                className="text-right"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* المعلومات الطبية */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right">المعلومات الطبية</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderArraySection(
            'الأمراض العامة',
            'generalDiseases',
            'generalDisease',
            'أدخل مرض عام'
          )}
          
          {renderArraySection(
            'الأمراض المزمنة',
            'chronicDiseases',
            'chronicDisease',
            'أدخل مرض مزمن'
          )}
          
          {renderArraySection(
            'الحساسية',
            'allergies',
            'allergy',
            'أدخل نوع حساسية'
          )}
          
          {renderArraySection(
            'الأدوية الدائمة',
            'permanentMedications',
            'medication',
            'أدخل دواء دائم'
          )}
          
          {renderArraySection(
            'العمليات الجراحية السابقة',
            'previousSurgeries',
            'surgery',
            'أدخل عملية جراحية'
          )}
        </CardContent>
      </Card>

      {/* أزرار الحفظ والإلغاء */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          إلغاء
        </Button>
        <Button type="submit">
          {patient ? 'تحديث' : 'إضافة'} المريض
        </Button>
      </div>
    </form>
  );
};

export default PatientForm;
