
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { Patient } from '@/types/patients';

interface PatientFormProps {
  patient?: Patient | null;
  onSubmit: (data: Omit<Patient, 'id' | 'registrationDate' | 'totalConsultations'>) => void;
  onCancel: () => void;
}

const PatientForm = ({ patient, onSubmit, onCancel }: PatientFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: 'male' as 'male' | 'female',
    status: 'active' as Patient['status'],
    height: '',
    weight: '',
    generalDiseases: [] as string[],
    chronicDiseases: [] as string[],
    allergies: [] as string[],
    permanentMedications: [] as string[],
    previousSurgeries: [] as string[],
    radiologyImages: [] as string[]
  });

  const [newItem, setNewItem] = useState({
    generalDisease: '',
    chronicDisease: '',
    allergy: '',
    medication: '',
    surgery: ''
  });

  useEffect(() => {
    if (patient) {
      setFormData({
        name: patient.name,
        email: patient.email,
        phone: patient.phone,
        dateOfBirth: patient.dateOfBirth,
        gender: patient.gender,
        status: patient.status,
        height: patient.height?.toString() || '',
        weight: patient.weight?.toString() || '',
        generalDiseases: patient.generalDiseases || [],
        chronicDiseases: patient.chronicDiseases || [],
        allergies: patient.allergies || [],
        permanentMedications: patient.permanentMedications || [],
        previousSurgeries: patient.previousSurgeries || [],
        radiologyImages: patient.radiologyImages || []
      });
    }
  }, [patient]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addItemToArray = (arrayName: keyof typeof formData, itemKey: keyof typeof newItem) => {
    const item = newItem[itemKey].trim();
    if (item && !formData[arrayName].includes(item)) {
      setFormData(prev => ({
        ...prev,
        [arrayName]: [...prev[arrayName], item]
      }));
      setNewItem(prev => ({ ...prev, [itemKey]: '' }));
    }
  };

  const removeItemFromArray = (arrayName: keyof typeof formData, index: number) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      ...formData,
      height: formData.height ? parseInt(formData.height) : undefined,
      weight: formData.weight ? parseInt(formData.weight) : undefined,
      lastConsultationDate: patient?.lastConsultationDate
    };

    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>المعلومات الشخصية</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">الاسم *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="email">البريد الإلكتروني *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="phone">رقم الهاتف *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="dateOfBirth">تاريخ الميلاد *</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="gender">الجنس *</Label>
              <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">ذكر</SelectItem>
                  <SelectItem value="female">أنثى</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="status">حالة الحساب</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">نشط</SelectItem>
                  <SelectItem value="suspended">معلق</SelectItem>
                  <SelectItem value="blocked">محظور</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Medical Information */}
      <Card>
        <CardHeader>
          <CardTitle>المعلومات الطبية</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="height">الطول (سم)</Label>
              <Input
                id="height"
                type="number"
                value={formData.height}
                onChange={(e) => handleInputChange('height', e.target.value)}
                placeholder="170"
              />
            </div>
            
            <div>
              <Label htmlFor="weight">الوزن (كج)</Label>
              <Input
                id="weight"
                type="number"
                value={formData.weight}
                onChange={(e) => handleInputChange('weight', e.target.value)}
                placeholder="70"
              />
            </div>
          </div>

          {/* General Diseases */}
          <div>
            <Label>الأمراض العامة</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newItem.generalDisease}
                onChange={(e) => setNewItem(prev => ({ ...prev, generalDisease: e.target.value }))}
                placeholder="أضف مرض عام"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItemToArray('generalDiseases', 'generalDisease'))}
              />
              <Button 
                type="button" 
                onClick={() => addItemToArray('generalDiseases', 'generalDisease')}
                disabled={!newItem.generalDisease.trim()}
              >
                إضافة
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.generalDiseases.map((disease, index) => (
                <Badge key={index} variant="outline" className="flex items-center gap-1">
                  {disease}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => removeItemFromArray('generalDiseases', index)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          {/* Chronic Diseases */}
          <div>
            <Label>الأمراض المزمنة</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newItem.chronicDisease}
                onChange={(e) => setNewItem(prev => ({ ...prev, chronicDisease: e.target.value }))}
                placeholder="أضف مرض مزمن"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItemToArray('chronicDiseases', 'chronicDisease'))}
              />
              <Button 
                type="button" 
                onClick={() => addItemToArray('chronicDiseases', 'chronicDisease')}
                disabled={!newItem.chronicDisease.trim()}
              >
                إضافة
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.chronicDiseases.map((disease, index) => (
                <Badge key={index} variant="outline" className="flex items-center gap-1 bg-orange-100 text-orange-800">
                  {disease}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => removeItemFromArray('chronicDiseases', index)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          {/* Allergies */}
          <div>
            <Label>الحساسية</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newItem.allergy}
                onChange={(e) => setNewItem(prev => ({ ...prev, allergy: e.target.value }))}
                placeholder="أضف حساسية"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItemToArray('allergies', 'allergy'))}
              />
              <Button 
                type="button" 
                onClick={() => addItemToArray('allergies', 'allergy')}
                disabled={!newItem.allergy.trim()}
              >
                إضافة
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.allergies.map((allergy, index) => (
                <Badge key={index} variant="outline" className="flex items-center gap-1 bg-red-100 text-red-800">
                  {allergy}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => removeItemFromArray('allergies', index)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          {/* Permanent Medications */}
          <div>
            <Label>الأدوية الدائمة</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newItem.medication}
                onChange={(e) => setNewItem(prev => ({ ...prev, medication: e.target.value }))}
                placeholder="أضف دواء دائم"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItemToArray('permanentMedications', 'medication'))}
              />
              <Button 
                type="button" 
                onClick={() => addItemToArray('permanentMedications', 'medication')}
                disabled={!newItem.medication.trim()}
              >
                إضافة
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.permanentMedications.map((medication, index) => (
                <Badge key={index} variant="outline" className="flex items-center gap-1 bg-blue-100 text-blue-800">
                  {medication}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => removeItemFromArray('permanentMedications', index)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          {/* Previous Surgeries */}
          <div>
            <Label>العمليات الجراحية السابقة</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newItem.surgery}
                onChange={(e) => setNewItem(prev => ({ ...prev, surgery: e.target.value }))}
                placeholder="أضف عملية جراحية"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItemToArray('previousSurgeries', 'surgery'))}
              />
              <Button 
                type="button" 
                onClick={() => addItemToArray('previousSurgeries', 'surgery')}
                disabled={!newItem.surgery.trim()}
              >
                إضافة
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.previousSurgeries.map((surgery, index) => (
                <Badge key={index} variant="outline" className="flex items-center gap-1 bg-purple-100 text-purple-800">
                  {surgery}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => removeItemFromArray('previousSurgeries', index)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex gap-4 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          إلغاء
        </Button>
        <Button type="submit">
          {patient ? 'تحديث المريض' : 'إضافة المريض'}
        </Button>
      </div>
    </form>
  );
};

export default PatientForm;
