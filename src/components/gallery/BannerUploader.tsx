import React, { useState, useRef } from 'react';
import { Upload, X, Image, Calendar, Link2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreateBannerRequest } from '@/types/banner';

interface BannerUploaderProps {
  onUpload: (data: CreateBannerRequest) => void;
  isLoading: boolean;
}

const BannerUploader = ({ onUpload, isLoading }: BannerUploaderProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [formData, setFormData] = useState({
    title: '',
    link: '',
    is_active: true,
    expires_at: '',
  });

  const inputRef = useRef<HTMLInputElement>(null);

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
    if (!selectedFile || !formData.title.trim()) {
      return;
    }

    const uploadData: CreateBannerRequest = {
      title: formData.title,
      image: selectedFile,
      link: formData.link || undefined,
      is_active: formData.is_active,
      expires_at: formData.expires_at || undefined,
    };

    onUpload(uploadData);
    
    // إعادة تعيين النموذج
    setSelectedFile(null);
    setPreviewUrl('');
    setFormData({
      title: '',
      link: '',
      is_active: true,
      expires_at: '',
    });
    if (inputRef.current) {
      inputRef.current.value = '';
    }
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          إضافة بانر طبي جديد
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* منطقة رفع الصورة */}
        <div className="space-y-4">
          <Label>صورة البانر</Label>
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
              dragActive
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25 hover:border-primary hover:bg-primary/5'
            }`}
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
            
            {!selectedFile ? (
              <div className="space-y-2">
                <Image className="h-12 w-12 mx-auto text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">اضغط لاختيار صورة أو اسحبها هنا</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG أو WEBP (الحد الأقصى 2MB)</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative inline-block">
                  <img
                    src={previewUrl}
                    alt="معاينة"
                    className="max-h-40 rounded-lg shadow-md"
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
            )}
          </div>
        </div>

        {/* معلومات البانر */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">عنوان البانر *</Label>
            <Input
              id="title"
              placeholder="عنوان البانر"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="text-right"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="link">رابط البانر (اختياري)</Label>
            <div className="relative">
              <Link2 className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="link"
                placeholder="https://example.com"
                value={formData.link}
                onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
                className="text-right pr-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expires_at">تاريخ انتهاء الصلاحية (اختياري)</Label>
            <div className="relative">
              <Calendar className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="expires_at"
                type="datetime-local"
                value={formData.expires_at}
                onChange={(e) => setFormData(prev => ({ ...prev, expires_at: e.target.value }))}
                className="text-right pr-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="is_active">حالة البانر</Label>
            <div className="flex items-center gap-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
              />
              <span className="text-sm text-muted-foreground">
                {formData.is_active ? (
                  <span className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    مفعل
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <EyeOff className="h-4 w-4" />
                    معطل
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* أزرار التحكم */}
        <div className="flex gap-2 justify-end">
          <Button
            onClick={handleSubmit}
            disabled={!selectedFile || !formData.title.trim() || isLoading}
            className="min-w-[120px]"
          >
            {isLoading ? 'جاري الرفع...' : 'إضافة البانر'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BannerUploader;