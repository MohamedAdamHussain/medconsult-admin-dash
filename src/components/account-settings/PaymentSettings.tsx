
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard, DollarSign, Percent, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PaymentSettings = () => {
  const { toast } = useToast();
  const [paymentConfig, setPaymentConfig] = useState({
    stripeEnabled: true,
    paypalEnabled: false,
    applePay: true,
    consultationFee: '100',
    currency: 'SAR',
    commission: '15',
    subscriptionEnabled: true,
    monthlyPrice: '299',
    yearlyPrice: '2990',
    freeTrialDays: '7'
  });

  const handleSwitchChange = (field: string, value: boolean) => {
    setPaymentConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleInputChange = (field: string, value: string) => {
    setPaymentConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    toast({
      title: "تم الحفظ بنجاح",
      description: "تم تحديث إعدادات الدفع بنجاح",
    });
  };

  return (
    <div className="space-y-6">
      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right flex items-center gap-2">
            <CreditCard size={20} />
            طرق الدفع المتاحة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Switch
              checked={paymentConfig.stripeEnabled}
              onCheckedChange={(value) => handleSwitchChange('stripeEnabled', value)}
            />
            <Label className="text-right">Stripe</Label>
          </div>
          
          <div className="flex items-center justify-between">
            <Switch
              checked={paymentConfig.paypalEnabled}
              onCheckedChange={(value) => handleSwitchChange('paypalEnabled', value)}
            />
            <Label className="text-right">PayPal</Label>
          </div>
          
          <div className="flex items-center justify-between">
            <Switch
              checked={paymentConfig.applePay}
              onCheckedChange={(value) => handleSwitchChange('applePay', value)}
            />
            <Label className="text-right">Apple Pay</Label>
          </div>
        </CardContent>
      </Card>

      {/* Pricing Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right flex items-center gap-2">
            <DollarSign size={20} />
            إعدادات الأسعار
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="consultation-fee" className="text-right block">رسوم الاستشارة</Label>
              <div className="flex gap-2">
                <Select value={paymentConfig.currency} onValueChange={(value) => handleInputChange('currency', value)}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SAR">ريال</SelectItem>
                    <SelectItem value="USD">دولار</SelectItem>
                    <SelectItem value="EUR">يورو</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  id="consultation-fee"
                  value={paymentConfig.consultationFee}
                  onChange={(e) => handleInputChange('consultationFee', e.target.value)}
                  className="text-right"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="commission" className="text-right block">عمولة المنصة (%)</Label>
              <Input
                id="commission"
                value={paymentConfig.commission}
                onChange={(e) => handleInputChange('commission', e.target.value)}
                className="text-right"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subscription Settings
      <Card>
        <CardHeader>
          <CardTitle className="text-right flex items-center gap-2">
            <Percent size={20} />
            إعدادات الاشتراكات
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Switch
              checked={paymentConfig.subscriptionEnabled}
              onCheckedChange={(value) => handleSwitchChange('subscriptionEnabled', value)}
            />
            <Label className="text-right">تفعيل نظام الاشتراكات</Label>
          </div>
          
          {paymentConfig.subscriptionEnabled && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="monthly-price" className="text-right block">الاشتراك الشهري</Label>
                <Input
                  id="monthly-price"
                  value={paymentConfig.monthlyPrice}
                  onChange={(e) => handleInputChange('monthlyPrice', e.target.value)}
                  className="text-right"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="yearly-price" className="text-right block">الاشتراك السنوي</Label>
                <Input
                  id="yearly-price"
                  value={paymentConfig.yearlyPrice}
                  onChange={(e) => handleInputChange('yearlyPrice', e.target.value)}
                  className="text-right"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="trial-days" className="text-right block">أيام التجربة المجانية</Label>
                <Input
                  id="trial-days"
                  value={paymentConfig.freeTrialDays}
                  onChange={(e) => handleInputChange('freeTrialDays', e.target.value)}
                  className="text-right"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card> */}

      <div className="flex justify-end">
        <Button onClick={handleSave} className="flex items-center gap-2">
          <Save size={16} />
          حفظ التغييرات
        </Button>
      </div>
    </div>
  );
};

export default PaymentSettings;
