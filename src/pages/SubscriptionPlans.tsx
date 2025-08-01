import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search } from 'lucide-react';
import { useSubscriptionPlans } from '@/hooks/useSubscriptionPlans';
import { SubscriptionPlan } from '@/types/subscriptions';
import PlansList from '@/components/subscription-plans/PlansList';
import AddEditPlanDialog from '@/components/subscription-plans/AddEditPlanDialog';
import PlanDetailsDialog from '@/components/subscription-plans/PlanDetailsDialog';
import { toast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

const SubscriptionPlans: React.FC = () => {
  const { plans, addPlan, updatePlan, deletePlan, togglePlanStatus } = useSubscriptionPlans();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [viewingPlan, setViewingPlan] = useState<SubscriptionPlan | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredPlans = plans.filter(plan => {
    const matchesSearch = plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.nameEn.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && plan.isActive) ||
                         (statusFilter === 'inactive' && !plan.isActive);
    return matchesSearch && matchesStatus;
  });

  const handleAddPlan = () => {
    setEditingPlan(null);
    setIsDialogOpen(true);
  };

  const handleEditPlan = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setIsDialogOpen(true);
  };

  const handleSavePlan = (planData: Omit<SubscriptionPlan, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingPlan) {
      updatePlan(editingPlan.id, planData);
      toast({
        title: 'تم التحديث',
        description: 'تم تحديث الخطة بنجاح',
      });
    } else {
      addPlan(planData);
      toast({
        title: 'تمت الإضافة',
        description: 'تم إضافة الخطة بنجاح',
      });
    }
    setIsDialogOpen(false);
  };

  const handleDeletePlan = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذه الخطة؟')) {
      deletePlan(id);
      toast({
        title: 'تم الحذف',
        description: 'تم حذف الخطة بنجاح',
        variant: 'destructive',
      });
    }
  };

  const handleToggleStatus = (id: string) => {
    togglePlanStatus(id);
    toast({
      title: 'تم التحديث',
      description: 'تم تحديث حالة الخطة بنجاح',
    });
  };

  const handleViewPlan = (plan: SubscriptionPlan) => {
    setViewingPlan(plan);
    setIsDetailsDialogOpen(true);
  };

  const handleCopyPlan = (plan: SubscriptionPlan) => {
    const copiedPlan = {
      ...plan,
      name: `${plan.name} - نسخة`,
      nameEn: `${plan.nameEn} - Copy`,
      isActive: false
    };
    delete (copiedPlan as any).id;
    delete (copiedPlan as any).createdAt;
    delete (copiedPlan as any).updatedAt;
    
    addPlan(copiedPlan);
    toast({
      title: 'تم النسخ',
      description: 'تم نسخ الخطة بنجاح',
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">إدارة الخطط</h1>
            <p className="text-muted-foreground">إدارة خطط الاشتراك للمنصة</p>
          </div>
          <Button onClick={handleAddPlan}>
            <Plus className="w-4 h-4 ml-2" />
            إضافة خطة جديدة
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="البحث في الخطط..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="فلترة حسب الحالة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الخطط</SelectItem>
              <SelectItem value="active">الخطط النشطة</SelectItem>
              <SelectItem value="inactive">الخطط المعطلة</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="stats-card">
            <div className="text-2xl font-bold text-primary">{plans.length}</div>
            <div className="text-sm text-muted-foreground">إجمالي الخطط</div>
          </div>
          <div className="stats-card">
            <div className="text-2xl font-bold text-green-600">{plans.filter(p => p.isActive).length}</div>
            <div className="text-sm text-muted-foreground">الخطط النشطة</div>
          </div>
          <div className="stats-card">
            <div className="text-2xl font-bold text-orange-600">{plans.filter(p => !p.isActive).length}</div>
            <div className="text-sm text-muted-foreground">الخطط المعطلة</div>
          </div>
          <div className="stats-card">
            <div className="text-2xl font-bold text-purple-600">
              {Math.round(plans.reduce((sum, p) => sum + p.price, 0) / plans.length || 0)} ر.س
            </div>
            <div className="text-sm text-muted-foreground">متوسط السعر</div>
          </div>
        </div>

        {/* Plans List */}
        <PlansList
          plans={filteredPlans}
          onEdit={handleEditPlan}
          onDelete={handleDeletePlan}
          onToggleStatus={handleToggleStatus}
          onView={handleViewPlan}
          onCopy={handleCopyPlan}
        />

        {/* Add/Edit Dialog */}
        <AddEditPlanDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSave={handleSavePlan}
          editingPlan={editingPlan}
        />

        {/* Plan Details Dialog */}
        <PlanDetailsDialog
          isOpen={isDetailsDialogOpen}
          onClose={() => setIsDetailsDialogOpen(false)}
          plan={viewingPlan}
        />
      </div>
    </DashboardLayout>
  );
};

export default SubscriptionPlans;