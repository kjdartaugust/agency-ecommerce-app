"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
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
  const activeSearch = params.get("search") ?? "";

  const [query, setQuery] = useState(activeSearch);
  const firstRender = useRef(true);

  // Keep local input in sync when the URL changes externally (e.g. back button).
  useEffect(() => {
    setQuery(activeSearch);
  }, [activeSearch]);

  // Debounce search updates to the URL.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const t = setTimeout(() => {
      if (query !== activeSearch) setParam("search", query);
    }, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    const qs = next.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  return (
    <div className="space-y-4">
      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products…"
          aria-label="Search products"
          className="w-full rounded-full border border-input bg-background py-2.5 pl-11 pr-10 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

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
    </div>
  );
}
