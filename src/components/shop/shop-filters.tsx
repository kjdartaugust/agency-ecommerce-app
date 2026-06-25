"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import type { Category } from "@/lib/types";

const sorts = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top rated" },
];

export function ShopFilters({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const activeCat = params.get("category") ?? "";
  const activeSort = params.get("sort") ?? "newest";

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.push(`${pathname}?${next.toString()}`, { scroll: false });
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setParam("category", "")}
          className={cn(
            "rounded-full border px-4 py-1.5 text-sm transition-colors",
            !activeCat ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-secondary"
          )}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setParam("category", c.slug)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm transition-colors",
              activeCat === c.slug
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border hover:bg-secondary"
            )}
          >
            {c.name}
          </button>
        ))}
      </div>
      <select
        value={activeSort}
        onChange={(e) => setParam("sort", e.target.value === "newest" ? "" : e.target.value)}
        className="rounded-full border border-input bg-background px-4 py-1.5 text-sm"
        aria-label="Sort products"
      >
        {sorts.map((s) => (
          <option key={s.value} value={s.value}>{s.label}</option>
        ))}
      </select>
    </div>
  );
}
