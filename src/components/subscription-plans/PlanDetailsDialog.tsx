import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Calendar, CheckCircle, DollarSign, Users, Clock } from 'lucide-react';
import { SubscriptionPlan } from '@/types/subscriptions.ts';

interface PlanDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  plan: SubscriptionPlan | null;
}

const PlanDetailsDialog: React.FC<PlanDetailsDialogProps> = ({
  isOpen,
  onClose,
  plan
}) => {
  if (!plan) return null;

  const getDurationText = (duration: string) => {
    switch (duration) {
      case 'monthly': return 'شهري';
      case 'quarterly': return 'ربع سنوي';
      case 'yearly': return 'سنوي';
      default: return duration;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-3">
            تفاصيل خطة: {plan.name}
            <Badge variant={plan.isActive ? 'default' : 'secondary'}>
              {plan.isActive ? 'نشطة' : 'معطلة'}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* معلومات أساسية */}
          <Card className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">
                  {plan.price} {plan.currency}
                </div>
                <div className="text-lg text-muted-foreground">
                  {getDurationText(plan.duration)}
                </div>
                {plan.discount && (
                  <Badge variant="destructive" className="mt-2">
                    خصم {plan.discount}%
                  </Badge>
                )}
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-primary" />
                  <div>
                    <div className="font-medium">الاستشارات</div>
                    <div className="text-sm text-muted-foreground">
                      {plan.hasUnlimitedConsultations ? 'غير محدودة' : `${plan.maxConsultations} شهرياً`}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-primary" />
                  <div>
                    <div className="font-medium">نوع الخطة</div>
                    <div className="text-sm text-muted-foreground">
                      {plan.nameEn}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* المميزات */}
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              مميزات الخطة
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {plan.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* معلومات إضافية */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <Calendar className="w-5 h-5 text-primary" />
                <h4 className="font-medium">تاريخ الإنشاء</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                {formatDate(plan.createdAt)}
              </p>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <Clock className="w-5 h-5 text-primary" />
                <h4 className="font-medium">آخر تحديث</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                {formatDate(plan.updatedAt)}
              </p>
            </Card>
          </div>

          {/* إحصائيات الخطة */}
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">إحصائيات الخطة</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">0</div>
                <div className="text-sm text-muted-foreground">المشتركين الحاليين</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">0 ر.س</div>
                <div className="text-sm text-muted-foreground">الإيرادات الشهرية</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">0</div>
                <div className="text-sm text-muted-foreground">إجمالي الاشتراكات</div>
              </div>
            </div>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlanDetailsDialog;