import Link from "next/link";
import { Sparkles } from "lucide-react";

const groups = [
  {
    title: "Marketplace",
    links: [
      { href: "/market/services", label: "Browse Services" },
      { href: "/market/products", label: "Shop Products" },
      { href: "/market/search?q=design", label: "Trending: Design" },
      { href: "/market/become-a-seller", label: "Become a Seller" },
    ],
  },
  {
    title: "For Sellers",
    links: [
      { href: "/market/seller", label: "Seller Dashboard" },
      { href: "/market/seller#listings", label: "Manage Listings" },
      { href: "/market/seller#payouts", label: "Payouts" },
      { href: "/market/become-a-seller", label: "Start Selling" },
    ],
  },
  {
    title: "For Buyers",
    links: [
      { href: "/market/buyer", label: "My Orders" },
      { href: "/market/buyer#saved", label: "Saved Items" },
      { href: "/market/buyer#messages", label: "Messages" },
      { href: "/market/checkout", label: "Checkout" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/market/admin", label: "Admin Panel" },
      { href: "/", label: "Lumen Studio" },
      { href: "/login", label: "Sign In" },
    ],
  },
];

export function NexusFooter() {
  return (
    <footer className="bg-[#0F172A] text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 md:grid-cols-[1.5fr_repeat(4,1fr)]">
        <div>
          <Link href="/market" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
              <Sparkles className="h-5 w-5 text-[#FF6B47]" />
            </span>
            <span className="text-lg font-extrabold text-white">
              Nexus<span className="text-[#FF6B47]">Market</span>
            </span>
          </Link>
          <p className="mt-4 max-w-xs text-sm text-slate-400">
            The marketplace where the world's best talent meets the products you love — services and
            goods, one trusted platform.
          </p>
        </div>
        {groups.map((g) => (
          <div key={g.title}>
            <h4 className="text-sm font-bold text-white">{g.title}</h4>
            <ul className="mt-4 space-y-2.5">
              {g.links.map((l) => (
                <li key={l.href + l.label}>
                  <Link href={l.href} className="text-sm text-slate-400 transition-colors hover:text-[#FF6B47]">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-5 py-6 text-sm text-slate-400 sm:flex-row sm:px-8">
          <p>© {new Date().getFullYear()} Nexus Market. All rights reserved.</p>
          <p>Powered by Next.js, Supabase & Stripe.</p>
        </div>
      </div>
    </footer>
  );
}
