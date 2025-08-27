
import React from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, Plus, Image } from "lucide-react";
import BannerUploader from "@/components/gallery/BannerUploader";
import BannerGrid from "@/components/gallery/BannerGrid";
import { useMedicalBanners } from "@/hooks/useMedicalBanners";

const Gallery = () => {
  const {
    banners,
    isLoading,
    createBanner,
    updateBanner,
    deleteBanner,
    toggleActive,
    isCreating,
    isUpdating,
    isDeleting,
    isToggling,
  } = useMedicalBanners();

  const activeBanners = banners.filter(banner => banner.is_active);
  const inactiveBanners = banners.filter(banner => !banner.is_active);
  const expiredBanners = banners.filter(banner => 
    banner.expires_at && new Date(banner.expires_at) < new Date()
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* العنوان والإحصائيات */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-right">إدارة البانرات الطبية</h1>
            <p className="text-muted-foreground text-right">
              قم بإدارة البانرات الإعلانية والترويجية للمنصة الطبية
            </p>
          </div>
          
          <div className="flex gap-2">
            <Badge variant="default" className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              مفعل: {activeBanners.length}
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <EyeOff className="h-3 w-3" />
              معطل: {inactiveBanners.length}
            </Badge>
            {expiredBanners.length > 0 && (
              <Badge variant="destructive" className="flex items-center gap-1">
                منتهي الصلاحية: {expiredBanners.length}
              </Badge>
            )}
          </div>
        </div>

        {/* التبويبات */}
        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              إضافة بانر جديد
            </TabsTrigger>
            <TabsTrigger value="manage" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              إدارة البانرات ({banners.length})
            </TabsTrigger>
          </TabsList>

          {/* إضافة بانر جديد */}
          <TabsContent value="upload">
            <BannerUploader 
              onUpload={createBanner} 
              isLoading={isCreating} 
            />
          </TabsContent>

          {/* إدارة البانرات */}
          <TabsContent value="manage">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Image className="h-5 w-5" />
                  جميع البانرات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <BannerGrid 
                  banners={banners}
                  isLoading={isLoading}
                  onDelete={deleteBanner}
                  onToggleActive={toggleActive}
                  onUpdate={(id, data) => updateBanner({ id, data })}
                  isDeleting={isDeleting}
                  isToggling={isToggling}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Gallery;
