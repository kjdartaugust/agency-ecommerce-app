"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/lib/types";
import { useCart } from "@/lib/store";
import { cn, formatPrice } from "@/lib/utils";
import { Stars } from "@/components/ui/stars";
import { Badge } from "@/components/ui/badge";

export function ProductCard({ product }: { product: Product }) {
  const add = useCart((s) => s.add);
  const onSale = product.compare_at_price && product.compare_at_price > product.price;

  return (
    <div className="group relative flex flex-col">
      <Link
        href={`/shop/${product.slug}`}
        className="relative aspect-square overflow-hidden rounded-2xl bg-secondary"
      >
        <Image
          src={product.image_url}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {onSale && <Badge variant="accent" className="absolute left-3 top-3">Sale</Badge>}
        {product.stock === 0 && (
          <span className="absolute inset-0 flex items-center justify-center bg-background/60 text-sm font-semibold">
            Sold out
          </span>
        )}
      </Link>

      <div className="mt-3 flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/shop/${product.slug}`} className="font-medium leading-tight hover:underline">
            {product.name}
          </Link>
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
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-105 disabled:opacity-40"
            )}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-1 flex items-center gap-2">
          <Stars rating={product.rating} />
          <span className="text-xs text-muted-foreground">({product.review_count})</span>
        </div>
        <div className="mt-1.5 flex items-center gap-2">
          <span className="font-display font-semibold">{formatPrice(product.price)}</span>
          {onSale && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.compare_at_price!)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
