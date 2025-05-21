
import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import MediaUploader from "@/components/gallery/MediaUploader";
import MediaGrid from "@/components/gallery/MediaGrid";
import { MediaItem } from "@/types/media";
import { toast } from "sonner";

const Gallery = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // في بيئة إنتاجية حقيقية، هذه البيانات ستأتي من قاعدة بيانات
  useEffect(() => {
    // محاكاة لجلب البيانات من الخادم
    setIsLoading(true);
    
    // بيانات تجريبية (في الإنتاج ستأتي من API)
    const demoData: MediaItem[] = [
      {
        id: '1',
        title: 'صورة طبيب',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        thumbnailUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        createdAt: new Date().toISOString(),
        size: 1024 * 500, // 500KB
      },
      {
        id: '2',
        title: 'فيديو توضيحي',
        type: 'video',
        url: 'https://player.vimeo.com/external/403295268.sd.mp4?s=3446f36caba72ff9967a77939c9e4ac3feac9fd0&profile_id=164&oauth2_token_id=57447761',
        thumbnailUrl: 'https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        createdAt: new Date().toISOString(),
        size: 1024 * 1024 * 5, // 5MB
      },
      {
        id: '3',
        title: 'دليل المستخدم',
        type: 'file',
        url: '/placeholder.svg',
        thumbnailUrl: '/placeholder.svg',
        createdAt: new Date().toISOString(),
        size: 1024 * 1024 * 2, // 2MB
        fileType: 'pdf'
      }
    ];
    
    setTimeout(() => {
      setMediaItems(demoData);
      setIsLoading(false);
    }, 800);
  }, []);

  const handleUpload = (files: File[]) => {
    setIsLoading(true);
    
    // محاكاة لعملية الرفع
    setTimeout(() => {
      const newItems: MediaItem[] = files.map((file, index) => {
        const isImage = file.type.startsWith('image/');
        const isVideo = file.type.startsWith('video/');
        const isPDF = file.type === 'application/pdf';
        
        let fileType: 'image' | 'video' | 'file' = 'file';
        if (isImage) fileType = 'image';
        if (isVideo) fileType = 'video';
        
        // إنشاء URL مؤقت للملف المحلي
        const url = URL.createObjectURL(file);
        
        return {
          id: `new-${Date.now()}-${index}`,
          title: file.name,
          type: fileType,
          url: url,
          thumbnailUrl: isImage ? url : (isVideo ? '/placeholder.svg' : '/placeholder.svg'),
          createdAt: new Date().toISOString(),
          size: file.size,
          fileType: isPDF ? 'pdf' : undefined
        };
      });
      
      setMediaItems(prev => [...newItems, ...prev]);
      setIsLoading(false);
      toast.success(`تم رفع ${files.length} ملف بنجاح`);
    }, 1500);
  };

  const handleDelete = (id: string) => {
    setMediaItems(prev => prev.filter(item => item.id !== id));
    toast.success('تم حذف الملف بنجاح');
  };

  const handleReorder = (items: MediaItem[]) => {
    setMediaItems(items);
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
              items={mediaItems} 
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
