import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, Clock, MessageSquare } from "lucide-react";
import { getProduct, getProducts } from "@/lib/data";
import { sellers } from "@/lib/nexus/data";
import { NexusStars, VerifiedBadge, LevelBadge } from "@/components/nexus/ui";
import { Gallery } from "@/components/nexus/gallery";
import { NexusBuyBox } from "@/components/nexus/buy-box";
import { NexusProductCard } from "@/components/nexus/product-card";

function sellerFor(id: string) {
  const sum = id.split("").reduce((n, c) => n + c.charCodeAt(0), 0);
  return sellers[sum % sellers.length];
}

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getProduct(params.slug);
  if (!product) return { title: "Product not found" };
  return { title: product.name, description: product.description.slice(0, 150) };
}

export default async function NexusProductDetail({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug);
  if (!product) notFound();
  const seller = sellerFor(product.id);
  const related = (await getProducts({ category: product.category?.slug })).filter((p) => p.id !== product.id);
  const gallery = product.gallery?.length ? product.gallery : [product.image_url];

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
      <Link href="/market/products" className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-[#FF6B47]">
        <ArrowLeft className="h-4 w-4" /> All products
      </Link>

      <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
        <div>
          <Gallery images={gallery} alt={product.name} />
        </div>

        <div>
          {product.category && (
            <span className="text-sm font-semibold text-[#FF6B47]">{product.category.name}</span>
          )}
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[#0F172A] sm:text-4xl">{product.name}</h1>
          <div className="mt-3">
            <NexusStars rating={product.rating} count={product.review_count} />
          </div>
          <p className="mt-5 leading-relaxed text-slate-600">{product.description}</p>

          <div className="mt-6">
            <NexusBuyBox product={product} />
          </div>

          {/* Seller card */}
          <div className="mt-6 flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4">
            <div className="relative h-12 w-12 overflow-hidden rounded-full">
              <Image src={seller.avatar_url} alt={seller.name} fill sizes="48px" className="object-cover" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Link href={`/market/sellers/${seller.slug}`} className="font-bold text-[#0F172A] hover:text-[#FF6B47]">
                  {seller.name}
                </Link>
                {seller.verified && <VerifiedBadge className="text-[11px]" />}
                <LevelBadge level={seller.level} />
              </div>
              <div className="mt-1 flex gap-3 text-xs text-slate-400">
                <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {seller.location}</span>
                <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {seller.response_time}</span>
              </div>
            </div>
            <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-[#0F172A] hover:bg-slate-50">
              <MessageSquare className="h-4 w-4" /> Chat
            </button>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16 border-t border-slate-200 pt-10">
          <h2 className="text-xl font-extrabold text-[#0F172A]">Related products</h2>
          <div className="mt-6 grid grid-cols-2 gap-6 lg:grid-cols-4">
            {related.slice(0, 4).map((p) => <NexusProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
