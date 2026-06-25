import Link from "next/link";

const groups = [
  {
    title: "Studio",
    links: [
      { href: "/about", label: "About" },
      { href: "/work", label: "Work" },
      { href: "/services", label: "Services" },
      { href: "/blog", label: "Journal" },
    ],
  },
  {
    title: "Shop",
    links: [
      { href: "/shop", label: "All products" },
      { href: "/shop?category=workspace", label: "Workspace" },
      { href: "/shop?category=audio", label: "Audio" },
      { href: "/account/orders", label: "Order history" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/contact", label: "Contact" },
      { href: "/login", label: "Sign in" },
      { href: "/admin", label: "Admin" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/40">
      <div className="container-px mx-auto grid max-w-7xl gap-10 py-14 md:grid-cols-[1.5fr_repeat(3,1fr)]">
        <div>
          <Link href="/" className="font-display text-xl font-bold">
            Lumen<span className="text-accent">.</span>
          </Link>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            A design & engineering studio — and a curated store of workspace essentials.
          </p>
        </div>
        {groups.map((g) => (
          <div key={g.title}>
            <h4 className="text-sm font-semibold">{g.title}</h4>
            <ul className="mt-4 space-y-2.5">
              {g.links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border">
        <div className="container-px mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 py-6 text-sm text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} Lumen Studio. All rights reserved.</p>
          <p>Built with Next.js, Supabase & Stripe.</p>
        </div>
      </div>
    </footer>
  );
}
