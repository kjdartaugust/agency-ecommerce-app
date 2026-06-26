import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck, Star, Zap } from "lucide-react";
import { getProducts } from "@/lib/data";
import {
  getServices, getFeaturedSellers, nexusCategories, platformStats,
} from "@/lib/nexus/data";
import { NexusSearch } from "@/components/nexus/search-bar";
import { CategoryRow } from "@/components/nexus/category-row";
import { ServiceCard } from "@/components/nexus/service-card";
import { SellerCard } from "@/components/nexus/seller-card";
import { NexusProductCard } from "@/components/nexus/product-card";
import { Counter } from "@/components/nexus/counter";
import { FadeUp, Stagger, StaggerItem } from "@/components/nexus/motion";

const stats = [
  { value: platformStats.sellers, suffix: "+", label: "Active sellers" },
  { value: platformStats.products, suffix: "+", label: "Listings live" },
  { value: platformStats.transactions, suffix: "+", label: "Transactions" },
  { value: platformStats.countries, suffix: "", label: "Countries" },
];

const trustBadges = [
  { icon: ShieldCheck, label: "Verified sellers" },
  { icon: Star, label: "4.9 avg rating" },
  { icon: Zap, label: "Fast delivery" },
];

export default async function NexusHome() {
  const services = getServices({ featured: true });
  const sellers = getFeaturedSellers();
  const products = await getProducts({ featured: true });

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0F172A] text-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 top-0 h-96 w-96 rounded-full bg-[#FF6B47]/20 blur-3xl" />
          <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-16 sm:px-8 sm:pt-24">
          <div className="mx-auto max-w-3xl text-center">
            <FadeUp>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm font-semibold text-white/80">
                <Star className="h-4 w-4 fill-[#FF6B47] text-[#FF6B47]" /> The #1 marketplace for talent & products
              </span>
            </FadeUp>
            <FadeUp delay={0.05}>
              <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
                Hire the best.<br />
                <span className="text-[#FF6B47]">Shop the rest.</span>
              </h1>
            </FadeUp>
            <FadeUp delay={0.1}>
              <p className="mx-auto mt-6 max-w-xl text-lg text-white/70">
                One search for services and products. Find expert freelancers and beautifully made
                goods — all from verified sellers you can trust.
              </p>
            </FadeUp>
            <FadeUp delay={0.15}>
              <div className="mx-auto mt-9 max-w-2xl">
                <NexusSearch variant="hero" />
              </div>
            </FadeUp>
            <FadeUp delay={0.2}>
              <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/market/services"
                  className="inline-flex items-center gap-2 rounded-full bg-[#FF6B47] px-7 py-3.5 font-bold text-white transition-colors hover:bg-[#ff5530]"
                >
                  Browse Services <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/market/products"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 font-bold text-[#0F172A] transition-colors hover:bg-slate-100"
                >
                  Shop Products
                </Link>
              </div>
            </FadeUp>
            <FadeUp delay={0.25}>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-white/60">
                {trustBadges.map((b) => (
                  <span key={b.label} className="inline-flex items-center gap-2">
                    <b.icon className="h-4 w-4 text-[#FF6B47]" /> {b.label}
                  </span>
                ))}
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* Trending categories */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <FadeUp>
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-[#0F172A] sm:text-3xl">
                Trending categories
              </h2>
              <p className="mt-2 text-slate-500">Explore what buyers are loving right now.</p>
            </div>
            <Link href="/market/services" className="hidden text-sm font-bold text-[#FF6B47] hover:underline sm:block">
              View all
            </Link>
          </div>
        </FadeUp>
        <FadeUp delay={0.05} className="mt-8">
          <CategoryRow categories={nexusCategories} />
        </FadeUp>
      </section>

      {/* Featured services */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
          <FadeUp>
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight text-[#0F172A] sm:text-3xl">
                  Popular services
                </h2>
                <p className="mt-2 text-slate-500">Hand-picked work from top-rated sellers.</p>
              </div>
              <Link href="/market/services" className="text-sm font-bold text-[#FF6B47] hover:underline">
                Browse services
              </Link>
            </div>
          </FadeUp>
          <Stagger className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => (
              <StaggerItem key={s.id}>
                <ServiceCard service={s} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Featured sellers */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <FadeUp>
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-[#0F172A] sm:text-3xl">
                Featured sellers
              </h2>
              <p className="mt-2 text-slate-500">Verified pros with a track record of happy buyers.</p>
            </div>
          </div>
        </FadeUp>
        <Stagger className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {sellers.map((s) => (
            <StaggerItem key={s.id}>
              <SellerCard seller={s} />
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* Featured products */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
          <FadeUp>
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight text-[#0F172A] sm:text-3xl">
                  Featured products
                </h2>
                <p className="mt-2 text-slate-500">Beautifully made goods from independent sellers.</p>
              </div>
              <Link href="/market/products" className="text-sm font-bold text-[#FF6B47] hover:underline">
                Shop all
              </Link>
            </div>
          </FadeUp>
          <Stagger className="mt-8 grid grid-cols-2 gap-6 lg:grid-cols-4">
            {products.slice(0, 4).map((p) => (
              <StaggerItem key={p.id}>
                <NexusProductCard product={p} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Social proof strip */}
      <section className="bg-[#0F172A] text-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-5 py-16 sm:px-8 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-4xl font-extrabold tracking-tight text-[#FF6B47] sm:text-5xl">
                <Counter value={s.value} suffix={s.suffix} />
              </p>
              <p className="mt-2 text-sm font-medium text-white/60">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <FadeUp className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FF6B47] to-[#ff8a6b] px-8 py-16 text-center text-white sm:py-20">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Ready to start earning?</h2>
          <p className="mx-auto mt-3 max-w-lg text-white/90">
            Join thousands of sellers growing their business on Nexus Market. It's free to list.
          </p>
          <Link
            href="/market/become-a-seller"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#0F172A] px-8 py-4 font-bold text-white transition-transform hover:scale-105"
          >
            Become a Seller <ArrowRight className="h-4 w-4" />
          </Link>
        </FadeUp>
      </section>
    </>
  );
}
