
import { MediaItem } from '@/types/media';
import { Button } from "@/components/ui/button";
import { Download } from 'lucide-react';

interface MediaPreviewProps {
  item: MediaItem;
}

const MediaPreview = ({ item }: MediaPreviewProps) => {
  const downloadMedia = () => {
    const link = document.createElement('a');
    link.href = item.url;
    link.download = item.title;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{item.title}</h2>
        <Button variant="outline" size="sm" onClick={downloadMedia}>
          <Download className="h-4 w-4 mr-2" />
          تنزيل
        </Button>
      </div>

      <div className="flex justify-center items-center bg-black/5 rounded-lg p-2 min-h-[300px]">
        {item.type === 'image' ? (
          <img 
            src={item.url} 
            alt={item.title} 
            className="max-w-full max-h-[500px] object-contain"
          />
        ) : item.type === 'video' ? (
          <video 
            src={item.url} 
            controls 
            className="max-w-full max-h-[500px]" 
          />
        ) : item.fileType === 'pdf' ? (
          <div className="text-center">
            <p className="mb-4">معاينة ملف PDF</p>
            <Button onClick={() => window.open(item.url, '_blank')}>
              فتح PDF في صفحة جديدة
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <p>لا يمكن معاينة هذا النوع من الملفات</p>
            <Button variant="secondary" className="mt-4" onClick={downloadMedia}>
              تنزيل الملف
            </Button>
          </div>
        )}
      </div>

      <div className="text-sm text-muted-foreground">
        <p>تاريخ الرفع: {new Date(item.createdAt).toLocaleDateString('ar-SA')}</p>
        <p>النوع: {item.type === 'image' ? 'صورة' : item.type === 'video' ? 'فيديو' : item.fileType || 'ملف'}</p>
        <p>
          الحجم: {
            item.size < 1024 
              ? item.size + ' B' 
              : item.size < 1024 * 1024 
                ? (item.size / 1024).toFixed(1) + ' KB' 
                : (item.size / (1024 * 1024)).toFixed(1) + ' MB'
          }
        </p>
      </div>
    </div>
  );
};

export default MediaPreview;
