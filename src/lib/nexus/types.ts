export type SellerLevel = "New Seller" | "Level 1" | "Level 2" | "Top Rated";

export type Seller = {
  id: string;
  name: string;
  slug: string;
  avatar_url: string;
  cover_url: string;
  tagline: string;
  bio: string;
  level: SellerLevel;
  verified: boolean;
  rating: number;
  review_count: number;
  response_time: string;
  location: string;
  member_since: string;
  languages: string[];
  skills: string[];
  completed_orders: number;
};

export type ServiceTier = {
  name: "Basic" | "Standard" | "Premium";
  price: number; // cents
  delivery_days: number;
  revisions: string;
  features: string[];
};

export type Service = {
  id: string;
  slug: string;
  title: string;
  seller_id: string;
  category: string;
  cover_url: string;
  gallery: string[];
  rating: number;
  review_count: number;
  delivery_days: number;
  starting_price: number; // cents
  description: string;
  tiers: ServiceTier[];
  verified: boolean;
  featured: boolean;
};

export type NexusCategory = {
  id: string;
  name: string;
  slug: string;
  icon: string; // lucide-react icon name
  count: number;
  kind: "service" | "product" | "both";
};

export type NexusReview = {
  id: string;
  target_id: string;
  author_name: string;
  author_avatar: string;
  country: string;
  rating: number;
  body: string;
  created_at: string;
};

export type PlatformStats = {
  sellers: number;
  products: number;
  transactions: number;
  countries: number;
};
