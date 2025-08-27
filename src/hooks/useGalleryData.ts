import { useEffect, useState } from "react";
import { listBanners, resolveImageUrl } from "@/services/banners";
import { MediaItem } from "@/types/media";

export const useGalleryData = () => {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    setError(null);
    listBanners().then(({ data, error }) => {
      if (!mounted) return;
      if (error) {
        setError(error.message);
        setIsLoading(false);
        return;
      }
      const mapped: MediaItem[] = (data?.data ?? []).map((b) => ({
        id: String(b.id),
        title: b.title,
        type: 'image',
        url: resolveImageUrl(b.image_url),
        thumbnailUrl: resolveImageUrl(b.image_url),
        createdAt: b.created_at ?? new Date().toISOString(),
        size: 0,
      }));
      setItems(mapped);
      setIsLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, []);

  return { items, setItems, isDetailsDialogOpen, setIsDetailsDialogOpen, isLoading, error };
};