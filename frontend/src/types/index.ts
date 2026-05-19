export interface Region {
  id: string;
  name_en: string;
  name_th: string;
  slug: string;
  center_lat: number;
  center_lng: number;
  color: string;
  post_count?: number;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  published_date: string;
  cover_image: string;
  excerpt: string;
  content: string;
  region: Region;
  lat: number;
  lng: number;
  tags: string[];
}
