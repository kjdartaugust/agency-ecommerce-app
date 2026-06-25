import type {
  BlogPost,
  Category,
  Product,
  Project,
  Review,
  ServicePackage,
  TeamMember,
} from "@/lib/types";

const img = (id: string, w = 900, h = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

export const categories: Category[] = [
  { id: "c1", name: "Workspace", slug: "workspace", description: "Desk and studio essentials" },
  { id: "c2", name: "Audio", slug: "audio", description: "Sound, crafted" },
  { id: "c3", name: "Lighting", slug: "lighting", description: "Ambient and task lighting" },
  { id: "c4", name: "Accessories", slug: "accessories", description: "The finishing details" },
];

export const products: Product[] = [
  {
    id: "p1", name: "Aperture Desk Lamp", slug: "aperture-desk-lamp",
    description: "A minimalist aluminium task lamp with stepless dimming and a warm-to-cool color range. Designed to disappear into your workspace until you need it.",
    price: 18900, compare_at_price: 22900, currency: "USD",
    image_url: img("photo-1507473885765-e6ed057f782c"),
    gallery: [img("photo-1507473885765-e6ed057f782c"), img("photo-1513506003901-1e6a229e2d15")],
    category_id: "c3", stock: 24, featured: true, rating: 4.8, review_count: 42,
    created_at: "2026-01-12T00:00:00Z",
  },
  {
    id: "p2", name: "Monarch Headphones", slug: "monarch-headphones",
    description: "Over-ear wireless headphones with adaptive noise cancellation and 40-hour battery. Machined aluminium yokes and memory-foam cushions.",
    price: 32900, compare_at_price: null, currency: "USD",
    image_url: img("photo-1505740420928-5e560c06d30e"),
    gallery: [img("photo-1505740420928-5e560c06d30e"), img("photo-1484704849700-f032a568e944")],
    category_id: "c2", stock: 15, featured: true, rating: 4.9, review_count: 88,
    created_at: "2026-02-02T00:00:00Z",
  },
  {
    id: "p3", name: "Linnea Oak Desk", slug: "linnea-oak-desk",
    description: "Solid white-oak writing desk with a cable-managed spine and hand-finished edges. Flat-packs in two pieces, assembles in minutes.",
    price: 64900, compare_at_price: 74900, currency: "USD",
    image_url: img("photo-1518455027359-f3f8164ba6bd"),
    gallery: [img("photo-1518455027359-f3f8164ba6bd")],
    category_id: "c1", stock: 8, featured: true, rating: 4.7, review_count: 19,
    created_at: "2026-02-20T00:00:00Z",
  },
  {
    id: "p4", name: "Pebble Wireless Mouse", slug: "pebble-wireless-mouse",
    description: "An ergonomic, silent-click wireless mouse with a recycled-aluminium shell and 90-day battery on a single charge.",
    price: 7900, compare_at_price: null, currency: "USD",
    image_url: img("photo-1527814050087-3793815479db"),
    gallery: [img("photo-1527814050087-3793815479db")],
    category_id: "c4", stock: 60, featured: false, rating: 4.5, review_count: 51,
    created_at: "2026-03-01T00:00:00Z",
  },
  {
    id: "p5", name: "Aria Mechanical Keyboard", slug: "aria-mechanical-keyboard",
    description: "A 75% hot-swap mechanical keyboard with gasket mounting, PBT keycaps, and a sound profile tuned for the studio.",
    price: 21900, compare_at_price: 24900, currency: "USD",
    image_url: img("photo-1587829741301-dc798b83add3"),
    gallery: [img("photo-1587829741301-dc798b83add3")],
    category_id: "c1", stock: 31, featured: true, rating: 4.8, review_count: 64,
    created_at: "2026-03-10T00:00:00Z",
  },
  {
    id: "p6", name: "Halo Floor Light", slug: "halo-floor-light",
    description: "A dimmable LED floor lamp with an opal diffuser that casts a soft, even glow. Touch-controlled with three presets.",
    price: 27900, compare_at_price: null, currency: "USD",
    image_url: img("photo-1543198126-a8ad8e47fb22"),
    gallery: [img("photo-1543198126-a8ad8e47fb22")],
    category_id: "c3", stock: 12, featured: false, rating: 4.6, review_count: 23,
    created_at: "2026-03-22T00:00:00Z",
  },
  {
    id: "p7", name: "Cirrus Bookshelf Speakers", slug: "cirrus-bookshelf-speakers",
    description: "A pair of two-way bookshelf speakers with woven-fiber woofers and a warm, room-filling midrange. Sold as a matched set.",
    price: 44900, compare_at_price: 49900, currency: "USD",
    image_url: img("photo-1545454675-3531b543be5d"),
    gallery: [img("photo-1545454675-3531b543be5d")],
    category_id: "c2", stock: 9, featured: true, rating: 4.9, review_count: 37,
    created_at: "2026-04-04T00:00:00Z",
  },
  {
    id: "p8", name: "Field Leather Organizer", slug: "field-leather-organizer",
    description: "A full-grain leather desk organizer that patinas beautifully. Slots for cards, cables, and the small things that wander.",
    price: 9900, compare_at_price: null, currency: "USD",
    image_url: img("photo-1606220838315-056192d5e927"),
    gallery: [img("photo-1606220838315-056192d5e927")],
    category_id: "c4", stock: 40, featured: false, rating: 4.4, review_count: 28,
    created_at: "2026-04-18T00:00:00Z",
  },
];

export const reviews: Review[] = [
  { id: "r1", product_id: "p1", author_name: "Daniela R.", rating: 5, title: "Perfect for late nights", body: "The warm setting is so easy on the eyes. Build quality feels premium.", created_at: "2026-03-01T00:00:00Z" },
  { id: "r2", product_id: "p1", author_name: "Marcus T.", rating: 4, title: "Great, slightly pricey", body: "Love the dimming range. Wish the base were a touch heavier.", created_at: "2026-03-12T00:00:00Z" },
  { id: "r3", product_id: "p2", author_name: "Priya S.", rating: 5, title: "ANC is incredible", body: "Wore them on a 9-hour flight and forgot they were on. Battery lasts forever.", created_at: "2026-04-02T00:00:00Z" },
  { id: "r4", product_id: "p5", author_name: "Leo K.", rating: 5, title: "Sounds amazing", body: "Hot-swap sockets meant I didn't need to solder. Typing on it is a joy.", created_at: "2026-04-20T00:00:00Z" },
];

export const projects: Project[] = [
  {
    id: "pr1", title: "Northwind — Brand & Commerce", slug: "northwind", client: "Northwind Coffee",
    category: "Branding", summary: "A full rebrand and Shopify Plus storefront that lifted online revenue 64% in one quarter.",
    cover_url: img("photo-1559496417-e7f25cb247f3", 1200, 800),
    gallery: [img("photo-1559496417-e7f25cb247f3", 1200, 800), img("photo-1442512595331-e89e73853f31", 1200, 800)],
    year: 2026, services: ["Brand Identity", "E-commerce", "Photography"], featured: true,
  },
  {
    id: "pr2", title: "Vela — Fintech Product Design", slug: "vela", client: "Vela",
    category: "Product", summary: "Designed and built a mobile-first banking experience used by 200k+ customers.",
    cover_url: img("photo-1551288049-bebda4e38f71", 1200, 800),
    gallery: [img("photo-1551288049-bebda4e38f71", 1200, 800)],
    year: 2025, services: ["UX Research", "Product Design", "Webflow"], featured: true,
  },
  {
    id: "pr3", title: "Atlas Outdoors — Campaign", slug: "atlas-outdoors", client: "Atlas",
    category: "Campaign", summary: "An integrated launch campaign with film, web, and social that reached 4M people.",
    cover_url: img("photo-1469854523086-cc02fe5d8800", 1200, 800),
    gallery: [img("photo-1469854523086-cc02fe5d8800", 1200, 800)],
    year: 2025, services: ["Art Direction", "Film", "Paid Media"], featured: true,
  },
  {
    id: "pr4", title: "Mori — SaaS Marketing Site", slug: "mori", client: "Mori Labs",
    category: "Web", summary: "A high-converting marketing site and design system shipped in six weeks.",
    cover_url: img("photo-1467232004584-a241de8bcf5d", 1200, 800),
    gallery: [img("photo-1467232004584-a241de8bcf5d", 1200, 800)],
    year: 2026, services: ["Web Design", "Next.js", "SEO"], featured: false,
  },
  {
    id: "pr5", title: "Saffron — Restaurant Identity", slug: "saffron", client: "Saffron",
    category: "Branding", summary: "Naming, identity, and menu system for a modern Levantine restaurant group.",
    cover_url: img("photo-1414235077428-338989a2e8c0", 1200, 800),
    gallery: [img("photo-1414235077428-338989a2e8c0", 1200, 800)],
    year: 2024, services: ["Naming", "Identity", "Print"], featured: false,
  },
  {
    id: "pr6", title: "Quanta — Data Platform UI", slug: "quanta", client: "Quanta",
    category: "Product", summary: "A clear, fast analytics interface for a complex data platform.",
    cover_url: img("photo-1551434678-e076c223a692", 1200, 800),
    gallery: [img("photo-1551434678-e076c223a692", 1200, 800)],
    year: 2026, services: ["Product Design", "Design System"], featured: false,
  },
];

export const team: TeamMember[] = [
  { id: "t1", name: "Amara Okafor", role: "Founder & Creative Director", bio: "Two decades shaping brands for startups and Fortune 500s. Believes great design is mostly great listening.", avatar_url: img("photo-1494790108377-be9c29b29330", 400, 400), socials: { x: "#", linkedin: "#" }, sort_order: 1 },
  { id: "t2", name: "Daniel Cho", role: "Head of Engineering", bio: "Full-stack lead who ships fast without breaking things. Next.js, Postgres, and strong opinions on caching.", avatar_url: img("photo-1500648767791-00dcc994a43e", 400, 400), socials: { x: "#", github: "#" }, sort_order: 2 },
  { id: "t3", name: "Sofia Marenco", role: "Design Lead", bio: "Product designer obsessed with the details users never notice but always feel.", avatar_url: img("photo-1438761681033-6461ffad8d80", 400, 400), socials: { linkedin: "#" }, sort_order: 3 },
  { id: "t4", name: "Marcus Bell", role: "Strategy Director", bio: "Turns business problems into creative briefs. Former founder, recovering consultant.", avatar_url: img("photo-1507003211169-0a1dd7228f2d", 400, 400), socials: { x: "#" }, sort_order: 4 },
];

export const servicePackages: ServicePackage[] = [
  {
    id: "s1", name: "Launch", tagline: "For startups finding their voice", price: 750000, billing: "project",
    features: ["Brand identity & logo", "Messaging & positioning", "Landing page design + build", "2 rounds of revisions", "4-week delivery"],
    popular: false, sort_order: 1,
  },
  {
    id: "s2", name: "Growth", tagline: "Our most popular engagement", price: 1800000, billing: "project",
    features: ["Everything in Launch", "Full marketing website", "Design system & components", "E-commerce storefront", "SEO & analytics setup", "8-week delivery"],
    popular: true, sort_order: 2,
  },
  {
    id: "s3", name: "Partner", tagline: "An embedded team, monthly", price: 0, billing: "custom",
    features: ["Dedicated design + dev pod", "Ongoing product work", "Quarterly strategy", "Priority support", "Flexible scope"],
    popular: false, sort_order: 3,
  },
];

export const blogPosts: BlogPost[] = [
  {
    id: "b1", title: "Why your storefront speed is a brand decision", slug: "storefront-speed-brand",
    excerpt: "Performance isn't an engineering nicety — it's how customers feel your brand before they read a word.",
    content: "Performance isn't an engineering nicety — it's how customers feel your brand before they read a word.\n\nWhen a page loads instantly, it signals competence and care. When it stutters, customers quietly lose trust. We treat Core Web Vitals as a brand metric, not just a technical one.\n\nIn this case study we walk through how we cut Northwind's largest contentful paint by 1.8 seconds and what it did to conversion.",
    cover_url: img("photo-1460925895917-afdab827c52f", 1200, 700), author: "Daniel Cho", tag: "Engineering", read_minutes: 6, published_at: "2026-05-12T00:00:00Z",
  },
  {
    id: "b2", title: "The brief is the product", slug: "the-brief-is-the-product",
    excerpt: "The quality of creative work is capped by the quality of the brief. Here's how we write better ones.",
    content: "The quality of creative work is capped by the quality of the brief.\n\nA good brief is a forcing function for clarity. It names the audience, the one thing to communicate, and the single metric that defines success. Everything else is negotiable.\n\nWe share the exact one-page brief template we use on every engagement.",
    cover_url: img("photo-1542435503-956c469947f6", 1200, 700), author: "Marcus Bell", tag: "Strategy", read_minutes: 4, published_at: "2026-04-28T00:00:00Z",
  },
  {
    id: "b3", title: "Designing a checkout people actually finish", slug: "checkout-people-finish",
    excerpt: "Cart abandonment is mostly a design problem. Six patterns that recover revenue.",
    content: "Cart abandonment is mostly a design problem.\n\nMost drop-off happens for boring reasons: surprise costs, forced account creation, and slow forms. We rebuilt Vela's checkout around guest-first flows, inline validation, and Stripe's prebuilt elements.\n\nThe result was a 23% lift in completed orders.",
    cover_url: img("photo-1556742502-ec7c0e9f34b1", 1200, 700), author: "Sofia Marenco", tag: "Design", read_minutes: 5, published_at: "2026-04-09T00:00:00Z",
  },
];
