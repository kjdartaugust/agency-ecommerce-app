import type { Metadata } from "next";
import { getCategories, getProducts } from "@/lib/data";
import { NexusProductFilters } from "@/components/nexus/product-filters";
import { NexusProductCard } from "@/components/nexus/product-card";
import { FadeUp, Stagger, StaggerItem } from "@/components/nexus/motion";

export const metadata: Metadata = {
  title: "Products",
  description: "Shop beautifully made products from independent, verified sellers.",
};

export default async function NexusProductsPage({
  searchParams,
}: {
  searchParams: { category?: string; sort?: string; search?: string };
}) {
  const [products, categories] = await Promise.all([
    getProducts(searchParams),
    getCategories(),
  ]);
  const active = categories.find((c) => c.slug === searchParams.category);

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
      <FadeUp>
        <h1 className="text-3xl font-extrabold tracking-tight text-[#0F172A] sm:text-4xl">
          {active ? active.name : "All products"}
        </h1>
        <p className="mt-2 text-slate-500">{products.length} products from verified sellers.</p>
      </FadeUp>

      <div className="mt-8">
        <NexusProductFilters categories={categories} />
      </div>

      {products.length === 0 ? (
        <p className="mt-16 text-center text-slate-500">No products match these filters.</p>
      ) : (
        <Stagger className="mt-8 grid grid-cols-2 gap-6 lg:grid-cols-4">
          {products.map((p) => (
            <StaggerItem key={p.id}>
              <NexusProductCard product={p} />
            </StaggerItem>
          ))}
        </Stagger>
      )}
    </div>
  );
}
