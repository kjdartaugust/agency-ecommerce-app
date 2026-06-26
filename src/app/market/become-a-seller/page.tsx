import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, DollarSign, Globe2, Shield, Zap, Check } from "lucide-react";
import { platformStats } from "@/lib/nexus/data";
import { Counter } from "@/components/nexus/counter";
import { FadeUp, Stagger, StaggerItem } from "@/components/nexus/motion";

export const metadata: Metadata = {
  title: "Become a Seller",
  description: "Turn your skills and products into income on Nexus Market.",
};

const benefits = [
  { icon: DollarSign, title: "Keep more of what you earn", body: "Industry-low fees and fast, reliable payouts straight to your bank." },
  { icon: Globe2, title: "Reach a global audience", body: "Sell to buyers in 142 countries from day one — no marketing budget needed." },
  { icon: Shield, title: "Get paid, protected", body: "Escrow on every order and a dedicated team that has your back." },
  { icon: Zap, title: "Tools that do the heavy lifting", body: "Dashboards, analytics, and messaging built to help you grow." },
];

const steps = [
  { n: "01", title: "Create your profile", body: "Tell buyers who you are and what you do best." },
  { n: "02", title: "List services or products", body: "Set your packages, pricing, and delivery times." },
  { n: "03", title: "Get orders & get paid", body: "Deliver great work and watch your earnings grow." },
];

export default function BecomeASeller() {
  return (
    <>
      <section className="relative overflow-hidden bg-[#0F172A] text-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-10 top-0 h-96 w-96 rounded-full bg-[#FF6B47]/20 blur-3xl" />
        </div>
        <div className="relative mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:items-center">
          <div>
            <FadeUp>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm font-semibold text-white/80">
                <Zap className="h-4 w-4 text-[#FF6B47]" /> Free to join · Sell in minutes
              </span>
            </FadeUp>
            <FadeUp delay={0.05}>
              <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
                Turn your skills into <span className="text-[#FF6B47]">income</span>.
              </h1>
            </FadeUp>
            <FadeUp delay={0.1}>
              <p className="mt-5 max-w-md text-lg text-white/70">
                Join thousands of sellers building real businesses on Nexus Market — services,
                products, or both.
              </p>
            </FadeUp>
            <FadeUp delay={0.15}>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/login" className="inline-flex items-center gap-2 rounded-full bg-[#FF6B47] px-7 py-3.5 font-bold text-white hover:bg-[#ff5530]">
                  Start selling <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/market/services" className="inline-flex items-center gap-2 rounded-full bg-white/10 px-7 py-3.5 font-bold text-white hover:bg-white/20">
                  Explore the market
                </Link>
              </div>
            </FadeUp>
          </div>

          <FadeUp delay={0.2}>
            <div className="grid grid-cols-2 gap-4">
              {[
                { v: platformStats.sellers, s: "+", l: "Active sellers" },
                { v: platformStats.transactions, s: "+", l: "Paid out" },
                { v: platformStats.countries, s: "", l: "Countries" },
                { v: 98, s: "%", l: "Would recommend" },
              ].map((x) => (
                <div key={x.l} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <p className="text-3xl font-extrabold text-[#FF6B47]"><Counter value={x.v} suffix={x.s} /></p>
                  <p className="mt-1 text-sm text-white/60">{x.l}</p>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Benefits */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <FadeUp>
          <h2 className="text-center text-3xl font-extrabold tracking-tight text-[#0F172A]">Why sell on Nexus</h2>
        </FadeUp>
        <Stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b) => (
            <StaggerItem key={b.title}>
              <div className="h-full rounded-2xl border border-slate-200 bg-white p-6">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FF6B47]/10 text-[#FF6B47]">
                  <b.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 font-bold text-[#0F172A]">{b.title}</h3>
                <p className="mt-2 text-sm text-slate-500">{b.body}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* How it works */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
          <FadeUp>
            <h2 className="text-center text-3xl font-extrabold tracking-tight text-[#0F172A]">How it works</h2>
          </FadeUp>
          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            {steps.map((s) => (
              <FadeUp key={s.n}>
                <div className="rounded-2xl border border-slate-200 p-8">
                  <span className="text-4xl font-extrabold text-[#FF6B47]/30">{s.n}</span>
                  <h3 className="mt-3 text-xl font-bold text-[#0F172A]">{s.title}</h3>
                  <p className="mt-2 text-slate-500">{s.body}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Application form */}
      <section className="mx-auto max-w-3xl px-5 py-20 sm:px-8">
        <FadeUp>
          <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-10">
            <h2 className="text-2xl font-extrabold tracking-tight text-[#0F172A]">Apply to sell</h2>
            <p className="mt-2 text-slate-500">Tell us about yourself — it takes two minutes.</p>
            <form className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full name" placeholder="Ada Lovelace" />
                <Field label="Email" placeholder="you@email.com" type="email" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[#0F172A]">What will you sell?</label>
                <select className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-[#FF6B47]">
                  <option>Services</option>
                  <option>Products</option>
                  <option>Both services and products</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[#0F172A]">Tell us about your work</label>
                <textarea rows={4} placeholder="Your skills, experience, and what makes you great…" className="w-full resize-none rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-[#FF6B47]" />
              </div>
              <ul className="space-y-1.5 text-sm text-slate-500">
                {["No upfront cost", "Approved in 24 hours", "Cancel anytime"].map((t) => (
                  <li key={t} className="flex items-center gap-2"><Check className="h-4 w-4 text-[#FF6B47]" /> {t}</li>
                ))}
              </ul>
              <Link href="/login" className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF6B47] py-3.5 font-bold text-white hover:bg-[#ff5530]">
                Submit application <ArrowRight className="h-4 w-4" />
              </Link>
            </form>
          </div>
        </FadeUp>
      </section>
    </>
  );
}

function Field({ label, placeholder, type = "text" }: { label: string; placeholder?: string; type?: string }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-[#0F172A]">{label}</label>
      <input type={type} placeholder={placeholder} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-[#FF6B47]" />
    </div>
  );
}
