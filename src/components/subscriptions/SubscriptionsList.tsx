import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, RefreshCw, X, Eye, Download } from 'lucide-react';
import { Subscription } from '@/types/subscriptions.ts';

interface SubscriptionsListProps {
  subscriptions: Subscription[];
  onRenew: (id: string) => void;
  onCancel: (id: string) => void;
  onToggleAutoRenew: (id: string) => void;
  onViewDetails: (subscription: Subscription) => void;
}

const SubscriptionsList: React.FC<SubscriptionsListProps> = ({
  subscriptions,
  onRenew,
  onCancel,
  onToggleAutoRenew,
  onViewDetails
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default">نشط</Badge>;
      case 'expired':
        return <Badge variant="destructive">منتهي</Badge>;
      case 'cancelled':
        return <Badge variant="secondary">ملغي</Badge>;
      case 'pending':
        return <Badge variant="outline">معلق</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const filteredSubscriptions = subscriptions.filter(subscription => {
    const matchesSearch = 
      subscription.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscription.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscription.id.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || subscription.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const isExpiringSoon = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffDays = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays >= 0;
  };

  return (
    <div className="space-y-4">
      {/* Search and Filter */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="البحث بالاسم، البريد، أو رقم الاشتراك..."
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
            <SelectItem value="all">جميع الحالات</SelectItem>
            <SelectItem value="active">نشط</SelectItem>
            <SelectItem value="expired">منتهي</SelectItem>
            <SelectItem value="cancelled">ملغي</SelectItem>
            <SelectItem value="pending">معلق</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="unified-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>المستخدم</TableHead>
              <TableHead>الخطة</TableHead>
              <TableHead>تاريخ البدء</TableHead>
              <TableHead>تاريخ الانتهاء</TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead>المبلغ</TableHead>
              <TableHead>طريقة الدفع</TableHead>
              <TableHead>التجديد التلقائي</TableHead>
              <TableHead>الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSubscriptions.map((subscription) => (
              <TableRow key={subscription.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{subscription.userName}</div>
                    <div className="text-sm text-muted-foreground">{subscription.userEmail}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{subscription.planName}</Badge>
                </TableCell>
                <TableCell>{subscription.startDate}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {subscription.endDate}
                    {isExpiringSoon(subscription.endDate) && subscription.status === 'active' && (
                      <Badge variant="destructive" className="text-xs">
                        ينتهي قريباً
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(subscription.status)}</TableCell>
                <TableCell>
                  {subscription.amount} {subscription.currency}
                </TableCell>
                <TableCell>{subscription.paymentMethod}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onToggleAutoRenew(subscription.id)}
                    className={subscription.autoRenew ? 'text-green-600' : 'text-muted-foreground'}
                  >
                    {subscription.autoRenew ? 'مفعل' : 'معطل'}
                  </Button>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewDetails(subscription)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    
                    {subscription.status === 'expired' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRenew(subscription.id)}
                        className="text-green-600"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                    )}
                    
                    {subscription.status === 'active' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onCancel(subscription.id)}
                        className="text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-600"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredSubscriptions.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          لا توجد اشتراكات تطابق البحث المحدد
        </div>
      )}
    </div>
  );
};

export default SubscriptionsList;