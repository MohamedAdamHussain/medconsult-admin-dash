import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Download, Send } from "lucide-react";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { Subscription } from "@/types/subscriptions.ts";
import SubscriptionsList from "@/components/subscriptions/SubscriptionsList";
import SubscriptionStats from "@/components/subscriptions/SubscriptionStats";
import { toast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
const Subscriptions: React.FC = () => {
  const {
    subscriptions,
    getSubscriptionStats,
    renewSubscription,
    cancelSubscription,
    toggleAutoRenew,
  } = useSubscriptions();

  const stats = getSubscriptionStats();

  const handleRenewSubscription = (id: string) => {
    if (confirm("هل أنت متأكد من تجديد هذا الاشتراك؟")) {
      renewSubscription(id);
      toast({
        title: "تم التجديد",
        description: "تم تجديد الاشتراك بنجاح",
      });
    }
  };

  const handleCancelSubscription = (id: string) => {
    if (confirm("هل أنت متأكد من إلغاء هذا الاشتراك؟")) {
      cancelSubscription(id);
      toast({
        title: "تم الإلغاء",
        description: "تم إلغاء الاشتراك بنجاح",
        variant: "destructive",
      });
    }
  };

  const handleToggleAutoRenew = (id: string) => {
    toggleAutoRenew(id);
    toast({
      title: "تم التحديث",
      description: "تم تحديث إعدادات التجديد التلقائي",
    });
  };

  const handleViewDetails = (subscription: Subscription) => {
    // يمكن إضافة مودال لعرض تفاصيل الاشتراك
    console.log("View subscription details:", subscription);
    toast({
      title: "تفاصيل الاشتراك",
      description: `عرض تفاصيل اشتراك ${subscription.userName}`,
    });
  };

  const handleSendRenewalReminder = () => {
    const expiringSoon = subscriptions.filter((sub) => {
      const endDate = new Date(sub.endDate);
      const now = new Date();
      const diffDays = Math.ceil(
        (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );
      return diffDays <= 7 && diffDays >= 0 && sub.status === "active";
    });

    toast({
      title: "تم الإرسال",
      description: `تم إرسال تنبيهات التجديد إلى ${expiringSoon.length} مشترك`,
    });
  };

  const handleExportData = () => {
    // يمكن إضافة تصدير البيانات هنا
    toast({
      title: "جاري التصدير",
      description: "سيتم تحميل الملف قريباً",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">إدارة الاشتراكات</h1>
            <p className="text-muted-foreground">
              متابعة وإدارة اشتراكات المستخدمين
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleSendRenewalReminder}>
              <Send className="w-4 h-4 ml-2" />
              إرسال تنبيهات التجديد
            </Button>
            <Button variant="outline" onClick={handleExportData}>
              <Download className="w-4 h-4 ml-2" />
              تصدير البيانات
            </Button>
            <Button variant="outline">
              <RefreshCw className="w-4 h-4 ml-2" />
              تحديث
            </Button>
          </div>
        </div>

        {/* Statistics */}
        <SubscriptionStats stats={stats} />

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="unified-card p-4">
            <h3 className="font-semibold mb-2">الاشتراكات المنتهية اليوم</h3>
            <div className="text-2xl font-bold text-red-600">
              {
                subscriptions.filter((sub) => {
                  const today = new Date().toISOString().split("T")[0];
                  return sub.endDate === today;
                }).length
              }
            </div>
            <p className="text-sm text-muted-foreground">يحتاج لمتابعة</p>
          </div>

          <div className="unified-card p-4">
            <h3 className="font-semibold mb-2">الاشتراكات الجديدة اليوم</h3>
            <div className="text-2xl font-bold text-green-600">
              {
                subscriptions.filter((sub) => {
                  const today = new Date().toISOString().split("T")[0];
                  return sub.createdAt.split("T")[0] === today;
                }).length
              }
            </div>
            <p className="text-sm text-muted-foreground">اشتراكات جديدة</p>
          </div>
          <div className="unified-card p-4">
            <h3 className="font-semibold mb-2">التجديدات المتوقعة</h3>
            <div className="text-2xl font-bold text-blue-600">
              {
                subscriptions.filter(
                  (sub) => sub.autoRenew && sub.status === "active"
                ).length
              }
            </div>
            <p className="text-sm text-muted-foreground">تجديد تلقائي مفعل</p>
          </div>
        </div>

        {/* Subscriptions List */}
        <SubscriptionsList
          subscriptions={subscriptions}
          onRenew={handleRenewSubscription}
          onCancel={handleCancelSubscription}
          onToggleAutoRenew={handleToggleAutoRenew}
          onViewDetails={handleViewDetails}
        />
      </div>
    </DashboardLayout>
  );
};

export default Subscriptions;
