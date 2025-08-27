
import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, File, FileImage, FileVideo } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface UploadItemMeta {
  title: string;
  link?: string;
  is_active?: boolean;
  expires_at?: string | null;
}

interface MediaUploaderProps {
  onUpload: (items: { file: File; meta: UploadItemMeta }[]) => void;
  isLoading: boolean;
}

const MediaUploader = ({ onUpload, isLoading }: MediaUploaderProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [metas, setMetas] = useState<UploadItemMeta[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArray = Array.from(e.dataTransfer.files);
      setSelectedFiles(filesArray);
      setMetas(filesArray.map((f) => ({ title: f.name, is_active: true, link: '', expires_at: null })));
      setPreviewOpen(true);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(filesArray);
      setMetas(filesArray.map((f) => ({ title: f.name, is_active: true, link: '', expires_at: null })));
      setPreviewOpen(true);
    }
  };

  const handleSubmit = () => {
    if (selectedFiles.length > 0) {
      const payload = selectedFiles.map((file, idx) => ({ file, meta: metas[idx] ?? { title: file.name } }));
      onUpload(payload);
      setSelectedFiles([]);
      setMetas([]);
      setPreviewOpen(false);
    }
  };

  const handleButtonClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <FileImage className="h-6 w-6 text-blue-500" />;
    } else if (file.type.startsWith('video/')) {
      return <FileVideo className="h-6 w-6 text-purple-500" />;
    } else {
      return <File className="h-6 w-6 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="w-full">
      <div 
        className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center ${
          dragActive ? 'border-primary bg-primary/10' : 'border-gray-300'
        }`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className="h-10 w-10 text-gray-400 mb-2" />
        <h3 className="text-lg font-semibold">اسحب وأفلت الملفات هنا</h3>
        <p className="text-sm text-gray-500 mb-4">أو اضغط للاختيار من جهازك</p>
        
        <Input 
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleChange}
          accept="image/*,video/*,application/pdf"
        />
        
        <Button onClick={handleButtonClick} disabled={isLoading}>
          <Upload className="h-4 w-4 ml-2" />
          اختر الملفات
        </Button>
        
        <p className="text-xs text-gray-500 mt-2">
          يمكنك رفع ملفات الصور والفيديو وملفات PDF 
        </p>
      </div>

      {/* معاينة الملفات قبل الرفع */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-xl text-center">معاينة الملفات قبل الرفع</DialogTitle>
            <DialogDescription className="text-center">
              تحقق من الملفات التي اخترتها قبل رفعها
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[400px] overflow-y-auto space-y-4">
            {selectedFiles.map((file, index) => (
              <div key={index} className="border rounded-md p-3">
                <div className="flex items-center mb-3">
                  {getFileIcon(file)}
                  <div className="flex-1 px-4">
                    <p className="font-medium truncate" dir="auto">{file.name}</p>
                    <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-right">
                  <div>
                    <label className="text-sm">العنوان</label>
                    <Input
                      value={metas[index]?.title ?? ''}
                      onChange={(e) => {
                        const copy = [...metas];
                        copy[index] = { ...(copy[index] ?? {}), title: e.target.value };
                        setMetas(copy);
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-sm">الرابط (اختياري)</label>
                    <Input
                      value={metas[index]?.link ?? ''}
                      onChange={(e) => {
                        const copy = [...metas];
                        copy[index] = { ...(copy[index] ?? {}), link: e.target.value };
                        setMetas(copy);
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-sm">تاريخ الانتهاء (اختياري)</label>
                    <Input
                      type="date"
                      value={(metas[index]?.expires_at ?? '') as string}
                      onChange={(e) => {
                        const copy = [...metas];
                        copy[index] = { ...(copy[index] ?? {}), expires_at: e.target.value || null };
                        setMetas(copy);
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      id={`active-${index}`}
                      type="checkbox"
                      className="h-4 w-4"
                      checked={!!metas[index]?.is_active}
                      onChange={(e) => {
                        const copy = [...metas];
                        copy[index] = { ...(copy[index] ?? {}), is_active: e.target.checked };
                        setMetas(copy);
                      }}
                    />
                    <label htmlFor={`active-${index}`} className="text-sm">مفعل</label>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setPreviewOpen(false)}>
              إلغاء
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? "جاري الرفع..." : `رفع ${selectedFiles.length} ملف`}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MediaUploader;
