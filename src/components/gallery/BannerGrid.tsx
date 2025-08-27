import React, { useState } from 'react';
import { Eye, EyeOff, Edit, Trash2, ExternalLink, Calendar, MoreVertical } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { MedicalBanner } from '@/types/banner';
import BannerEditDialog from './BannerEditDialog';

interface BannerGridProps {
  banners: MedicalBanner[];
  isLoading: boolean;
  onDelete: (id: number) => void;
  onToggleActive: (id: number) => void;
  onUpdate: (id: number, data: any) => void;
  isDeleting: boolean;
  isToggling: boolean;
}

const BannerGrid = ({ 
  banners, 
  isLoading, 
  onDelete, 
  onToggleActive, 
  onUpdate,
  isDeleting,
  isToggling 
}: BannerGridProps) => {
  const [editingBanner, setEditingBanner] = useState<MedicalBanner | null>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isExpired = (expiresAt?: string) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  const getImageUrl = (imageUrl: string) => {
    // إذا كان الرابط يبدأ بـ http أو https، استخدمه كما هو
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    // إذا كان الرابط يبدأ بـ /storage، أضف رابط الخادم
    if (imageUrl.startsWith('/storage') || imageUrl.startsWith('storage')) {
      return `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://127.0.0.1:8000'}/${imageUrl.replace(/^\//, '')}`;
    }
    // في الحالات الأخرى، افترض أنه رابط محلي
    return `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://127.0.0.1:8000'}/storage/${imageUrl}`;
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <CardContent className="p-4 space-y-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <div className="flex justify-between">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (banners.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground">
          <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">لا توجد بانرات</h3>
          <p>لم يتم إنشاء أي بانرات بعد. قم بإضافة أول بانر لك!</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {banners.map((banner) => (
          <Card key={banner.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
            {/* صورة البانر */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={getImageUrl(banner.image_url)}
                alt={banner.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.svg';
                }}
              />
              
              {/* أيقونة الرابط الخارجي */}
              {banner.link && (
                <div className="absolute top-2 left-2">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <ExternalLink className="h-3 w-3" />
                    رابط
                  </Badge>
                </div>
              )}

              {/* حالة البانر */}
              <div className="absolute top-2 right-2">
                <Badge 
                  variant={banner.is_active ? (isExpired(banner.expires_at) ? "destructive" : "default") : "secondary"}
                  className="flex items-center gap-1"
                >
                  {banner.is_active ? (
                    isExpired(banner.expires_at) ? (
                      <>
                        <EyeOff className="h-3 w-3" />
                        منتهي الصلاحية
                      </>
                    ) : (
                      <>
                        <Eye className="h-3 w-3" />
                        مفعل
                      </>
                    )
                  ) : (
                    <>
                      <EyeOff className="h-3 w-3" />
                      معطل
                    </>
                  )}
                </Badge>
              </div>

              {/* قائمة الخيارات */}
              <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setEditingBanner(banner)}>
                      <Edit className="h-4 w-4 mr-2" />
                      تعديل
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onToggleActive(banner.id)}
                      disabled={isToggling}
                    >
                      {banner.is_active ? (
                        <>
                          <EyeOff className="h-4 w-4 mr-2" />
                          تعطيل
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4 mr-2" />
                          تفعيل
                        </>
                      )}
                    </DropdownMenuItem>
                    {banner.link && (
                      <DropdownMenuItem asChild>
                        <a href={banner.link} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          زيارة الرابط
                        </a>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          حذف
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
                          <AlertDialogDescription>
                            هل أنت متأكد من حذف البانر "{banner.title}"؟ هذا الإجراء لا يمكن التراجع عنه.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>إلغاء</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => onDelete(banner.id)}
                            disabled={isDeleting}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            {isDeleting ? 'جاري الحذف...' : 'حذف'}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* محتوى البانر */}
            <CardContent className="p-4">
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-lg line-clamp-2 text-right">{banner.title}</h3>
                  <p className="text-sm text-muted-foreground text-right">
                    تم الإنشاء: {formatDate(banner.created_at)}
                  </p>
                </div>

                {banner.expires_at && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {isExpired(banner.expires_at) ? 'انتهت في:' : 'تنتهي في:'} {formatDate(banner.expires_at)}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={banner.is_active}
                      onCheckedChange={() => onToggleActive(banner.id)}
                      disabled={isToggling}
                    />
                    <span className="text-sm text-muted-foreground">
                      {banner.is_active ? 'مفعل' : 'معطل'}
                    </span>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingBanner(banner)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    تعديل
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* حوار التعديل */}
      {editingBanner && (
        <BannerEditDialog
          banner={editingBanner}
          open={!!editingBanner}
          onOpenChange={(open) => !open && setEditingBanner(null)}
          onUpdate={onUpdate}
        />
      )}
    </>
  );
};

export default BannerGrid;