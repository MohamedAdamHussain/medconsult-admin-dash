export default interface GalleryItem {
  id: number;
  title: string;
  imageSrc: string;
  link?: string;
  expiresAt?: Date;
}