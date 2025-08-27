import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, Link2, Calendar, Eye, EyeOff } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { MedicalBanner, UpdateBannerRequest } from '@/types/banner';

interface BannerEditDialogProps {
  banner: MedicalBanner;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (id: number, data: UpdateBannerRequest) => void;
}

const BannerEditDialog = ({ banner, open, onOpenChange, onUpdate }: BannerEditDialogProps) => {
  const [formData, setFormData] = useState({
    title: banner.title,
    link: banner.link || '',
    expires_at: banner.expires_at ? banner.expires_at.split('.')[0] : '', // إزالة الميلي ثانية
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [dragActive, setDragActive] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (banner) {
      setFormData({
        title: banner.title,
        link: banner.link || '',
        expires_at: banner.expires_at ? banner.expires_at.split('.')[0] : '',
      });
      setSelectedFile(null);
      setPreviewUrl('');
    }
  }, [banner]);

  const getImageUrl = (imageUrl: string) => {
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    if (imageUrl.startsWith('/storage') || imageUrl.startsWith('storage')) {
      return `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://127.0.0.1:8000'}/${imageUrl.replace(/^\//, '')}`;
    }
    return `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://127.0.0.1:8000'}/storage/${imageUrl}`;
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
      }
    }
  };

  const handleSubmit = () => {
    const updateData: UpdateBannerRequest = {
      title: formData.title,
      link: formData.link || undefined,
      expires_at: formData.expires_at || undefined,
    };

    if (selectedFile) {
      updateData.image = selectedFile;
    }

    onUpdate(banner.id, updateData);
    onOpenChange(false);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>تعديل البانر</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* منطقة رفع الصورة */}
          <div className="space-y-4">
            <Label>صورة البانر</Label>
            
            {/* الصورة الحالية */}
            {!selectedFile && (
              <div className="relative">
                <img
                  src={getImageUrl(banner.image_url)}
                  alt={banner.title}
                  className="w-full h-32 object-cover rounded-lg"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.svg';
                  }}
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg opacity-0 hover:opacity-100 transition-opacity">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => inputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    تغيير الصورة
                  </Button>
                </div>
              </div>
            )}

            {/* منطقة الرفع */}
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                dragActive
                  ? 'border-primary bg-primary/5'
                  : 'border-muted-foreground/25 hover:border-primary hover:bg-primary/5'
              } ${selectedFile ? '' : 'hidden'}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
            >
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />
              
              {selectedFile ? (
                <div className="space-y-4">
                  <div className="relative inline-block">
                    <img
                      src={previewUrl}
                      alt="معاينة"
                      className="max-h-32 rounded-lg shadow-md"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFile();
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>{selectedFile.name}</p>
                    <p>{formatFileSize(selectedFile.size)}</p>
                  </div>
                </div>
              ) : (
                <Button variant="outline" onClick={() => inputRef.current?.click()}>
                  <Upload className="h-4 w-4 mr-2" />
                  اختيار صورة جديدة
                </Button>
              )}
            </div>

            {!selectedFile && (
              <Button variant="outline" onClick={() => inputRef.current?.click()} className="w-full">
                <Upload className="h-4 w-4 mr-2" />
                اختيار صورة جديدة
              </Button>
            )}
          </div>

          {/* معلومات البانر */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">عنوان البانر *</Label>
              <Input
                id="edit-title"
                placeholder="عنوان البانر"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="text-right"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-link">رابط البانر (اختياري)</Label>
              <div className="relative">
                <Link2 className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="edit-link"
                  placeholder="https://example.com"
                  value={formData.link}
                  onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
                  className="text-right pr-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-expires_at">تاريخ انتهاء الصلاحية (اختياري)</Label>
              <div className="relative">
                <Calendar className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="edit-expires_at"
                  type="datetime-local"
                  value={formData.expires_at}
                  onChange={(e) => setFormData(prev => ({ ...prev, expires_at: e.target.value }))}
                  className="text-right pr-10"
                />
              </div>
            </div>
          </div>

          {/* أزرار التحكم */}
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              إلغاء
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!formData.title.trim()}
            >
              حفظ التغييرات
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BannerEditDialog;