import { useState, useEffect } from 'react';
import { SubscriptionPlan } from '@/types/subscriptions';

// Mock data for subscription plans
const mockPlans: SubscriptionPlan[] = [
  {
    id: '1',
    name: 'الأساسي',
    nameEn: 'Basic',
    price: 100,
    currency: 'SAR',
    duration: 'monthly',
    features: ['5 استشارات شهرياً', 'دعم فني أساسي', 'تقارير شهرية'],
    isActive: true,
    maxConsultations: 5,
    hasUnlimitedConsultations: false,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: '2',
    name: 'بريميوم',
    nameEn: 'Premium',
    price: 200,
    currency: 'SAR',
    duration: 'monthly',
    features: ['استشارات غير محدودة', 'دعم فني متقدم', 'تقارير مفصلة', 'تسجيل الجلسات'],
    isActive: true,
    maxConsultations: 0,
    hasUnlimitedConsultations: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: '3',
    name: 'المتقدم',
    nameEn: 'Enterprise',
    price: 500,
    currency: 'SAR',
    duration: 'monthly',
    features: ['كل مميزات بريميوم', 'استشارات عاجلة', 'مدير حساب مخصص', 'API للتكامل'],
    isActive: false,
    maxConsultations: 0,
    hasUnlimitedConsultations: true,
    discount: 10,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  }
];

export const useSubscriptionPlans = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>(mockPlans);
  const [loading, setLoading] = useState(false);

  const addPlan = (newPlan: Omit<SubscriptionPlan, 'id' | 'createdAt' | 'updatedAt'>) => {
    const plan: SubscriptionPlan = {
      ...newPlan,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setPlans(prev => [...prev, plan]);
  };

  const updatePlan = (id: string, updates: Partial<SubscriptionPlan>) => {
    setPlans(prev => prev.map(plan => 
      plan.id === id 
        ? { ...plan, ...updates, updatedAt: new Date().toISOString() }
        : plan
    ));
  };

  const deletePlan = (id: string) => {
    setPlans(prev => prev.filter(plan => plan.id !== id));
  };

  const togglePlanStatus = (id: string) => {
    setPlans(prev => prev.map(plan =>
      plan.id === id
        ? { ...plan, isActive: !plan.isActive, updatedAt: new Date().toISOString() }
        : plan
    ));
  };

  return {
    plans,
    loading,
    addPlan,
    updatePlan,
    deletePlan,
    togglePlanStatus
  };
};