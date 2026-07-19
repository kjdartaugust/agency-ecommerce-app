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

/**
 * How a supplier receives the orders we route to them. Only `api` is machine
 * integrated; the rest are deliberately low-tech so a supplier with nothing but
 * an inbox — or a phone — can still be a fulfilment destination.
 */
export type ChannelType = "api" | "email" | "sheet" | "manual";

export type Supplier = {
  id: string;
  name: string;
  channel_type: ChannelType;
  /** Where routed orders are sent: an email, a webhook/sheet URL, or a phone number for `manual`. */
  contact: string;
  /** Quoted dispatch time, used to show an expected ship date before tracking exists. */
  lead_time_days: number;
  active: boolean;
};

/**
 * Binds a product to a supplier that can fulfil it, at an agreed cost. A product
 * may have several matches; routing picks the lowest `priority` that is active,
 * so re-pointing a product at a new supplier never touches the storefront.
 */
export type Match = {
  id: string;
  product_id: string;
  supplier_id: string;
  /** What we pay the supplier per unit, in cents. Retail price lives on the product. */
  cost: number;
  /** Lower wins. Ties broken by insertion order. */
  priority: number;
};

export type FulfillmentStatus =
  | "pending"
  | "sent"
  | "shipped"
  | "delivered"
  | "failed";

/**
 * One supplier's share of an order. An order splits into as many fulfilments as
 * there are distinct suppliers behind its items, so status is tracked per
 * supplier rather than collapsed onto the order — half an order really can ship
 * while the rest is still pending.
 */
export type Fulfillment = {
  id: string;
  order_id: string;
  supplier_id: string;
  items: FulfillmentItem[];
  /** Sum of cost x quantity for this supplier's items, in cents. */
  cost_total: number;
  status: FulfillmentStatus;
  tracking: string | null;
  created_at: string;
};

export type FulfillmentItem = {
  product_id: string;
  name: string;
  quantity: number;
  /** Unit cost captured at routing time, so later price changes don't rewrite history. */
  cost: number;
};

/**
 * Items an order could not be routed for, because no active supplier matches
 * them. Surfaced to the admin instead of being dropped — an unroutable item is
 * an order nobody is packing.
 */
export type UnroutedItem = {
  product_id: string;
  name: string;
  quantity: number;
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
