"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { NexusSearch } from "@/components/nexus/search-bar";

const links = [
  { href: "/market/services", label: "Services" },
  { href: "/market/products", label: "Products" },
  { href: "/market/seller", label: "Seller Dashboard" },
  { href: "/market/buyer", label: "My Orders" },
];

export function NexusNavbar() {
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
        "sticky top-0 z-50 w-full border-b transition-all",
        scrolled ? "border-slate-200 bg-white/90 backdrop-blur-xl" : "border-transparent bg-white"
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-5 sm:px-8">
        <Link href="/market" className="flex shrink-0 items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0F172A]">
            <Sparkles className="h-5 w-5 text-[#FF6B47]" />
          </span>
          <span className="text-lg font-extrabold tracking-tight text-[#0F172A]">
            Nexus<span className="text-[#FF6B47]">Market</span>
          </span>
        </Link>

        <NexusSearch variant="nav" />

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "rounded-full px-3 py-2 text-sm font-semibold transition-colors hover:text-[#FF6B47]",
                pathname === l.href ? "text-[#FF6B47]" : "text-[#0F172A]"
              )}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="ml-auto hidden items-center gap-3 md:flex lg:ml-0">
          <Link
            href="/market/become-a-seller"
            className="text-sm font-semibold text-[#0F172A] transition-colors hover:text-[#FF6B47]"
          >
            Become a Seller
          </Link>
          <Link href="/login" className="text-sm font-semibold text-[#0F172A] hover:text-[#FF6B47]">
            Sign In
          </Link>
          <Link
            href="/market/become-a-seller"
            className="rounded-full bg-[#FF6B47] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#ff5530]"
          >
            Get Started
          </Link>
        </div>

        <button
          className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-full text-[#0F172A] hover:bg-slate-100 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <div className="mx-auto max-w-7xl px-5 py-3">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="block rounded-xl px-3 py-3 text-sm font-semibold text-[#0F172A] hover:bg-slate-50">
                {l.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-slate-100 pt-3">
              <Link href="/login" className="rounded-xl px-3 py-3 text-sm font-semibold text-[#0F172A] hover:bg-slate-50">
                Sign In
              </Link>
              <Link href="/market/become-a-seller" className="rounded-full bg-[#FF6B47] px-5 py-3 text-center text-sm font-bold text-white">
                Become a Seller
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
