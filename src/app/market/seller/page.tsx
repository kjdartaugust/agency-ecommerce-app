import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  DollarSign, ShoppingBag, Star, TrendingUp, Eye, Plus, Pencil, ArrowUpRight,
} from "lucide-react";
import { getServicesBySeller, getSeller } from "@/lib/nexus/data";
import {
  earningsSeries, trafficSeries, sellerActiveOrders, payoutHistory,
} from "@/lib/nexus/dashboard";
import { formatPrice } from "@/lib/utils";
import { EarningsAreaChart, TrafficBarChart } from "@/components/nexus/charts";
import { NexusStars, LevelBadge } from "@/components/nexus/ui";
import { FadeUp } from "@/components/nexus/motion";

export const metadata: Metadata = { title: "Seller Dashboard" };

export default function SellerDashboard() {
  const seller = getSeller("s1")!;
  const listings = getServicesBySeller("s1");

  const stats = [
    { label: "Total earnings", value: "$37,700", icon: DollarSign, delta: "+18%" },
    { label: "Active orders", value: "3", icon: ShoppingBag, delta: "+2" },
    { label: "Avg. rating", value: seller.rating.toFixed(1), icon: Star, delta: "4.9★" },
    { label: "Profile views", value: "3,420", icon: Eye, delta: "+12%" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
      {/* Header */}
      <FadeUp>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative h-14 w-14 overflow-hidden rounded-2xl">
              <Image src={seller.avatar_url} alt={seller.name} fill sizes="56px" className="object-cover" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-[#0F172A]">Welcome back, {seller.name.split(" ")[0]}</h1>
              <div className="mt-1 flex items-center gap-2">
                <LevelBadge level={seller.level} />
                <NexusStars rating={seller.rating} count={seller.review_count} />
              </div>
            </div>
          </div>
          <Link href="/market/become-a-seller" className="inline-flex items-center gap-2 rounded-full bg-[#FF6B47] px-5 py-2.5 font-bold text-white hover:bg-[#ff5530]">
            <Plus className="h-4 w-4" /> New listing
          </Link>
        </div>
      </FadeUp>

      {/* Stats */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0F172A] text-[#FF6B47]">
                <s.icon className="h-5 w-5" />
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
                <TrendingUp className="h-3.5 w-3.5" /> {s.delta}
              </span>
            </div>
            <p className="mt-4 text-2xl font-extrabold text-[#0F172A]">{s.value}</p>
            <p className="text-sm text-slate-400">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-[#0F172A]">Earnings overview</h2>
            <span className="text-sm font-semibold text-slate-400">Last 6 months</span>
          </div>
          <div className="mt-4">
            <EarningsAreaChart data={earningsSeries} />
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="font-extrabold text-[#0F172A]">Profile traffic</h2>
          <div className="mt-4">
            <TrafficBarChart data={trafficSeries} />
          </div>
        </div>
      </div>

      {/* Active orders */}
      <section className="mt-10">
        <h2 className="text-xl font-extrabold text-[#0F172A]">Active orders</h2>
        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Order</th>
                <th className="px-5 py-3 font-semibold">Buyer</th>
                <th className="px-5 py-3 font-semibold">Service</th>
                <th className="px-5 py-3 font-semibold">Due</th>
                <th className="px-5 py-3 font-semibold">Value</th>
                <th className="px-5 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sellerActiveOrders.map((o) => (
                <tr key={o.id}>
                  <td className="px-5 py-3 font-bold text-[#0F172A]">{o.id}</td>
                  <td className="px-5 py-3">{o.buyer}</td>
                  <td className="px-5 py-3 text-slate-600">{o.service} <span className="text-slate-400">({o.tier})</span></td>
                  <td className="px-5 py-3">{o.due}</td>
                  <td className="px-5 py-3 font-semibold">{formatPrice(o.price)}</td>
                  <td className="px-5 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                      o.status === "Delivered" ? "bg-emerald-100 text-emerald-700" :
                      o.status === "In progress" ? "bg-[#FF6B47]/12 text-[#FF6B47]" : "bg-slate-100 text-slate-600"
                    }`}>{o.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Listings manager */}
      <section id="listings" className="mt-10 scroll-mt-24">
        <h2 className="text-xl font-extrabold text-[#0F172A]">Your listings</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {listings.map((l) => (
            <div key={l.id} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4">
              <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                <Image src={l.cover_url} alt={l.title} fill sizes="80px" className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-[#0F172A]">{l.title}</p>
                <div className="mt-1 flex items-center gap-3 text-xs text-slate-400">
                  <NexusStars rating={l.rating} count={l.review_count} />
                  <span>From {formatPrice(l.starting_price)}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Link href={`/market/services/${l.slug}`} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-[#0F172A] hover:bg-slate-50">
                  <ArrowUpRight className="h-3.5 w-3.5" /> View
                </Link>
                <button className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-[#0F172A] hover:bg-slate-50">
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Payouts + profile editor */}
      <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section id="payouts" className="scroll-mt-24">
          <h2 className="text-xl font-extrabold text-[#0F172A]">Payout history</h2>
          <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Payout</th>
                  <th className="px-5 py-3 font-semibold">Date</th>
                  <th className="px-5 py-3 font-semibold">Method</th>
                  <th className="px-5 py-3 font-semibold">Amount</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payoutHistory.map((p) => (
                  <tr key={p.id}>
                    <td className="px-5 py-3 font-bold text-[#0F172A]">{p.id}</td>
                    <td className="px-5 py-3 text-slate-600">{p.date}</td>
                    <td className="px-5 py-3 text-slate-600">{p.method}</td>
                    <td className="px-5 py-3 font-semibold">{formatPrice(p.amount)}</td>
                    <td className="px-5 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                        p.status === "Paid" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                      }`}>{p.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="profile" className="scroll-mt-24">
          <h2 className="text-xl font-extrabold text-[#0F172A]">Profile</h2>
          <form className="mt-4 space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-[#0F172A]">Display name</label>
              <input defaultValue={seller.name} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-[#FF6B47]" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-[#0F172A]">Tagline</label>
              <input defaultValue={seller.tagline} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-[#FF6B47]" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-[#0F172A]">Bio</label>
              <textarea defaultValue={seller.bio} rows={4} className="w-full resize-none rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-[#FF6B47]" />
            </div>
            <button type="button" className="w-full rounded-xl bg-[#FF6B47] py-3 font-bold text-white hover:bg-[#ff5530]">
              Save profile
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
