"use client";

import Image from "next/image";
import { useState } from "react";
import { Minus, Plus, ShoppingBag, Check } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/lib/types";
import { useCart } from "@/lib/store";
import { formatPrice, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Stars } from "@/components/ui/stars";

export function ProductDetail({ product }: { product: Product }) {
  const add = useCart((s) => s.add);
  const gallery = product.gallery?.length ? product.gallery : [product.image_url];
  const [active, setActive] = useState(gallery[0]);
  const [qty, setQty] = useState(1);
  const onSale = product.compare_at_price && product.compare_at_price > product.price;

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div>
        <div className="relative aspect-square overflow-hidden rounded-3xl bg-secondary">
          <Image src={active} alt={product.name} fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover" priority />
        </div>
        {gallery.length > 1 && (
          <div className="mt-4 flex gap-3">
            {gallery.map((src) => (
              <button
                key={src}
                onClick={() => setActive(src)}
                className={cn(
                  "relative h-20 w-20 overflow-hidden rounded-xl border-2",
                  active === src ? "border-primary" : "border-transparent"
                )}
              >
                <Image src={src} alt="" fill sizes="80px" className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        {product.category && <Badge variant="secondary">{product.category.name}</Badge>}
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          {product.name}
        </h1>
        <div className="mt-3 flex items-center gap-3">
          <Stars rating={product.rating} />
          <span className="text-sm text-muted-foreground">
            {product.rating.toFixed(1)} · {product.review_count} reviews
          </span>
        </div>

        <div className="mt-5 flex items-center gap-3">
          <span className="font-display text-3xl font-bold">{formatPrice(product.price)}</span>
          {onSale && (
            <>
              <span className="text-lg text-muted-foreground line-through">
                {formatPrice(product.compare_at_price!)}
              </span>
              <Badge variant="accent">
                Save {formatPrice(product.compare_at_price! - product.price)}
              </Badge>
            </>
          )}
        </div>

        <p className="mt-6 leading-relaxed text-muted-foreground">{product.description}</p>

        <div className="mt-4 flex items-center gap-2 text-sm">
          {product.stock > 0 ? (
            <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <Check className="h-4 w-4" /> In stock
              {product.stock <= 10 && ` — only ${product.stock} left`}
            </span>
          ) : (
            <span className="text-destructive">Sold out</span>
          )}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <div className="flex items-center rounded-full border border-border">
            <button
              className="flex h-12 w-12 items-center justify-center"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              aria-label="Decrease quantity"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-8 text-center font-medium">{qty}</span>
            <button
              className="flex h-12 w-12 items-center justify-center disabled:opacity-40"
              onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
              disabled={qty >= product.stock}
              aria-label="Increase quantity"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <Button
            size="lg"
            disabled={product.stock === 0}
            className="flex-1"
            onClick={() => {
              add(
                {
                  productId: product.id,
                  name: product.name,
                  slug: product.slug,
                  price: product.price,
                  image_url: product.image_url,
                  stock: product.stock,
                },
                qty
              );
              toast.success(`${product.name} added to cart`);
            }}
          >
            <ShoppingBag className="h-5 w-5" /> Add to cart
          </Button>
        </div>

        <ul className="mt-8 grid gap-2 border-t border-border pt-6 text-sm text-muted-foreground">
          <li>• Free carbon-neutral shipping over $100</li>
          <li>• 30-day returns, no questions asked</li>
          <li>• 2-year warranty on all products</li>
        </ul>
      </div>
    </div>
  );
}
