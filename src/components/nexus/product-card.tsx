"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/lib/types";
import { useCart } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import { NexusStars } from "@/components/nexus/ui";
import { sellers } from "@/lib/nexus/data";

// Deterministically attribute a marketplace seller to each product.
function sellerFor(id: string) {
  const sum = id.split("").reduce((n, c) => n + c.charCodeAt(0), 0);
  return sellers[sum % sellers.length];
}

export function NexusProductCard({ product }: { product: Product }) {
  const add = useCart((s) => s.add);
  const seller = sellerFor(product.id);
  const onSale = product.compare_at_price && product.compare_at_price > product.price;

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:border-[#FF6B47]/40 hover:shadow-xl">
      <Link href={`/market/products/${product.slug}`} className="relative block aspect-square overflow-hidden bg-slate-100">
        <Image
          src={product.image_url}
          alt={product.name}
          fill
          sizes="(max-width:768px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {onSale && (
          <span className="absolute left-3 top-3 rounded-full bg-[#FF6B47] px-2.5 py-1 text-xs font-bold text-white">
            Sale
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <span className="text-xs font-semibold text-slate-400">by {seller.name}</span>
        <Link
          href={`/market/products/${product.slug}`}
          className="mt-1 line-clamp-1 font-semibold text-[#0F172A] group-hover:text-[#FF6B47]"
        >
          {product.name}
        </Link>
        <div className="mt-2">
          <NexusStars rating={product.rating} count={product.review_count} />
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-extrabold text-[#0F172A]">{formatPrice(product.price)}</span>
            {onSale && (
              <span className="text-xs text-slate-400 line-through">{formatPrice(product.compare_at_price!)}</span>
            )}
          </div>
          <button
            aria-label={`Add ${product.name} to cart`}
            disabled={product.stock === 0}
            onClick={() => {
              add({
                productId: product.id,
                name: product.name,
                slug: product.slug,
                price: product.price,
                image_url: product.image_url,
                stock: product.stock,
              });
              toast.success(`${product.name} added to cart`);
            }}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0F172A] text-white transition-colors hover:bg-[#FF6B47] disabled:opacity-40"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
