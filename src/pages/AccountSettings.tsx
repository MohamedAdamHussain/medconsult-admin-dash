
import React, { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import PlatformInfo from '@/components/account-settings/PlatformInfo';
import PaymentSettings from '@/components/account-settings/PaymentSettings';
import MaintenanceSettings from '@/components/account-settings/MaintenanceSettings';
import { Settings, CreditCard, Wrench } from 'lucide-react';

const AccountSettings = () => {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <div className="text-right">
          <h1 className="text-3xl font-bold">إدارة الحسابات</h1>
          <p className="text-gray-500 mt-1">إدارة الإعدادات العامة للمنصة</p>
        </div>
      </div>
      
      <Tabs defaultValue="platform" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="platform" className="flex items-center gap-2">
            <Settings size={16} />
            معلومات المنصة
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex items-center gap-2">
            <CreditCard size={16} />
            إعدادات الدفع
          </TabsTrigger>
          <TabsTrigger value="maintenance" className="flex items-center gap-2">
            <Wrench size={16} />
            الصيانة والإشعارات
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="platform">
          <Card>
            <CardHeader>
              <CardTitle className="text-right">معلومات المنصة</CardTitle>
              <CardDescription className="text-right">
                إدارة المعلومات الأساسية للمنصة والسياسات
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PlatformInfo />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle className="text-right">إعدادات الدفع والاشتراكات</CardTitle>
              <CardDescription className="text-right">
                إدارة أنظمة الدفع والاشتراكات
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PaymentSettings />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="maintenance">
          <Card>
            <CardHeader>
              <CardTitle className="text-right">الصيانة والإشعارات النظامية</CardTitle>
              <CardDescription className="text-right">
                إدارة تواريخ الصيانة والإشعارات العامة
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MaintenanceSettings />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default AccountSettings;
