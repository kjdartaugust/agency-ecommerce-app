import Link from "next/link";
import { redirect } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart, Truck, ArrowLeft } from "lucide-react";
import { getAdminContext } from "@/lib/auth";

// Admin reads per-request auth (cookies) — never statically generate.
export const dynamic = "force-dynamic";

const nav = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/suppliers", label: "Suppliers", icon: Truck },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const ctx = await getAdminContext();
  if (ctx.configured && !ctx.isAdmin) redirect("/login?next=/admin");

  return (
    <div className="container-px mx-auto flex max-w-7xl gap-8 py-10">
      <aside className="hidden w-56 shrink-0 md:block">
        <div className="sticky top-24 space-y-1">
          <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Admin
          </p>
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <n.icon className="h-4 w-4" /> {n.label}
            </Link>
          ))}
          <Link
            href="/"
            className="mt-4 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:bg-secondary"
          >
            <ArrowLeft className="h-4 w-4" /> Back to site
          </Link>
        </div>
      </aside>
      <div className="min-w-0 flex-1">
        {!ctx.configured && (
          <div className="mb-6 rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm">
            Demo mode — connect Supabase to manage live data. Changes here won't persist.
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
