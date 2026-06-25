"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Lock } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import { Section } from "@/components/ui/section";
import { Button, LinkButton } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";

const SHIPPING_THRESHOLD = 10000;
const SHIPPING_FEE = 900;

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const params = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (params.get("cancelled")) toast.error("Checkout cancelled — your cart is saved.");
  }, [params]);

  const sub = subtotal();
  const shipping = sub === 0 || sub >= SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = sub + shipping;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.productId,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
            image_url: i.image_url,
          })),
          email: String(form.get("email")),
          shipping_name: String(form.get("shipping_name")),
          shipping_address: String(form.get("shipping_address")),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");
      if (data.demo) clear();
      window.location.href = data.url;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Checkout failed");
      setLoading(false);
    }
  }

  if (mounted && items.length === 0) {
    return (
      <Section className="pt-20 text-center">
        <h1 className="font-display text-3xl font-bold">Your cart is empty</h1>
        <p className="mt-3 text-muted-foreground">Add a few things before checking out.</p>
        <LinkButton href="/shop" className="mt-6">Browse the shop</LinkButton>
      </Section>
    );
  }

  return (
    <Section className="pt-12">
      <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Checkout</h1>
      <div className="mt-10 grid gap-10 lg:grid-cols-[1.2fr_1fr]">
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
            <h2 className="font-display text-lg font-semibold">Contact & shipping</h2>
            <div className="mt-5 space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required placeholder="you@email.com" />
              </div>
              <div>
                <Label htmlFor="shipping_name">Full name</Label>
                <Input id="shipping_name" name="shipping_name" required placeholder="Ada Lovelace" />
              </div>
              <div>
                <Label htmlFor="shipping_address">Shipping address</Label>
                <Textarea
                  id="shipping_address"
                  name="shipping_address"
                  required
                  placeholder="Street, city, postal code, country"
                />
              </div>
            </div>
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            <Lock className="h-4 w-4" />
            {loading ? "Redirecting…" : `Pay ${formatPrice(total)}`}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Payments are processed securely by Stripe (test mode). Use card 4242 4242 4242 4242.
          </p>
        </form>

        <div className="h-fit rounded-3xl border border-border bg-card/50 p-6 lg:sticky lg:top-24">
          <h2 className="font-display text-lg font-semibold">Order summary</h2>
          <div className="mt-5 space-y-4">
            {mounted &&
              items.map((i) => (
                <div key={i.productId} className="flex gap-3">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-secondary">
                    <Image src={i.image_url} alt={i.name} fill sizes="64px" className="object-cover" />
                  </div>
                  <div className="flex flex-1 justify-between">
                    <div>
                      <p className="text-sm font-medium">{i.name}</p>
                      <p className="text-sm text-muted-foreground">Qty {i.quantity}</p>
                    </div>
                    <p className="text-sm font-medium">{formatPrice(i.price * i.quantity)}</p>
                  </div>
                </div>
              ))}
          </div>
          <div className="mt-6 space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatPrice(sub)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-2 font-display text-base font-semibold">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
