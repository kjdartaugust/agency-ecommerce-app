import Link from "next/link";
import {
  Palette, Code2, Megaphone, PenLine, Clapperboard, Music,
  Camera, Briefcase, Package, Headphones, type LucideIcon,
} from "lucide-react";
import type { NexusCategory } from "@/lib/nexus/types";

const icons: Record<string, LucideIcon> = {
  Palette, Code2, Megaphone, PenLine, Clapperboard, Music, Camera, Briefcase, Package, Headphones,
};

export function CategoryRow({ categories }: { categories: NexusCategory[] }) {
  return (
    <div className="nexus-no-scrollbar -mx-5 flex gap-4 overflow-x-auto px-5 pb-2 sm:-mx-8 sm:px-8">
      {categories.map((c) => {
        const Icon = icons[c.icon] ?? Package;
        const href =
          c.kind === "product" ? `/market/products?category=${c.slug}` : `/market/services?category=${c.slug}`;
        return (
          <Link
            key={c.id}
            href={href}
            className="group flex w-44 shrink-0 flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:-translate-y-1 hover:border-[#FF6B47]/50 hover:shadow-lg"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0F172A] text-[#FF6B47] transition-colors group-hover:bg-[#FF6B47] group-hover:text-white">
              <Icon className="h-6 w-6" />
            </span>
            <span className="font-bold leading-tight text-[#0F172A]">{c.name}</span>
            <span className="text-sm text-slate-400">{c.count.toLocaleString()} listings</span>
          </Link>
        );
      })}
    </div>
  );
}
