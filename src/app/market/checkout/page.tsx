"use client";

import { Suspense, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Check, CreditCard, Lock, MapPin, ShoppingBag, CheckCircle2 } from "lucide-react";
import { useCart } from "@/lib/store";
import { getService, getSeller } from "@/lib/nexus/data";
import { formatPrice, cn } from "@/lib/utils";

const steps = ["Cart", "Address", "Payment", "Done"];

function CheckoutInner() {
  const params = useSearchParams();
  const { items, subtotal, clear } = useCart();
  const [step, setStep] = useState(0);

  // A service order (from "Order Now") or the product cart.
  const service = params.get("service") ? getService(params.get("service")!) : null;
  const tierName = params.get("tier");
  const tier = service?.tiers.find((t) => t.name === tierName) ?? service?.tiers[1];

  const lineItems = useMemo(() => {
    if (service && tier) {
      const seller = getSeller(service.seller_id);
      return [{
        id: service.id, name: `${service.title} — ${tier.name}`,
        price: tier.price, quantity: 1, image_url: service.cover_url,
        meta: seller ? `by ${seller.name}` : "",
      }];
    }
    return items.map((i) => ({ id: i.productId, name: i.name, price: i.price, quantity: i.quantity, image_url: i.image_url, meta: "" }));
  }, [service, tier, items]);

  const sub = service && tier ? tier.price : subtotal();
  const fee = Math.round(sub * 0.05);
  const total = sub + fee;
  const empty = lineItems.length === 0;

  function next() {
    if (step === 2 && !service) clear();
    setStep((s) => Math.min(s + 1, 3));
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
      <h1 className="text-2xl font-extrabold tracking-tight text-[#0F172A] sm:text-3xl">Checkout</h1>

      {/* Progress bar */}
      <div className="mt-6 flex items-center">
        {steps.map((label, i) => (
          <div key={label} className="flex flex-1 items-center last:flex-none">
            <div className="flex items-center gap-2">
              <span className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-colors",
                i <= step ? "bg-[#FF6B47] text-white" : "bg-slate-100 text-slate-400"
              )}>
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </span>
              <span className={cn("hidden text-sm font-semibold sm:block", i <= step ? "text-[#0F172A]" : "text-slate-400")}>{label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={cn("mx-3 h-1 flex-1 rounded", i < step ? "bg-[#FF6B47]" : "bg-slate-100")} />
            )}
          </div>
        ))}
      </div>

      {empty && step < 3 ? (
        <div className="mt-16 text-center">
          <ShoppingBag className="mx-auto h-10 w-10 text-slate-300" />
          <p className="mt-3 text-lg font-bold text-[#0F172A]">Nothing to check out</p>
          <Link href="/market/products" className="mt-4 inline-block rounded-full bg-[#FF6B47] px-6 py-3 font-bold text-white">Shop products</Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                {step === 0 && (
                  <div className="rounded-2xl border border-slate-200 bg-white p-6">
                    <h2 className="font-extrabold text-[#0F172A]">Review your order</h2>
                    <div className="mt-4 divide-y divide-slate-100">
                      {lineItems.map((i) => (
                        <div key={i.id} className="flex items-center gap-4 py-4">
                          <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-slate-100">
                            <Image src={i.image_url} alt={i.name} fill sizes="64px" className="object-cover" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-[#0F172A]">{i.name}</p>
                            <p className="text-sm text-slate-400">Qty {i.quantity}{i.meta && ` · ${i.meta}`}</p>
                          </div>
                          <p className="font-semibold">{formatPrice(i.price * i.quantity)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div className="rounded-2xl border border-slate-200 bg-white p-6">
                    <h2 className="flex items-center gap-2 font-extrabold text-[#0F172A]"><MapPin className="h-5 w-5 text-[#FF6B47]" /> Shipping address</h2>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <Field label="Full name" placeholder="Ada Lovelace" />
                      <Field label="Email" placeholder="you@email.com" type="email" />
                      <Field label="Address" placeholder="123 Market St" className="sm:col-span-2" />
                      <Field label="City" placeholder="San Francisco" />
                      <Field label="Postal code" placeholder="94016" />
                      <Field label="Country" placeholder="United States" className="sm:col-span-2" />
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="rounded-2xl border border-slate-200 bg-white p-6">
                    <h2 className="flex items-center gap-2 font-extrabold text-[#0F172A]"><CreditCard className="h-5 w-5 text-[#FF6B47]" /> Payment</h2>
                    <p className="mt-1 text-sm text-slate-400">Secured by Stripe — test mode. Use card 4242 4242 4242 4242.</p>
                    <div className="mt-4 space-y-4">
                      <Field label="Card number" placeholder="4242 4242 4242 4242" />
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Expiry" placeholder="12 / 28" />
                        <Field label="CVC" placeholder="123" />
                      </div>
                      <Field label="Name on card" placeholder="Ada Lovelace" />
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                      <CheckCircle2 className="h-9 w-9 text-emerald-600" />
                    </div>
                    <h2 className="mt-5 text-2xl font-extrabold text-[#0F172A]">Order confirmed!</h2>
                    <p className="mt-2 text-slate-500">A receipt is on its way. Track progress from your dashboard.</p>
                    <div className="mt-6 flex justify-center gap-3">
                      <Link href="/market/buyer" className="rounded-full bg-[#FF6B47] px-6 py-3 font-bold text-white hover:bg-[#ff5530]">My orders</Link>
                      <Link href="/market" className="rounded-full border border-slate-200 px-6 py-3 font-bold text-[#0F172A] hover:bg-slate-50">Keep browsing</Link>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {step < 3 && (
              <div className="mt-6 flex items-center justify-between">
                <button
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  disabled={step === 0}
                  className="rounded-full border border-slate-200 px-6 py-3 font-bold text-[#0F172A] transition-colors hover:bg-slate-50 disabled:opacity-40"
                >
                  Back
                </button>
                <button
                  onClick={next}
                  className="inline-flex items-center gap-2 rounded-full bg-[#FF6B47] px-7 py-3 font-bold text-white transition-colors hover:bg-[#ff5530]"
                >
                  {step === 2 ? <><Lock className="h-4 w-4" /> Pay {formatPrice(total)}</> : "Continue"}
                </button>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="h-fit rounded-2xl border border-slate-200 bg-white p-6 lg:sticky lg:top-24">
            <h2 className="font-extrabold text-[#0F172A]">Order summary</h2>
            <div className="mt-4 space-y-3">
              {lineItems.map((i) => (
                <div key={i.id} className="flex items-center justify-between text-sm">
                  <span className="truncate pr-2 text-slate-600">{i.quantity}× {i.name}</span>
                  <span className="shrink-0 font-semibold">{formatPrice(i.price * i.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-sm">
              <Row label="Subtotal" value={formatPrice(sub)} />
              <Row label="Service fee (5%)" value={formatPrice(fee)} />
              <div className="flex justify-between border-t border-slate-100 pt-2 text-base font-extrabold text-[#0F172A]">
                <span>Total</span><span>{formatPrice(total)}</span>
              </div>
            </div>
            <p className="mt-4 flex items-center gap-1.5 text-xs text-slate-400">
              <Lock className="h-3.5 w-3.5" /> Buyer protection on every order.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, placeholder, type = "text", className }: { label: string; placeholder?: string; type?: string; className?: string }) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-sm font-semibold text-[#0F172A]">{label}</label>
      <input type={type} placeholder={placeholder} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-[#FF6B47]" />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-slate-500">
      <span>{label}</span><span className="font-semibold text-[#0F172A]">{value}</span>
    </div>
  );
}

export default function NexusCheckout() {
  return (
    <Suspense>
      <CheckoutInner />
    </Suspense>
  );
}
