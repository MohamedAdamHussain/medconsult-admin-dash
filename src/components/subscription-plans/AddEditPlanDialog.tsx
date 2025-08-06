import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { SubscriptionPlan } from '@/types/subscriptions.ts';

interface AddEditPlanDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (plan: Omit<SubscriptionPlan, 'id' | 'createdAt' | 'updatedAt'>) => void;
  editingPlan?: SubscriptionPlan | null;
}

const AddEditPlanDialog: React.FC<AddEditPlanDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  editingPlan
}) => {
  const [formData, setFormData] = useState({
    name: '',
    nameEn: '',
    price: 0,
    currency: 'SAR',
    duration: 'monthly' as 'monthly' | 'quarterly' | 'yearly',
    features: [] as string[],
    isActive: true,
    maxConsultations: 0,
    hasUnlimitedConsultations: false,
    discount: 0
  });
  const [newFeature, setNewFeature] = useState('');

  useEffect(() => {
    if (editingPlan) {
      setFormData({
        name: editingPlan.name,
        nameEn: editingPlan.nameEn,
        price: editingPlan.price,
        currency: editingPlan.currency,
        duration: editingPlan.duration,
        features: [...editingPlan.features],
        isActive: editingPlan.isActive,
        maxConsultations: editingPlan.maxConsultations,
        hasUnlimitedConsultations: editingPlan.hasUnlimitedConsultations,
        discount: editingPlan.discount || 0
      });
    } else {
      setFormData({
        name: '',
        nameEn: '',
        price: 0,
        currency: 'SAR',
        duration: 'monthly',
        features: [],
        isActive: true,
        maxConsultations: 0,
        hasUnlimitedConsultations: false,
        discount: 0
      });
    }
  }, [editingPlan, isOpen]);

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingPlan ? 'تعديل الخطة' : 'إضافة خطة جديدة'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">اسم الخطة (بالعربية)</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="مثل: بريميوم"
              />
            </div>
            <div>
              <Label htmlFor="nameEn">اسم الخطة (بالإنجليزية)</Label>
              <Input
                id="nameEn"
                value={formData.nameEn}
                onChange={(e) => setFormData(prev => ({ ...prev, nameEn: e.target.value }))}
                placeholder="e.g: Premium"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="price">السعر</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                placeholder="100"
              />
            </div>
            <div>
              <Label htmlFor="currency">العملة</Label>
              <Select value={formData.currency} onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SAR">ريال سعودي</SelectItem>
                  <SelectItem value="USD">دولار أمريكي</SelectItem>
                  <SelectItem value="EUR">يورو</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="duration">المدة</Label>
              <Select value={formData.duration} onValueChange={(value: any) => setFormData(prev => ({ ...prev, duration: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">شهري</SelectItem>
                  <SelectItem value="quarterly">ربع سنوي</SelectItem>
                  <SelectItem value="yearly">سنوي</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="discount">نسبة الخصم (%)</Label>
              <Input
                id="discount"
                type="number"
                value={formData.discount}
                onChange={(e) => setFormData(prev => ({ ...prev, discount: Number(e.target.value) }))}
                placeholder="0"
                min="0"
                max="100"
              />
            </div>
            <div className="flex items-center space-x-2 space-x-reverse pt-6">
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
              />
              <Label>الخطة نشطة</Label>
            </div>
          </div>

          <div>
            <div className="flex items-center space-x-2 space-x-reverse mb-4">
              <Switch
                checked={formData.hasUnlimitedConsultations}
                onCheckedChange={(checked) => setFormData(prev => ({ 
                  ...prev, 
                  hasUnlimitedConsultations: checked,
                  maxConsultations: checked ? 0 : prev.maxConsultations
                }))}
              />
              <Label>استشارات غير محدودة</Label>
            </div>
            {!formData.hasUnlimitedConsultations && (
              <div>
                <Label htmlFor="maxConsultations">عدد الاستشارات المسموحة شهرياً</Label>
                <Input
                  id="maxConsultations"
                  type="number"
                  value={formData.maxConsultations}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxConsultations: Number(e.target.value) }))}
                  placeholder="5"
                  min="1"
                />
              </div>
            )}
          </div>

          <div>
            <Label>المميزات</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="أضف ميزة جديدة"
                onKeyPress={(e) => e.key === 'Enter' && addFeature()}
              />
              <Button type="button" onClick={addFeature}>إضافة</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.features.map((feature, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {feature}
                  <X 
                    className="w-3 h-3 cursor-pointer" 
                    onClick={() => removeFeature(index)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            إلغاء
          </Button>
          <Button onClick={handleSave}>
            {editingPlan ? 'حفظ التعديلات' : 'إضافة الخطة'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditPlanDialog;