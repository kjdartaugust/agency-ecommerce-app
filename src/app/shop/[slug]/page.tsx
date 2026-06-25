import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getProduct, getProducts, getReviews } from "@/lib/data";
import { Section } from "@/components/ui/section";
import { LinkButton } from "@/components/ui/button";
import { ProductDetail } from "@/components/shop/product-detail";
import { ProductCard } from "@/components/shop/product-card";
import { Reviews } from "@/components/shop/reviews";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const product = await getProduct(params.slug);
  if (!product) return { title: "Product not found" };
  return { title: product.name, description: product.description.slice(0, 150) };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug);
  if (!product) notFound();

  const [reviews, related] = await Promise.all([
    getReviews(product.id),
    getProducts({ category: product.category?.slug }),
  ]);

  return (
    <Section className="pt-12">
      <LinkButton href="/shop" variant="ghost" size="sm" className="mb-8 -ml-2">
        <ArrowLeft className="h-4 w-4" /> Shop
      </LinkButton>

      <ProductDetail product={product} />

      <div className="mt-20 border-t border-border pt-14">
        <Reviews productId={product.id} initial={reviews} />
      </div>

      {related.filter((p) => p.id !== product.id).length > 0 && (
        <div className="mt-20 border-t border-border pt-14">
          <h2 className="font-display text-2xl font-bold">You might also like</h2>
          <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
            {related
              .filter((p) => p.id !== product.id)
              .slice(0, 4)
              .map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
          </div>
        </div>
      )}
    </Section>
  );
}
