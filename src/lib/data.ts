import { createPublicClient as createClient } from "@/lib/supabase/public";
import {
  blogPosts as seedPosts,
  categories as seedCategories,
  matches as seedMatches,
  products as seedProducts,
  projects as seedProjects,
  reviews as seedReviews,
  servicePackages as seedServices,
  suppliers as seedSuppliers,
  team as seedTeam,
} from "@/lib/seed";
import type {
  BlogPost,
  Category,
  Fulfillment,
  Match,
  Product,
  Project,
  Review,
  ServicePackage,
  Supplier,
  TeamMember,
} from "@/lib/types";

/**
 * Single data-access layer. Reads from Supabase when configured, otherwise
 * falls back to in-memory seed data so the app fully renders with no backend.
 *
 * "Configured" only means the env vars are present — it does not mean the
 * project still exists or is reachable. A deleted or paused Supabase project
 * looks configured and fails at query time, so catalog reads degrade to seed
 * data on failure too, not just on absence.
 *
 * Orders and fulfilments deliberately do NOT degrade: serving seeded demo
 * orders while a real backend is down would make fabricated records
 * indistinguishable from real ones.
 */

type ReadResult<T> = { data: T | null; error: { message: string } | null };

// Supabase query builders are thenable but are not Promises — they have no
// `catch`/`finally`. Accept the weaker contract so callers can hand the builder
// straight over; `await` resolves either shape.
type Readable<T> = PromiseLike<ReadResult<T>>;

/**
 * Runs a catalog read, falling back to seed data if the backend fails.
 *
 * Failure is loud in logs and quiet in the UI: a storefront that renders its
 * demo catalog is strictly better than one that renders nothing, but a silent
 * fallback would hide a real outage, so every degradation is logged.
 *
 * An empty array is passed through untouched — that is a successful answer
 * meaning "no rows", usually an unseeded database, and masking it would hide
 * the actual problem.
 */
async function readCatalog<T>(
  label: string,
  read: () => Readable<T[]>,
  fallback: () => T[],
): Promise<T[]> {
  try {
    const { data, error } = await read();
    if (error || !data) {
      console.warn(
        `[data] ${label} read failed, serving seed data:`,
        error?.message ?? "no data returned",
      );
      return fallback();
    }
    return data;
  } catch (cause) {
    // Thrown rather than returned: the host did not resolve, TLS failed, or the
    // request timed out before Supabase could answer.
    console.warn(`[data] ${label} unreachable, serving seed data:`, cause);
    return fallback();
  }
}

/** Single-record variant of {@link readCatalog}. A missing row is a valid null. */
async function readOne<T>(
  label: string,
  read: () => Readable<T>,
  fallback: () => T | null,
): Promise<T | null> {
  try {
    const { data, error } = await read();
    if (error || !data) {
      // `.single()` sets an error for "no rows", which is an ordinary miss
      // rather than an outage — the fallback resolves both identically.
      return fallback();
    }
    return data;
  } catch (cause) {
    console.warn(`[data] ${label} unreachable, serving seed data:`, cause);
    return fallback();
  }
}

export async function getProducts(opts?: {
  category?: string;
  sort?: string;
  search?: string;
  featured?: boolean;
}): Promise<Product[]> {
  const supabase = createClient();
  const seeded = () =>
    seedProducts.map((p) => ({
      ...p,
      category: seedCategories.find((c) => c.id === p.category_id) ?? null,
    }));

  let list: Product[] = supabase
    ? await readCatalog<Product>(
        "products",
        () => supabase.from("products").select("*, category:categories(*)"),
        seeded,
      )
    : seeded();

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
  const seeded = () => {
    const p = seedProducts.find((x) => x.slug === slug);
    if (!p) return null;
    return { ...p, category: seedCategories.find((c) => c.id === p.category_id) ?? null };
  };

  if (!supabase) return seeded();

  return readOne<Product>(
    "product",
    () =>
      supabase
        .from("products")
        .select("*, category:categories(*)")
        .eq("slug", slug)
        .single(),
    seeded,
  );
}

