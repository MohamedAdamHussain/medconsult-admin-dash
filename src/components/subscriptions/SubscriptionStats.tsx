import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, UserX, DollarSign, Calendar } from 'lucide-react';
import { SubscriptionStats as StatsType } from '@/types/subscriptions.ts';

interface SubscriptionStatsProps {
  stats: StatsType;
}

const SubscriptionStats: React.FC<SubscriptionStatsProps> = ({ stats }) => {
  const statsCards = [
    {
      title: 'إجمالي الاشتراكات',
      value: stats.totalSubscriptions,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'الاشتراكات النشطة',
      value: stats.activeSubscriptions,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'الاشتراكات المنتهية',
      value: stats.expiredSubscriptions,
      icon: UserX,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'الإيرادات الإجمالية',
      value: `${stats.totalRevenue} ر.س`,
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'إيرادات هذا الشهر',
      value: `${stats.monthlyRevenue} ر.س`,
      icon: Calendar,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {statsCards.map((stat, index) => (
          <Card key={index} className="unified-card p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-xl font-bold">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Plan Distribution */}
      <Card className="unified-card p-6">
        <h3 className="text-lg font-semibold mb-4">توزيع الاشتراكات حسب الخطط</h3>
        <div className="space-y-3">
          {stats.planDistribution.map((plan, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <div className="flex items-center gap-3">
                <Badge variant="outline">{plan.planName}</Badge>
                <span className="text-sm text-muted-foreground">
                  {plan.count} مشترك
                </span>
              </div>
              <div className="text-left">
                <div className="font-semibold">{plan.revenue} ر.س</div>
                <div className="text-xs text-muted-foreground">إجمالي الإيرادات</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default SubscriptionStats;