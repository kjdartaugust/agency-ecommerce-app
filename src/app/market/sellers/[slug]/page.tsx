import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, MapPin, MessageSquare, CheckCircle2, Globe } from "lucide-react";
import { getSellerBySlug, getServicesBySeller, sellers } from "@/lib/nexus/data";
import { NexusStars, VerifiedBadge, LevelBadge, Pill } from "@/components/nexus/ui";
import { ServiceCard } from "@/components/nexus/service-card";

export function generateStaticParams() {
  return sellers.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const seller = getSellerBySlug(params.slug);
  if (!seller) return { title: "Seller not found" };
  return { title: seller.name, description: seller.tagline };
}

export default function SellerProfilePage({ params }: { params: { slug: string } }) {
  const seller = getSellerBySlug(params.slug);
  if (!seller) notFound();
  const sellerServices = getServicesBySeller(seller.id);

  const stats = [
    { label: "Rating", value: seller.rating.toFixed(1) },
    { label: "Reviews", value: seller.review_count.toLocaleString() },
    { label: "Orders", value: seller.completed_orders.toLocaleString() },
    { label: "Member since", value: seller.member_since },
  ];

  return (
    <div>
      <div className="relative h-48 w-full bg-slate-200 sm:h-64">
        <Image src={seller.cover_url} alt="" fill sizes="100vw" className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/60 to-transparent" />
      </div>

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Link href="/market/services" className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-[#FF6B47]">
          <ArrowLeft className="h-4 w-4" /> Back to services
        </Link>

        <div className="-mt-16 grid gap-8 lg:grid-cols-[1fr_2fr]">
          {/* Profile card */}
          <div className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-24">
            <div className="relative mx-auto h-28 w-28 overflow-hidden rounded-3xl border-4 border-white bg-white shadow">
              <Image src={seller.avatar_url} alt={seller.name} fill sizes="112px" className="object-cover" />
            </div>
            <div className="mt-4 text-center">
              <div className="flex items-center justify-center gap-2">
                <h1 className="text-xl font-extrabold text-[#0F172A]">{seller.name}</h1>
                {seller.verified && <VerifiedBadge />}
              </div>
              <p className="mt-1 text-sm text-slate-500">{seller.tagline}</p>
              <div className="mt-3 flex items-center justify-center gap-2">
                <NexusStars rating={seller.rating} count={seller.review_count} />
                <LevelBadge level={seller.level} />
              </div>
            </div>

            <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF6B47] py-3 font-bold text-white transition-colors hover:bg-[#ff5530]">
              <MessageSquare className="h-4 w-4" /> Contact me
            </button>

            <dl className="mt-6 space-y-3 border-t border-slate-100 pt-5 text-sm">
              <div className="flex items-center justify-between">
                <dt className="inline-flex items-center gap-2 text-slate-500"><MapPin className="h-4 w-4" /> From</dt>
                <dd className="font-semibold text-[#0F172A]">{seller.location}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="inline-flex items-center gap-2 text-slate-500"><Clock className="h-4 w-4" /> Responds</dt>
                <dd className="font-semibold text-[#0F172A]">{seller.response_time}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="inline-flex items-center gap-2 text-slate-500"><CheckCircle2 className="h-4 w-4" /> Orders</dt>
                <dd className="font-semibold text-[#0F172A]">{seller.completed_orders.toLocaleString()}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="inline-flex items-center gap-2 text-slate-500"><Globe className="h-4 w-4" /> Languages</dt>
                <dd className="font-semibold text-[#0F172A]">{seller.languages.join(", ")}</dd>
              </div>
            </dl>
          </div>

          {/* Main */}
          <div className="pt-16 lg:pt-20">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label} className="rounded-2xl border border-slate-200 bg-white p-4 text-center">
                  <p className="text-2xl font-extrabold text-[#0F172A]">{s.value}</p>
                  <p className="text-xs text-slate-400">{s.label}</p>
                </div>
              ))}
            </div>

            <section className="mt-8">
              <h2 className="text-xl font-extrabold text-[#0F172A]">About</h2>
              <p className="mt-3 leading-relaxed text-slate-600">{seller.bio}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {seller.skills.map((s) => <Pill key={s}>{s}</Pill>)}
              </div>
            </section>

            <section className="mt-10">
              <h2 className="text-xl font-extrabold text-[#0F172A]">{seller.name.split(" ")[0]}'s services</h2>
              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                {sellerServices.map((s) => <ServiceCard key={s.id} service={s} />)}
              </div>
            </section>
          </div>
        </div>
      </div>
      <div className="h-16" />
    </div>
  );
}
