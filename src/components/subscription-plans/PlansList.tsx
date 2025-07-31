import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Edit, Copy, Trash2, Eye } from 'lucide-react';
import { SubscriptionPlan } from '@/types/subscriptions';

interface PlansListProps {
  plans: SubscriptionPlan[];
  onEdit: (plan: SubscriptionPlan) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onView: (plan: SubscriptionPlan) => void;
  onCopy: (plan: SubscriptionPlan) => void;
}

const PlansList: React.FC<PlansListProps> = ({
  plans,
  onEdit,
  onDelete,
  onToggleStatus,
  onView,
  onCopy
}) => {
  const getDurationText = (duration: string) => {
    switch (duration) {
      case 'monthly': return 'شهري';
      case 'quarterly': return 'ربع سنوي';
      case 'yearly': return 'سنوي';
      default: return duration;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {plans.map((plan) => (
        <Card key={plan.id} className="unified-card p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-bold text-primary">{plan.name}</h3>
              <p className="text-sm text-muted-foreground">{plan.nameEn}</p>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={plan.isActive}
                onCheckedChange={() => onToggleStatus(plan.id)}
              />
              <Badge variant={plan.isActive ? 'default' : 'secondary'}>
                {plan.isActive ? 'نشط' : 'معطل'}
              </Badge>
            </div>
          </div>

          <div className="text-center mb-4">
            <div className="text-3xl font-bold text-primary">
              {plan.price} {plan.currency}
            </div>
            <div className="text-sm text-muted-foreground">
              {getDurationText(plan.duration)}
            </div>
            {plan.discount && (
              <Badge variant="destructive" className="mt-1">
                خصم {plan.discount}%
              </Badge>
            )}
          </div>

          <div className="mb-4">
            <h4 className="font-semibold mb-2">المميزات:</h4>
            <ul className="text-sm space-y-1">
              {plan.features.slice(0, 3).map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  {feature}
                </li>
              ))}
              {plan.features.length > 3 && (
                <li className="text-muted-foreground">
                  +{plan.features.length - 3} مميزات أخرى
                </li>
              )}
            </ul>
          </div>

          <div className="mb-4 text-sm">
            <div className="flex justify-between">
              <span>الاستشارات:</span>
              <span className="font-medium">
                {plan.hasUnlimitedConsultations ? 'غير محدودة' : `${plan.maxConsultations} شهرياً`}
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onView(plan)}
              className="flex-1"
            >
              <Eye className="w-4 h-4 ml-2" />
              عرض
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(plan)}
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCopy(plan)}
            >
              <Copy className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(plan.id)}
              className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default PlansList;