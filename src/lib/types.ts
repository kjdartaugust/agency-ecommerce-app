export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number; // cents
  compare_at_price: number | null;
  currency: string;
  image_url: string;
  gallery: string[] | null;
  category_id: string | null;
  stock: number;
  featured: boolean;
  rating: number;
  review_count: number;
  created_at: string;
  category?: Category | null;
};

export type Review = {
  id: string;
  product_id: string;
  author_name: string;
  rating: number;
  title: string | null;
  body: string;
  created_at: string;
};

export type Project = {
  id: string;
  title: string;
  slug: string;
  client: string;
  category: string;
  summary: string;
  cover_url: string;
  gallery: string[] | null;
  year: number;
  services: string[] | null;
  featured: boolean;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar_url: string;
  socials: Record<string, string> | null;
  sort_order: number;
};

export type ServicePackage = {
  id: string;
  name: string;
  tagline: string;
  price: number; // cents, 0 = custom
  billing: string;
  features: string[];
  popular: boolean;
  sort_order: number;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_url: string;
  author: string;
  tag: string;
  read_minutes: number;
  published_at: string;
};

export type OrderStatus = "pending" | "paid" | "fulfilled" | "cancelled";

export type Order = {
  id: string;
  user_id: string | null;
  email: string;
  status: OrderStatus;
  total: number;
  currency: string;
  items: OrderItem[];
  shipping_name: string | null;
  shipping_address: string | null;
  stripe_session_id: string | null;
  created_at: string;
};

export type OrderItem = {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
};

export type Inquiry = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  budget: string | null;
  service: string | null;
  message: string;
  status: string;
  created_at: string;
};

export type CartItem = {
  productId: string;
  name: string;
  slug: string;
  price: number;
  image_url: string;
  quantity: number;
  stock: number;
};