export async function getCategories(): Promise<Category[]> {
  const supabase = createClient();
  if (!supabase) return seedCategories;

  return readCatalog<Category>(
    "categories",
    () => supabase.from("categories").select("*").order("name"),
    () => seedCategories,
  );
}

export async function getReviews(productId: string): Promise<Review[]> {
  const supabase = createClient();
  const seeded = () => seedReviews.filter((r) => r.product_id === productId);
  if (!supabase) return seeded();

  return readCatalog<Review>(
    "reviews",
    () =>
      supabase
        .from("reviews")
        .select("*")
        .eq("product_id", productId)
        .order("created_at", { ascending: false }),
    seeded,
  );
}

export async function getProjects(featured?: boolean): Promise<Project[]> {
  const supabase = createClient();
  const list = supabase
    ? await readCatalog<Project>(
        "projects",
        () => supabase.from("projects").select("*").order("year", { ascending: false }),
        () => seedProjects,
      )
    : seedProjects;

  return featured ? list.filter((p) => p.featured) : list;
}

export async function getProject(slug: string): Promise<Project | null> {
  const supabase = createClient();
  const seeded = () => seedProjects.find((p) => p.slug === slug) ?? null;
  if (!supabase) return seeded();

  return readOne<Project>(
    "project",
    () => supabase.from("projects").select("*").eq("slug", slug).single(),
    seeded,
  );
}

export async function getTeam(): Promise<TeamMember[]> {
  const supabase = createClient();
  const seeded = () => [...seedTeam].sort((a, b) => a.sort_order - b.sort_order);
  if (!supabase) return seeded();

  return readCatalog<TeamMember>(
    "team",
    () => supabase.from("team_members").select("*").order("sort_order"),
    seeded,
  );
}

export async function getServices(): Promise<ServicePackage[]> {
  const supabase = createClient();
  const seeded = () => [...seedServices].sort((a, b) => a.sort_order - b.sort_order);
  if (!supabase) return seeded();

  return readCatalog<ServicePackage>(
    "services",
    () => supabase.from("service_packages").select("*").order("sort_order"),
    seeded,
  );
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const supabase = createClient();
  const seeded = () =>
    [...seedPosts].sort((a, b) => +new Date(b.published_at) - +new Date(a.published_at));
  if (!supabase) return seeded();

  return readCatalog<BlogPost>(
    "blog posts",
    () =>
      supabase
        .from("blog_posts")
        .select("*")
        .order("published_at", { ascending: false }),
    seeded,
  );
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const supabase = createClient();
  const seeded = () => seedPosts.find((p) => p.slug === slug) ?? null;
  if (!supabase) return seeded();

  return readOne<BlogPost>(
    "blog post",
    () => supabase.from("blog_posts").select("*").eq("slug", slug).single(),
    seeded,
  );
}

// ---------- Fulfilment network ----------

// Suppliers and matches are configuration, like the catalog — they describe what
// *could* happen, so serving seeded values while the backend is down is honest.
// Fulfilments below are records of what *did* happen and never degrade.

export async function getSuppliers(): Promise<Supplier[]> {
  const supabase = createClient();
  if (!supabase) return seedSuppliers;

  return readCatalog<Supplier>(
    "suppliers",
    () => supabase.from("suppliers").select("*").order("name"),
    () => seedSuppliers,
  );
}

export async function getMatches(): Promise<Match[]> {
  const supabase = createClient();
  if (!supabase) return seedMatches;

  return readCatalog<Match>(
    "matches",
    () => supabase.from("matches").select("*").order("priority"),
    () => seedMatches,
  );
}

/**
 * Fulfilments are only ever written by a routing pass, so with no backend
 * configured there is nothing to read — the admin derives them from seeded
 * demo orders instead of persisting any.
 */
export async function getFulfillments(orderId?: string): Promise<Fulfillment[]> {
  const supabase = createClient();
  if (!supabase) return [];

  const query = supabase.from("fulfillments").select("*");
  const { data } = orderId
    ? await query.eq("order_id", orderId)
    : await query.order("created_at", { ascending: false });

  return (data as Fulfillment[]) ?? [];
}
