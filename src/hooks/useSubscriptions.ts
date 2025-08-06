import { useState, useEffect } from 'react';
import { Subscription, SubscriptionStats } from '@/types/subscriptions';

// Mock data for subscriptions
const mockSubscriptions: Subscription[] = [
  {
    id: '1',
    userId: '1',
    userName: 'أحمد محمد الأحمد',
    userEmail: 'ahmed@example.com',
    planId: '2',
    planName: 'بريميوم',
    startDate: '2024-05-01',
    endDate: '2024-06-01',
    status: 'active',
    paymentMethod: 'Visa ****1234',
    amount: 200,
    currency: 'SAR',
    autoRenew: true,
    renewalDate: '2024-06-01',
    createdAt: '2024-05-01',
    updatedAt: '2024-05-01'
  },
  {
    id: '2',
    userId: '2',
    userName: 'سارة عبدالله الخالد',
    userEmail: 'sara@example.com',
    planId: '1',
    planName: 'الأساسي',
    startDate: '2024-04-15',
    endDate: '2024-05-15',
    status: 'expired',
    paymentMethod: 'PayPal',
    amount: 100,
    currency: 'SAR',
    autoRenew: false,
    createdAt: '2024-04-15',
    updatedAt: '2024-05-15'
  },
  {
    id: '3',
    userId: '3',
    userName: 'محمد علي السعد',
    userEmail: 'mohammed@example.com',
    planId: '2',
    planName: 'بريميوم',
    startDate: '2024-05-10',
    endDate: '2024-06-10',
    status: 'active',
    paymentMethod: 'مدى ****5678',
    amount: 200,
    currency: 'SAR',
    autoRenew: true,
    renewalDate: '2024-06-10',
    createdAt: '2024-05-10',
    updatedAt: '2024-05-10'
  }
];

export const useSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(mockSubscriptions);
  const [loading, setLoading] = useState(false);

  const getSubscriptionStats = (): SubscriptionStats => {
    const totalSubscriptions = subscriptions.length;
    const activeSubscriptions = subscriptions.filter(sub => sub.status === 'active').length;
    const expiredSubscriptions = subscriptions.filter(sub => sub.status === 'expired').length;
    const totalRevenue = subscriptions.reduce((sum, sub) => sum + sub.amount, 0);
    const monthlyRevenue = subscriptions
      .filter(sub => {
        const subDate = new Date(sub.createdAt);
        const now = new Date();
        return subDate.getMonth() === now.getMonth() && subDate.getFullYear() === now.getFullYear();
      })
      .reduce((sum, sub) => sum + sub.amount, 0);

    const planDistribution = subscriptions.reduce((acc, sub) => {
      const existing = acc.find(item => item.planName === sub.planName);
      if (existing) {
        existing.count++;
        existing.revenue += sub.amount;
      } else {
        acc.push({
          planName: sub.planName,
          count: 1,
          revenue: sub.amount
        });
      }
      return acc;
    }, [] as { planName: string; count: number; revenue: number; }[]);

    return {
      totalSubscriptions,
      activeSubscriptions,
      expiredSubscriptions,
      totalRevenue,
      monthlyRevenue,
      planDistribution
    };
  };

  const renewSubscription = (id: string) => {
    setSubscriptions(prev => prev.map(sub =>
      sub.id === id
        ? {
            ...sub,
            status: 'active' as const,
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            updatedAt: new Date().toISOString()
          }
        : sub
    ));
  };

  const cancelSubscription = (id: string) => {
    setSubscriptions(prev => prev.map(sub =>
      sub.id === id
        ? { ...sub, status: 'cancelled' as const, autoRenew: false, updatedAt: new Date().toISOString() }
        : sub
    ));
  };

  const toggleAutoRenew = (id: string) => {
    setSubscriptions(prev => prev.map(sub =>
      sub.id === id
        ? { ...sub, autoRenew: !sub.autoRenew, updatedAt: new Date().toISOString() }
        : sub
    ));
  };

  return {
    subscriptions,
    loading,
    getSubscriptionStats,
    renewSubscription,
    cancelSubscription,
    toggleAutoRenew
  };
};