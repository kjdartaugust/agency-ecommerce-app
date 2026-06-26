"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import type { Category } from "@/lib/types";

const sorts = [
  { value: "newest", label: "Newest" },
  { value: "rating", label: "Top rated" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

export function NexusProductFilters({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const activeCat = params.get("category") ?? "";
  const activeSort = params.get("sort") ?? "newest";

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    const qs = next.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="nexus-no-scrollbar flex gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setParam("category", "")}
          className={cn(
            "shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
            !activeCat ? "border-[#FF6B47] bg-[#FF6B47] text-white" : "border-slate-200 bg-white text-[#0F172A] hover:border-[#FF6B47]"
          )}
        >
          All products
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setParam("category", c.slug)}
            className={cn(
              "shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
              activeCat === c.slug ? "border-[#FF6B47] bg-[#FF6B47] text-white" : "border-slate-200 bg-white text-[#0F172A] hover:border-[#FF6B47]"
            )}
          >
            {c.name}
          </button>
        ))}
      </div>
      <select
        value={activeSort}
        onChange={(e) => setParam("sort", e.target.value === "newest" ? "" : e.target.value)}
        className="shrink-0 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-[#0F172A] outline-none"
        aria-label="Sort products"
      >
        {sorts.map((s) => (
          <option key={s.value} value={s.value}>{s.label}</option>
        ))}
      </select>
    </div>
  );
}
