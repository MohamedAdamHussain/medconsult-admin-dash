
import { useState } from 'react';
import { MediaItem } from '@/types/media';
import { Eye, Trash2, Move } from 'lucide-react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import MediaPreview from './MediaPreview';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

interface MediaGridProps {
  items: MediaItem[];
  isLoading: boolean;
  onDelete: (id: string) => void;
  onReorder: (items: MediaItem[]) => void;
}

const MediaGrid = ({ items, isLoading, onDelete, onReorder }: MediaGridProps) => {
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);

  const handlePreview = (item: MediaItem) => {
    setPreviewItem(item);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleOnDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const itemsCopy = Array.from(items);
    const [reorderedItem] = itemsCopy.splice(result.source.index, 1);
    itemsCopy.splice(result.destination.index, 0, reorderedItem);
    
    onReorder(itemsCopy);
  };

  if (isLoading && items.length === 0) {
    return (
      <div className="py-10 text-center">
        <p className="text-muted-foreground">جاري تحميل الملفات...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="py-10 text-center">
        <p className="text-muted-foreground">لا يوجد ملفات محملة بعد</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 text-right">الوسائط المحملة</h3>
      
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="media-items">
          {(provided) => (
            <div 
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {items.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="relative group"
                    >
                      <div className="border rounded-lg overflow-hidden bg-gray-50">
                        {/* صورة مصغرة */}
                        <div className="relative aspect-square flex items-center justify-center">
                          {item.type === 'image' ? (
                            <img
                              src={item.thumbnailUrl}
                              alt={item.title}
                              className="object-cover w-full h-full"
                            />
                          ) : item.type === 'video' ? (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <FileVideo className="h-10 w-10 text-gray-500" />
                            </div>
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <File className="h-10 w-10 text-gray-500" />
                            </div>
                          )}
                          
                          {/* النوع في الزاوية */}
                          <span className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-2 py-1 rounded-md">
                            {item.type === 'image' ? 'صورة' : item.type === 'video' ? 'فيديو' : item.fileType || 'ملف'}
                          </span>
                          
                          {/* زر مقبض السحب */}
                          <div 
                            className="absolute top-1 right-1 bg-black/70 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity cursor-move"
                            {...provided.dragHandleProps}
                          >
                            <Move className="h-4 w-4" />
                          </div>
                        </div>
                        
                        {/* تفاصيل الملف والأزرار */}
                        <div className="p-2 text-right">
                          <p className="font-medium text-sm truncate" dir="auto">{item.title}</p>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(item.size)} • {formatDate(item.createdAt)}
                          </p>
                          
                          <div className="flex justify-end mt-2 gap-1">
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => handlePreview(item)}
                              className="h-8 w-8 p-0"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => onDelete(item.id)}
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      
      {/* معاينة الصور والفيديو */}
      <Dialog open={!!previewItem} onOpenChange={(open) => !open && setPreviewItem(null)}>
        <DialogContent className="sm:max-w-3xl">
          {previewItem && <MediaPreview item={previewItem} />}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MediaGrid;
