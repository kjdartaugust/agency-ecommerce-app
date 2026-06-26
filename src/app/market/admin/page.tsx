import type { Metadata } from "next";
import { DollarSign, Users, ShoppingBag, Flag, ShieldAlert, Ban, Check } from "lucide-react";
import { platformStats } from "@/lib/nexus/data";
import { adminRevenueSeries, adminUsers, flaggedListings } from "@/lib/nexus/dashboard";
import { RevenueLineChart } from "@/components/nexus/charts";
import { FadeUp } from "@/components/nexus/motion";

export const metadata: Metadata = { title: "Admin Panel" };

export default function NexusAdmin() {
  const stats = [
    { label: "Platform revenue", value: "$1.49M", icon: DollarSign, delta: "+14% MoM" },
    { label: "Total users", value: platformStats.sellers.toLocaleString(), icon: Users, delta: "+820 this month" },
    { label: "Active listings", value: platformStats.products.toLocaleString(), icon: ShoppingBag, delta: "+1,240" },
    { label: "Flagged items", value: String(flaggedListings.length), icon: Flag, delta: "Needs review" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
      <FadeUp>
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0F172A] text-[#FF6B47]">
            <ShieldAlert className="h-6 w-6" />
          </span>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-[#0F172A] sm:text-3xl">Admin panel</h1>
            <p className="text-sm text-slate-500">Platform health, users, and moderation at a glance.</p>
          </div>
        </div>
      </FadeUp>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0F172A] text-[#FF6B47]">
                <s.icon className="h-5 w-5" />
              </span>
            </div>
            <p className="mt-4 text-2xl font-extrabold text-[#0F172A]">{s.value}</p>
            <p className="text-sm text-slate-400">{s.label}</p>
            <p className="mt-1 text-xs font-semibold text-[#FF6B47]">{s.delta}</p>
          </div>
        ))}
      </div>

      {/* Revenue analytics */}
      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-extrabold text-[#0F172A]">Revenue — services vs products</h2>
          <div className="flex items-center gap-4 text-sm font-semibold">
            <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#FF6B47]" /> Services</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#0F172A]" /> Products</span>
          </div>
        </div>
        <div className="mt-4">
          <RevenueLineChart data={adminRevenueSeries} />
        </div>
      </section>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.3fr_1fr]">
        {/* User management */}
        <section>
          <h2 className="text-xl font-extrabold text-[#0F172A]">User management</h2>
          <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">User</th>
                  <th className="px-5 py-3 font-semibold">Role</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {adminUsers.map((u) => (
                  <tr key={u.id} className={u.flagged ? "bg-[#FF6B47]/5" : ""}>
                    <td className="px-5 py-3 font-semibold text-[#0F172A]">{u.name}</td>
                    <td className="px-5 py-3 text-slate-600">{u.role}</td>
                    <td className="px-5 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                        u.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                      }`}>{u.status}</span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-1.5">
                        <button className="rounded-lg border border-slate-200 p-1.5 text-emerald-600 hover:bg-slate-50" aria-label="Approve"><Check className="h-4 w-4" /></button>
                        <button className="rounded-lg border border-slate-200 p-1.5 text-red-600 hover:bg-slate-50" aria-label="Suspend"><Ban className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Moderation */}
        <section>
          <h2 className="text-xl font-extrabold text-[#0F172A]">Listing moderation</h2>
          <div className="mt-4 space-y-3">
            {flaggedListings.map((f) => (
              <div key={f.id} className="rounded-2xl border border-[#FF6B47]/30 bg-[#FF6B47]/5 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-[#0F172A]">{f.title}</p>
                    <p className="text-sm text-slate-500">by {f.seller}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-1 text-xs font-bold text-red-700">
                    <Flag className="h-3 w-3" /> {f.reports}
                  </span>
                </div>
                <p className="mt-2 text-sm font-semibold text-[#FF6B47]">{f.reason}</p>
                <div className="mt-3 flex gap-2">
                  <button className="flex-1 rounded-lg bg-[#0F172A] py-2 text-xs font-bold text-white hover:bg-[#1e293b]">Remove listing</button>
                  <button className="flex-1 rounded-lg border border-slate-200 bg-white py-2 text-xs font-bold text-[#0F172A] hover:bg-slate-50">Dismiss</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
