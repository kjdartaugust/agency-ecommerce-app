import type { Metadata } from "next";
import Link from "next/link";
import { Search, SlidersHorizontal } from "lucide-react";
import { getProducts } from "@/lib/data";
import { getServices } from "@/lib/nexus/data";
import { ServiceCard } from "@/components/nexus/service-card";
import { NexusProductCard } from "@/components/nexus/product-card";
import { FadeUp } from "@/components/nexus/motion";

export const metadata: Metadata = { title: "Search" };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string; tab?: string };
}) {
  const q = (searchParams.q ?? "").trim();
  const services = q ? getServices({ search: q }) : [];
  const products = q ? await getProducts({ search: q }) : [];
  const total = services.length + products.length;
  const tab = searchParams.tab ?? "all";
  const showServices = tab === "all" || tab === "services";
  const showProducts = tab === "all" || tab === "products";

  const tabs = [
    { key: "all", label: `All (${total})` },
    { key: "services", label: `Services (${services.length})` },
    { key: "products", label: `Products (${products.length})` },
  ];

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
      <form action="/market/search" method="get" className="relative max-w-2xl">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <input
          name="q"
          defaultValue={q}
          placeholder="Search services and products…"
          className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-12 pr-28 text-base text-[#0F172A] shadow-sm outline-none focus:border-[#FF6B47]"
        />
        <button className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-[#FF6B47] px-5 py-2.5 font-bold text-white hover:bg-[#ff5530]">
          Search
        </button>
      </form>

      {q ? (
        <>
          <FadeUp>
            <p className="mt-6 text-slate-500">
              <span className="font-bold text-[#0F172A]">{total}</span> results for “{q}”
            </p>
          </FadeUp>

          <div className="mt-5 flex items-center gap-2">
            {tabs.map((t) => (
              <Link
                key={t.key}
                href={`/market/search?q=${encodeURIComponent(q)}&tab=${t.key}`}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  tab === t.key ? "bg-[#0F172A] text-white" : "bg-white text-[#0F172A] hover:bg-slate-100"
                }`}
              >
                {t.label}
              </Link>
            ))}
            <span className="ml-auto hidden items-center gap-1.5 text-sm text-slate-400 sm:inline-flex">
              <SlidersHorizontal className="h-4 w-4" /> Showing best matches
            </span>
          </div>

          {total === 0 && (
            <div className="mt-16 text-center text-slate-500">
              <p className="text-lg font-semibold text-[#0F172A]">No results found</p>
              <p className="mt-1">Try a different keyword like “design”, “web”, or “audio”.</p>
            </div>
          )}

          {showServices && services.length > 0 && (
            <section className="mt-10">
              <h2 className="text-xl font-extrabold text-[#0F172A]">Services</h2>
              <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {services.map((s) => <ServiceCard key={s.id} service={s} />)}
              </div>
            </section>
          )}

          {showProducts && products.length > 0 && (
            <section className="mt-12">
              <h2 className="text-xl font-extrabold text-[#0F172A]">Products</h2>
              <div className="mt-5 grid grid-cols-2 gap-6 lg:grid-cols-4">
                {products.map((p) => <NexusProductCard key={p.id} product={p} />)}
              </div>
            </section>
          )}
        </>
      ) : (
        <p className="mt-10 text-slate-500">Type a keyword above to search across services and products.</p>
      )}
    </div>
  );
}
