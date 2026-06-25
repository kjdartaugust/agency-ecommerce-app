import type { Metadata } from "next";
import { getCategories, getProducts } from "@/lib/data";
import { Section, SectionHeader } from "@/components/ui/section";
import { ShopFilters } from "@/components/shop/shop-filters";
import { ProductCard } from "@/components/shop/product-card";

export const metadata: Metadata = {
  title: "Shop",
  description: "A curated store of workspace, audio, lighting, and accessory essentials.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { category?: string; sort?: string; search?: string };
}) {
  const [products, categories] = await Promise.all([
    getProducts({
      category: searchParams.category,
      sort: searchParams.sort,
      search: searchParams.search,
    }),
    getCategories(),
  ]);

  return (
    <Section className="pt-16">
      <SectionHeader
        eyebrow="The shop"
        title="Curated workspace essentials"
        description="Things we use every day, chosen for how they're made and how they last."
      />

      <div className="mt-10">
        <ShopFilters categories={categories} />
      </div>

      {products.length === 0 ? (
        <p className="mt-16 text-center text-muted-foreground">No products match these filters.</p>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </Section>
  );
}
