import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Package, Clock, Heart, MessageSquare, CheckCircle2, Truck } from "lucide-react";
import { getProducts } from "@/lib/data";
import { buyerOrders, buyerMessages } from "@/lib/nexus/dashboard";
import { formatPrice, cn } from "@/lib/utils";
import { NexusProductCard } from "@/components/nexus/product-card";
import { FadeUp } from "@/components/nexus/motion";

export const metadata: Metadata = { title: "My Orders" };

const trackSteps = ["Placed", "In progress", "Delivered"];

export default async function BuyerDashboard() {
  const saved = (await getProducts({ featured: true })).slice(0, 4);
  const active = buyerOrders.filter((o) => o.status !== "Completed");

  const stats = [
    { label: "Active orders", value: String(active.length), icon: Package },
    { label: "Completed", value: String(buyerOrders.length - active.length), icon: CheckCircle2 },
    { label: "Saved items", value: String(saved.length), icon: Heart },
    { label: "Unread messages", value: String(buyerMessages.filter((m) => m.unread).length), icon: MessageSquare },
  ];

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
      <FadeUp>
        <h1 className="text-2xl font-extrabold tracking-tight text-[#0F172A] sm:text-3xl">My dashboard</h1>
        <p className="mt-1 text-slate-500">Track orders, revisit purchases, and chat with sellers.</p>
      </FadeUp>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-slate-200 bg-white p-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0F172A] text-[#FF6B47]">
              <s.icon className="h-5 w-5" />
            </span>
            <p className="mt-4 text-2xl font-extrabold text-[#0F172A]">{s.value}</p>
            <p className="text-sm text-slate-400">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Order tracking */}
      <section className="mt-10">
        <h2 className="text-xl font-extrabold text-[#0F172A]">Order tracking</h2>
        <div className="mt-4 space-y-4">
          {active.map((o) => (
            <div key={o.id} className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-bold text-[#0F172A]">{o.item}</p>
                  <p className="text-sm text-slate-400">{o.id} · {o.seller} · {o.type}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#FF6B47]">
                    {o.type === "Product" ? <Truck className="h-4 w-4" /> : <Clock className="h-4 w-4" />} {o.eta}
                  </span>
                  <span className="font-extrabold text-[#0F172A]">{formatPrice(o.price)}</span>
                </div>
              </div>
              <div className="mt-5 flex items-center">
                {trackSteps.map((label, i) => (
                  <div key={label} className="flex flex-1 items-center last:flex-none">
                    <div className="flex flex-col items-center">
                      <span className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold",
                        i <= o.step ? "bg-[#FF6B47] text-white" : "bg-slate-100 text-slate-400"
                      )}>
                        {i < o.step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                      </span>
                      <span className="mt-1.5 text-xs text-slate-400">{label}</span>
                    </div>
                    {i < trackSteps.length - 1 && (
                      <div className={cn("mx-2 h-1 flex-1 rounded", i < o.step ? "bg-[#FF6B47]" : "bg-slate-100")} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        {/* Purchase history */}
        <section>
          <h2 className="text-xl font-extrabold text-[#0F172A]">Purchase history</h2>
          <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Item</th>
                  <th className="px-5 py-3 font-semibold">Seller</th>
                  <th className="px-5 py-3 font-semibold">Total</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {buyerOrders.map((o) => (
                  <tr key={o.id}>
                    <td className="px-5 py-3 font-semibold text-[#0F172A]">{o.item}</td>
                    <td className="px-5 py-3 text-slate-600">{o.seller}</td>
                    <td className="px-5 py-3 font-semibold">{formatPrice(o.price)}</td>
                    <td className="px-5 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                        o.status === "Completed" ? "bg-emerald-100 text-emerald-700" : "bg-[#FF6B47]/12 text-[#FF6B47]"
                      }`}>{o.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Messages */}
        <section id="messages" className="scroll-mt-24">
          <h2 className="text-xl font-extrabold text-[#0F172A]">Messages</h2>
          <div className="mt-4 divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200 bg-white">
            {buyerMessages.map((m) => (
              <button key={m.id} className="flex w-full items-center gap-3 p-4 text-left hover:bg-slate-50">
                <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full">
                  <Image src={m.avatar} alt={m.from} fill sizes="44px" className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-[#0F172A]">{m.from}</p>
                    <span className="text-xs text-slate-400">{m.time}</span>
                  </div>
                  <p className="truncate text-sm text-slate-500">{m.preview}</p>
                </div>
                {m.unread && <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#FF6B47]" />}
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* Saved items */}
      <section id="saved" className="mt-10 scroll-mt-24">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-[#0F172A]">Saved items</h2>
          <Link href="/market/products" className="text-sm font-bold text-[#FF6B47] hover:underline">Browse more</Link>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-6 lg:grid-cols-4">
          {saved.map((p) => <NexusProductCard key={p.id} product={p} />)}
        </div>
      </section>
    </div>
  );
}
