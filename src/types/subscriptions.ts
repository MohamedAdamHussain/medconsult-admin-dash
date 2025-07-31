export interface SubscriptionPlan {
  id: string;
  name: string;
  nameEn: string;
  price: number;
  currency: string;
  duration: 'monthly' | 'quarterly' | 'yearly';
  features: string[];
  isActive: boolean;
  maxConsultations: number;
  hasUnlimitedConsultations: boolean;
  discount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Subscription {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  planId: string;
  planName: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'cancelled' | 'pending';
  paymentMethod: string;
  amount: number;
  currency: string;
  autoRenew: boolean;
  renewalDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionStats {
  totalSubscriptions: number;
  activeSubscriptions: number;
  expiredSubscriptions: number;
  totalRevenue: number;
  monthlyRevenue: number;
  planDistribution: {
    planName: string;
    count: number;
    revenue: number;
  }[];
}