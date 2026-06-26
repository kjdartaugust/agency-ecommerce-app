"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingCart, Heart, Check } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/lib/types";
import { useCart } from "@/lib/store";
import { formatPrice } from "@/lib/utils";

export function NexusBuyBox({ product }: { product: Product }) {
  const add = useCart((s) => s.add);
  const [qty, setQty] = useState(1);
  const onSale = product.compare_at_price && product.compare_at_price > product.price;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-extrabold text-[#0F172A]">{formatPrice(product.price)}</span>
        {onSale && (
          <span className="text-lg text-slate-400 line-through">{formatPrice(product.compare_at_price!)}</span>
        )}
      </div>

      <p className="mt-3 text-sm font-semibold">
        {product.stock > 0 ? (
          <span className="inline-flex items-center gap-1.5 text-emerald-600">
            <Check className="h-4 w-4" /> In stock{product.stock <= 10 && ` — only ${product.stock} left`}
          </span>
        ) : (
          <span className="text-[#FF6B47]">Sold out</span>
        )}
      </p>

      <div className="mt-5 flex items-center gap-3">
        <div className="flex items-center rounded-xl border border-slate-200">
          <button className="flex h-11 w-11 items-center justify-center text-[#0F172A]" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease">
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-8 text-center font-bold">{qty}</span>
          <button className="flex h-11 w-11 items-center justify-center text-[#0F172A] disabled:opacity-40" onClick={() => setQty((q) => Math.min(product.stock, q + 1))} disabled={qty >= product.stock} aria-label="Increase">
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <span className="text-sm text-slate-400">{product.stock} available</span>
      </div>

      <button
        disabled={product.stock === 0}
        onClick={() => {
          add({
            productId: product.id, name: product.name, slug: product.slug,
            price: product.price, image_url: product.image_url, stock: product.stock,
          }, qty);
          toast.success(`${product.name} added to cart`);
        }}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF6B47] py-3.5 font-bold text-white transition-colors hover:bg-[#ff5530] disabled:opacity-40"
      >
        <ShoppingCart className="h-5 w-5" /> Add to cart
      </button>
      <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 font-semibold text-[#0F172A] transition-colors hover:bg-slate-50">
        <Heart className="h-4 w-4" /> Save for later
      </button>

      <ul className="mt-6 space-y-2 border-t border-slate-100 pt-5 text-sm text-slate-500">
        <li>• Free shipping over $100</li>
        <li>• 30-day returns</li>
        <li>• Buyer protection guarantee</li>
      </ul>
    </div>
  );
}
