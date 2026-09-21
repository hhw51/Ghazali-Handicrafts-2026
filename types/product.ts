export interface Category {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  long_description: string | null;
  price: number;
  size: string | null;
  in_stock: boolean;
  images: string[];
  colors: string | null;
  category_id: string | null;
  weight: number;
  tags: string[];
  created_at: string;
  updated_at: string;
  category?: Category | null;
}

export interface ProductFilter {
  categorySlug?: string;
  material?: string;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  searchQuery?: string;
  sortBy?: 'newest' | 'price-asc' | 'price-desc';
}

export interface Review {
  id: string;
  product_id: string;
  customer_name: string;
  customer_city: string | null;
  rating: number;
  comment: string | null;
  photo_urls: string[];
  is_verified: boolean;
  created_at: string;
  product?: {
    name: string;
    slug: string;
    images: string[];
  };
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  starDistribution: Record<number, number>;
}
