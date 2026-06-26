import type {
  NexusCategory,
  NexusReview,
  PlatformStats,
  Seller,
  Service,
} from "@/lib/nexus/types";

const img = (id: string, w = 800, h = 600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

export const platformStats: PlatformStats = {
  sellers: 12480,
  products: 38650,
  transactions: 1924300,
  countries: 142,
};

export const nexusCategories: NexusCategory[] = [
  { id: "n1", name: "Design & Creative", slug: "design", icon: "Palette", count: 4820, kind: "both" },
  { id: "n2", name: "Development & Tech", slug: "development", icon: "Code2", count: 6310, kind: "service" },
  { id: "n3", name: "Marketing", slug: "marketing", icon: "Megaphone", count: 3905, kind: "service" },
  { id: "n4", name: "Writing & Translation", slug: "writing", icon: "PenLine", count: 2740, kind: "service" },
  { id: "n5", name: "Video & Animation", slug: "video", icon: "Clapperboard", count: 1980, kind: "service" },
  { id: "n6", name: "Music & Audio", slug: "music", icon: "Music", count: 1460, kind: "both" },
  { id: "n7", name: "Photography", slug: "photography", icon: "Camera", count: 1220, kind: "both" },
  { id: "n8", name: "Business", slug: "business", icon: "Briefcase", count: 2110, kind: "service" },
  { id: "n9", name: "Workspace Gear", slug: "workspace", icon: "Package", count: 980, kind: "product" },
  { id: "n10", name: "Audio Gear", slug: "audio", icon: "Headphones", count: 760, kind: "product" },
];

export const sellers: Seller[] = [
  {
    id: "s1", name: "Amara Okafor", slug: "amara-okafor",
    avatar_url: img("photo-1494790108377-be9c29b29330", 200, 200),
    cover_url: img("photo-1558655146-d09347e92766", 1200, 400),
    tagline: "Brand identity designer crafting bold, memorable brands",
    bio: "Award-winning brand designer with 10+ years helping startups and global brands find their visual voice. I obsess over the details that make a brand unforgettable.",
    level: "Top Rated", verified: true, rating: 4.9, review_count: 847,
    response_time: "1 hour", location: "Accra, Ghana", member_since: "2019",
    languages: ["English", "French"], skills: ["Branding", "Logo Design", "Visual Identity"],
    completed_orders: 1230,
  },
  {
    id: "s2", name: "Daniel Cho", slug: "daniel-cho",
    avatar_url: img("photo-1500648767791-00dcc994a43e", 200, 200),
    cover_url: img("photo-1517694712202-14dd9538aa97", 1200, 400),
    tagline: "Full-stack engineer shipping fast, scalable web apps",
    bio: "I build production-grade web applications with Next.js, TypeScript, and Postgres. From MVP to scale, I write code that lasts.",
    level: "Top Rated", verified: true, rating: 4.8, review_count: 612,
    response_time: "2 hours", location: "Seoul, South Korea", member_since: "2020",
    languages: ["English", "Korean"], skills: ["Next.js", "TypeScript", "Supabase", "Stripe"],
    completed_orders: 890,
  },
  {
    id: "s3", name: "Sofia Marenco", slug: "sofia-marenco",
    avatar_url: img("photo-1438761681033-6461ffad8d80", 200, 200),
    cover_url: img("photo-1499951360447-b19be8fe80f5", 1200, 400),
    tagline: "Product designer focused on delightful, usable interfaces",
    bio: "I design products people love to use. UX research, interaction design, and design systems that scale with your team.",
    level: "Level 2", verified: true, rating: 4.9, review_count: 421,
    response_time: "1 hour", location: "Lisbon, Portugal", member_since: "2021",
    languages: ["English", "Portuguese", "Spanish"], skills: ["UX/UI", "Figma", "Design Systems"],
    completed_orders: 540,
  },
  {
    id: "s4", name: "Marcus Bell", slug: "marcus-bell",
    avatar_url: img("photo-1507003211169-0a1dd7228f2d", 200, 200),
    cover_url: img("photo-1460925895917-afdab827c52f", 1200, 400),
    tagline: "Growth marketer turning clicks into customers",
    bio: "Performance marketing and growth strategy for D2C and SaaS. I've managed $10M+ in ad spend with a focus on ROAS.",
    level: "Level 2", verified: true, rating: 4.7, review_count: 308,
    response_time: "3 hours", location: "Austin, USA", member_since: "2020",
    languages: ["English"], skills: ["Paid Media", "SEO", "Conversion"],
    completed_orders: 410,
  },
  {
    id: "s5", name: "Priya Sharma", slug: "priya-sharma",
    avatar_url: img("photo-1487412720507-e7ab37603c6f", 200, 200),
    cover_url: img("photo-1487058792275-0ad4aaf24ca7", 1200, 400),
    tagline: "Conversion copywriter & brand storyteller",
    bio: "Words that sell. I write landing pages, emails, and brand stories that convert browsers into buyers.",
    level: "Level 1", verified: true, rating: 4.8, review_count: 196,
    response_time: "2 hours", location: "Mumbai, India", member_since: "2022",
    languages: ["English", "Hindi"], skills: ["Copywriting", "Email", "Brand Voice"],
    completed_orders: 260,
  },
  {
    id: "s6", name: "Leo Kovač", slug: "leo-kovac",
    avatar_url: img("photo-1633332755192-727a05c4013d", 200, 200),
    cover_url: img("photo-1492691527719-9d1e07e534b4", 1200, 400),
    tagline: "Motion designer & 3D animator for standout brands",
    bio: "I bring brands to life with motion. Explainer videos, product animations, and 3D that stops the scroll.",
    level: "Level 1", verified: false, rating: 4.6, review_count: 142,
    response_time: "4 hours", location: "Zagreb, Croatia", member_since: "2022",
    languages: ["English", "Croatian"], skills: ["After Effects", "Blender", "Motion"],
    completed_orders: 180,
  },
];

const tiers = (base: number): Service["tiers"] => [
  { name: "Basic", price: base, delivery_days: 5, revisions: "1 revision",
    features: ["1 concept", "Source files", "Commercial use"] },
  { name: "Standard", price: Math.round(base * 2.2), delivery_days: 4, revisions: "3 revisions",
    features: ["3 concepts", "Source files", "Commercial use", "Social media kit"] },
  { name: "Premium", price: Math.round(base * 4.5), delivery_days: 3, revisions: "Unlimited revisions",
    features: ["5 concepts", "Source files", "Commercial use", "Social media kit", "Brand guidelines", "Priority support"] },
];

export const services: Service[] = [
  {
    id: "sv1", slug: "premium-brand-identity-design", title: "I will design a premium brand identity and logo",
    seller_id: "s1", category: "design", cover_url: img("photo-1626785774573-4b799315345d"),
    gallery: [img("photo-1626785774573-4b799315345d"), img("photo-1634942537034-2531766767d1"), img("photo-1561070791-2526d30994b5")],
    rating: 4.9, review_count: 312, delivery_days: 5, starting_price: 12000,
    description: "A complete brand identity that makes you unforgettable. You'll get a custom logo, color system, typography, and brand guidelines — everything you need to launch with confidence.",
    tiers: tiers(12000), verified: true, featured: true,
  },
  {
    id: "sv2", slug: "full-stack-web-app-development", title: "I will build a full-stack web app with Next.js and Supabase",
    seller_id: "s2", category: "development", cover_url: img("photo-1517180102446-f3ece451e9d8"),
    gallery: [img("photo-1517180102446-f3ece451e9d8"), img("photo-1555066931-4365d14bab8c")],
    rating: 4.8, review_count: 208, delivery_days: 14, starting_price: 45000,
    description: "From idea to production. I'll architect and build your web application with a modern stack — authentication, database, payments, and a clean, responsive UI.",
    tiers: tiers(45000), verified: true, featured: true,
  },
  {
    id: "sv3", slug: "product-ux-ui-design", title: "I will design a beautiful, conversion-focused product UI",
    seller_id: "s3", category: "design", cover_url: img("photo-1581291518857-4e27b48ff24e"),
    gallery: [img("photo-1581291518857-4e27b48ff24e"), img("photo-1559028012-481c04fa702d")],
    rating: 4.9, review_count: 174, delivery_days: 7, starting_price: 28000,
    description: "User-centered product design that looks stunning and converts. Wireframes, high-fidelity mockups, and an interactive prototype your developers will love.",
    tiers: tiers(28000), verified: true, featured: true,
  },
  {
    id: "sv4", slug: "growth-marketing-strategy", title: "I will create a growth marketing strategy that scales",
    seller_id: "s4", category: "marketing", cover_url: img("photo-1533750349088-cd871a92f312"),
    gallery: [img("photo-1533750349088-cd871a92f312"), img("photo-1460925895917-afdab827c52f")],
    rating: 4.7, review_count: 131, delivery_days: 6, starting_price: 35000,
    description: "A data-driven growth plan tailored to your business. Channel strategy, funnel optimization, and a 90-day roadmap to measurable results.",
    tiers: tiers(35000), verified: true, featured: true,
  },
  {
    id: "sv5", slug: "high-converting-copywriting", title: "I will write high-converting website and email copy",
    seller_id: "s5", category: "writing", cover_url: img("photo-1455390582262-044cdead277a"),
    gallery: [img("photo-1455390582262-044cdead277a")],
    rating: 4.8, review_count: 98, delivery_days: 4, starting_price: 9000,
    description: "Persuasive copy that turns visitors into customers. Landing pages, email sequences, and brand messaging written to convert.",
    tiers: tiers(9000), verified: true, featured: false,
  },
  {
    id: "sv6", slug: "animated-explainer-video", title: "I will produce an animated explainer video for your product",
    seller_id: "s6", category: "video", cover_url: img("photo-1574717024653-61fd2cf4d44d"),
    gallery: [img("photo-1574717024653-61fd2cf4d44d")],
    rating: 4.6, review_count: 76, delivery_days: 10, starting_price: 22000,
    description: "An eye-catching animated explainer that tells your story in 60 seconds. Script, voiceover, and polished motion design included.",
    tiers: tiers(22000), verified: false, featured: false,
  },
  {
    id: "sv7", slug: "seo-audit-and-optimization", title: "I will run a complete SEO audit and optimize your site",
    seller_id: "s4", category: "marketing", cover_url: img("photo-1432888622747-4eb9a8efeb07"),
    gallery: [img("photo-1432888622747-4eb9a8efeb07")],
    rating: 4.7, review_count: 119, delivery_days: 5, starting_price: 15000,
    description: "Climb the rankings. A full technical and content SEO audit with a prioritized action plan and on-page optimization.",
    tiers: tiers(15000), verified: true, featured: false,
  },
  {
    id: "sv8", slug: "design-system-and-component-library", title: "I will build a scalable design system and component library",
    seller_id: "s3", category: "development", cover_url: img("photo-1507721999472-8ed4421c4af2"),
    gallery: [img("photo-1507721999472-8ed4421c4af2")],
    rating: 4.9, review_count: 64, delivery_days: 12, starting_price: 52000,
    description: "A production-ready design system in Figma and code. Tokens, components, and documentation that keep your team shipping consistently.",
    tiers: tiers(52000), verified: true, featured: false,
  },
];

export const nexusReviews: NexusReview[] = [
  { id: "nr1", target_id: "sv1", author_name: "James W.", author_avatar: img("photo-1599566150163-29194dcaad36", 100, 100), country: "United States", rating: 5, body: "Amara is a genius. The brand she created exceeded every expectation — clear, bold, and exactly us. Will work with her again.", created_at: "2026-05-20T00:00:00Z" },
  { id: "nr2", target_id: "sv1", author_name: "Lena M.", author_avatar: img("photo-1544005313-94ddf0286df2", 100, 100), country: "Germany", rating: 5, body: "Incredible communication and even better work. Delivered ahead of schedule with a full brand guide.", created_at: "2026-05-08T00:00:00Z" },
  { id: "nr3", target_id: "sv2", author_name: "Carlos R.", author_avatar: img("photo-1507003211169-0a1dd7228f2d", 100, 100), country: "Spain", rating: 5, body: "Daniel built our entire SaaS MVP in two weeks. Clean code, great docs, zero drama. Highly recommend.", created_at: "2026-04-30T00:00:00Z" },
  { id: "nr4", target_id: "sv3", author_name: "Aisha K.", author_avatar: img("photo-1487412720507-e7ab37603c6f", 100, 100), country: "UAE", rating: 5, body: "Sofia's designs lifted our signup conversion by 30%. Thoughtful, beautiful, and easy to implement.", created_at: "2026-04-18T00:00:00Z" },
];

// ---- getters (mirror data.ts style; pure mock, always available) ----
export function getServices(opts?: { category?: string; sort?: string; search?: string; featured?: boolean }) {
  let list = [...services];
  if (opts?.category) list = list.filter((s) => s.category === opts.category);
  if (opts?.featured) list = list.filter((s) => s.featured);
  if (opts?.search) {
    const q = opts.search.toLowerCase();
    list = list.filter((s) => s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q));
  }
  switch (opts?.sort) {
    case "price-asc": list.sort((a, b) => a.starting_price - b.starting_price); break;
    case "price-desc": list.sort((a, b) => b.starting_price - a.starting_price); break;
    case "rating": list.sort((a, b) => b.rating - a.rating); break;
    case "delivery": list.sort((a, b) => a.delivery_days - b.delivery_days); break;
    default: break;
  }
  return list;
}

export function getService(slug: string) {
  return services.find((s) => s.slug === slug) ?? null;
}

export function getSeller(id: string) {
  return sellers.find((s) => s.id === id) ?? null;
}

export function getSellerBySlug(slug: string) {
  return sellers.find((s) => s.slug === slug) ?? null;
}

export function getServicesBySeller(sellerId: string) {
  return services.filter((s) => s.seller_id === sellerId);
}

export function getNexusReviews(targetId: string) {
  return nexusReviews.filter((r) => r.target_id === targetId);
}

export function getFeaturedSellers() {
  return [...sellers].sort((a, b) => b.rating - a.rating).slice(0, 4);
}
