import { createPublicClient as createClient } from "@/lib/supabase/public";
import {
  blogPosts as seedPosts,
  categories as seedCategories,
  products as seedProducts,
  projects as seedProjects,
  reviews as seedReviews,
  servicePackages as seedServices,
  team as seedTeam,
} from "@/lib/seed";
import type {
  BlogPost,
  Category,
  Product,
  Project,
  Review,
  ServicePackage,
  TeamMember,
} from "@/lib/types";

/**
 * Single data-access layer. Reads from Supabase when configured, otherwise
 * falls back to in-memory seed data so the app fully renders with no backend.
 */

export async function getProducts(opts?: {
  category?: string;
  sort?: string;
  search?: string;
  featured?: boolean;
}): Promise<Product[]> {
  const supabase = createClient();
  let list: Product[];

  if (supabase) {
    const { data } = await supabase.from("products").select("*, category:categories(*)");
    list = (data as Product[]) ?? [];
  } else {
    list = seedProducts.map((p) => ({
      ...p,
      category: seedCategories.find((c) => c.id === p.category_id) ?? null,
    }));
  }

  if (opts?.category) list = list.filter((p) => p.category?.slug === opts.category);
  if (opts?.featured) list = list.filter((p) => p.featured);
  if (opts?.search) {
    const q = opts.search.toLowerCase();
    list = list.filter(
      (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    );
  }
  switch (opts?.sort) {
    case "price-asc": list = [...list].sort((a, b) => a.price - b.price); break;
    case "price-desc": list = [...list].sort((a, b) => b.price - a.price); break;
    case "rating": list = [...list].sort((a, b) => b.rating - a.rating); break;
    default: list = [...list].sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
  }
  return list;
}

export async function getProduct(slug: string): Promise<Product | null> {
  const supabase = createClient();
  if (supabase) {
    const { data } = await supabase
      .from("products")
      .select("*, category:categories(*)")
      .eq("slug", slug)
      .single();
    return (data as Product) ?? null;
  }
  const p = seedProducts.find((x) => x.slug === slug);
  if (!p) return null;
  return { ...p, category: seedCategories.find((c) => c.id === p.category_id) ?? null };
}

export async function getCategories(): Promise<Category[]> {
  const supabase = createClient();
  if (supabase) {
    const { data } = await supabase.from("categories").select("*").order("name");
    return (data as Category[]) ?? [];
  }
  return seedCategories;
}

export async function getReviews(productId: string): Promise<Review[]> {
  const supabase = createClient();
  if (supabase) {
    const { data } = await supabase
      .from("reviews")
      .select("*")
      .eq("product_id", productId)
      .order("created_at", { ascending: false });
    return (data as Review[]) ?? [];
  }
  return seedReviews.filter((r) => r.product_id === productId);
}

export async function getProjects(featured?: boolean): Promise<Project[]> {
  const supabase = createClient();
  let list: Project[];
  if (supabase) {
    const { data } = await supabase.from("projects").select("*").order("year", { ascending: false });
    list = (data as Project[]) ?? [];
  } else {
    list = seedProjects;
  }
  return featured ? list.filter((p) => p.featured) : list;
}

export async function getProject(slug: string): Promise<Project | null> {
  const supabase = createClient();
  if (supabase) {
    const { data } = await supabase.from("projects").select("*").eq("slug", slug).single();
    return (data as Project) ?? null;
  }
  return seedProjects.find((p) => p.slug === slug) ?? null;
}

export async function getTeam(): Promise<TeamMember[]> {
  const supabase = createClient();
  if (supabase) {
    const { data } = await supabase.from("team_members").select("*").order("sort_order");
    return (data as TeamMember[]) ?? [];
  }
  return [...seedTeam].sort((a, b) => a.sort_order - b.sort_order);
}

export async function getServices(): Promise<ServicePackage[]> {
  const supabase = createClient();
  if (supabase) {
    const { data } = await supabase.from("service_packages").select("*").order("sort_order");
    return (data as ServicePackage[]) ?? [];
  }
  return [...seedServices].sort((a, b) => a.sort_order - b.sort_order);
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const supabase = createClient();
  if (supabase) {
    const { data } = await supabase
      .from("blog_posts")
      .select("*")
      .order("published_at", { ascending: false });
    return (data as BlogPost[]) ?? [];
  }
  return [...seedPosts].sort((a, b) => +new Date(b.published_at) - +new Date(a.published_at));
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const supabase = createClient();
  if (supabase) {
    const { data } = await supabase.from("blog_posts").select("*").eq("slug", slug).single();
    return (data as BlogPost) ?? null;
  }
  return seedPosts.find((p) => p.slug === slug) ?? null;
}
