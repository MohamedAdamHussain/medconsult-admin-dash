
export interface MediaItem {
  id: string;
  title: string;
  type: 'image' | 'video' | 'file';
  url: string;
  thumbnailUrl: string;
  createdAt: string;
  size: number;
  fileType?: string;
}
