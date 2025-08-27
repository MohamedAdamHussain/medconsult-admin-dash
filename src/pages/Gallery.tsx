
import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import MediaUploader from "@/components/gallery/MediaUploader";
import MediaGrid from "@/components/gallery/MediaGrid";
import { MediaItem } from "@/types/media";
import { toast } from "sonner";
import { useGalleryData } from "@/hooks/useGalleryData";
import { createBanner, deleteBanner, resolveImageUrl } from "@/services/banners";

const Gallery = () => {
  const { items, setItems, isLoading } = useGalleryData();

  const handleUpload = async (
    itemsToUpload: { file: File; meta: { title: string; link?: string; is_active?: boolean; expires_at?: string | null } }[]
  ) => {
    if (itemsToUpload.length === 0) return;
    let successCount = 0;
    for (const { file, meta } of itemsToUpload) {
      const { data, error } = await createBanner({
        title: meta.title || file.name,
        image: file,
        link: meta.link ?? undefined,
        is_active: meta.is_active,
        expires_at: meta.expires_at ?? undefined,
      });
      if (error) {
        toast.error(error.message);
        continue;
      }
      successCount += 1;
      const newItem: MediaItem = {
        id: String(data!.id),
        title: data!.title,
        type: 'image',
        url: resolveImageUrl(data!.image_url),
        thumbnailUrl: resolveImageUrl(data!.image_url),
        createdAt: data!.created_at ?? new Date().toISOString(),
        size: 0,
      };
      setItems((prev) => [newItem, ...prev]);
    }
    if (successCount > 0) {
      toast.success(`تم رفع ${successCount} ملف بنجاح`);
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await deleteBanner(Number(id));
    if (error) {
      toast.error(error.message);
      return;
    }
    setItems(prev => prev.filter(item => item.id !== id));
    toast.success('تم حذف الملف بنجاح');
  };

  const handleReorder = (reordered: MediaItem[]) => {
    setItems(reordered);
    toast.success('تم إعادة ترتيب الملفات بنجاح');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-right">إدارة الوسائط</h1>
            <p className="text-muted-foreground text-right">
              قم بتحميل وإدارة الصور والفيديوهات والملفات المستخدمة في التطبيق
            </p>
          </div>
        </div>

        <Card>
          <CardContent className="pt-6">
            <MediaUploader onUpload={handleUpload} isLoading={isLoading} />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <MediaGrid 
              items={items} 
              isLoading={isLoading} 
              onDelete={handleDelete}
              onReorder={handleReorder}
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Gallery;
