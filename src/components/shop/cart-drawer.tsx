"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import { Button, LinkButton } from "@/components/ui/button";

export function CartDrawer() {
  const { isOpen, close, items, setQty, remove, subtotal } = useCart();

  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-black/50 transition-opacity ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={close}
        aria-hidden
      />
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-card shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-label="Shopping cart"
      >
        <div className="flex items-center justify-between border-b border-border p-5">
          <h2 className="font-display text-lg font-semibold">
            Your cart ({items.reduce((n, i) => n + i.quantity, 0)})
          </h2>
          <Button variant="ghost" size="icon" onClick={close} aria-label="Close cart">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
              <ShoppingBag className="h-7 w-7 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">Your cart is empty.</p>
            <LinkButton href="/shop" onClick={close} variant="secondary">
              Browse the shop
            </LinkButton>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-4 overflow-y-auto p-5">
              {items.map((item) => (
                <div key={item.productId} className="flex gap-4">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-secondary">
                    <Image src={item.image_url} alt={item.name} fill className="object-cover" sizes="80px" />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between gap-2">
                      <Link
                        href={`/shop/${item.slug}`}
                        onClick={close}
                        className="text-sm font-medium hover:underline"
                      >
                        {item.name}
                      </Link>
                      <button
                        onClick={() => remove(item.productId)}
                        className="text-muted-foreground hover:text-destructive"
                        aria-label="Remove"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="mt-0.5 text-sm text-muted-foreground">{formatPrice(item.price)}</p>
                    <div className="mt-auto flex items-center gap-2">
                      <div className="flex items-center rounded-full border border-border">
                        <button
                          className="flex h-7 w-7 items-center justify-center"
                          onClick={() => setQty(item.productId, item.quantity - 1)}
                          aria-label="Decrease"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-6 text-center text-sm">{item.quantity}</span>
                        <button
                          className="flex h-7 w-7 items-center justify-center disabled:opacity-40"
                          onClick={() => setQty(item.productId, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          aria-label="Increase"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-4 border-t border-border p-5">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-display text-lg font-semibold">{formatPrice(subtotal())}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Shipping & taxes calculated at checkout.
              </p>
              <LinkButton href="/checkout" onClick={close} size="lg" className="w-full">
                Checkout
              </LinkButton>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
