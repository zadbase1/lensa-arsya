export interface Photo {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  sort_order: number;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface PackageItem {
  id: string;
  name: string;
  tagline?: string;
  price: string;
  popular?: boolean;
  features: string[];
}

export interface AdminUser {
  username: string;
  password?: string;
}
