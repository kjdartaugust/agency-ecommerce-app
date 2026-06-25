"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { CartButton } from "@/components/shop/cart-button";
import { LinkButton } from "@/components/ui/button";

const links = [
  { href: "/work", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/shop", label: "Shop" },
  { href: "/blog", label: "Journal" },
  { href: "/about", label: "Studio" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b transition-colors",
        scrolled ? "glass border-border" : "border-transparent bg-transparent"
      )}
    >
      <nav className="container-px mx-auto flex h-16 max-w-7xl items-center justify-between">
        <Link href="/" className="font-display text-xl font-bold tracking-tight">
          Lumen<span className="text-accent">.</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary",
                pathname.startsWith(l.href) ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <CartButton />
          <LinkButton href="/contact" size="sm" className="ml-1 hidden sm:inline-flex">
            Start a project
          </LinkButton>
          <button
            className="ml-1 inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-secondary md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-border glass md:hidden">
          <div className="container-px mx-auto flex max-w-7xl flex-col py-3">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-xl px-3 py-3 text-sm font-medium hover:bg-secondary"
              >
                {l.label}
              </Link>
            ))}
            <LinkButton href="/contact" className="mt-2">
              Start a project
            </LinkButton>
          </div>
        </div>
      )}
    </header>
  );
}
