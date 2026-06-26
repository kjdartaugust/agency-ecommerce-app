import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, MapPin, MessageSquare, CheckCircle2 } from "lucide-react";
import {
  getService, getSeller, getNexusReviews, getServicesBySeller, services as allServices,
} from "@/lib/nexus/data";
import { formatDate } from "@/lib/utils";
import { NexusStars, VerifiedBadge, LevelBadge, Pill } from "@/components/nexus/ui";
import { Gallery } from "@/components/nexus/gallery";
import { ServiceTiers } from "@/components/nexus/service-tiers";
import { ServiceCard } from "@/components/nexus/service-card";

export function generateStaticParams() {
  return allServices.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const service = getService(params.slug);
  if (!service) return { title: "Service not found" };
  return { title: service.title, description: service.description.slice(0, 150) };
}

export default function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const service = getService(params.slug);
  if (!service) notFound();
  const seller = getSeller(service.seller_id);
  const reviews = getNexusReviews(service.id);
  const more = seller
    ? getServicesBySeller(seller.id).filter((s) => s.id !== service.id)
    : [];

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
      <Link href="/market/services" className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-[#FF6B47]">
        <ArrowLeft className="h-4 w-4" /> All services
      </Link>

      <div className="grid gap-10 lg:grid-cols-[1.7fr_1fr]">
        {/* Main */}
        <div>
          <Pill className="bg-[#FF6B47]/10 text-[#FF6B47]">{service.category}</Pill>
          <h1 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight text-[#0F172A] sm:text-4xl">
            {service.title}
          </h1>

          {seller && (
            <div className="mt-4 flex items-center gap-3">
              <div className="relative h-10 w-10 overflow-hidden rounded-full">
                <Image src={seller.avatar_url} alt={seller.name} fill sizes="40px" className="object-cover" />
              </div>
              <Link href={`/market/sellers/${seller.slug}`} className="font-bold text-[#0F172A] hover:text-[#FF6B47]">
                {seller.name}
              </Link>
              {seller.verified && <VerifiedBadge />}
              <span className="text-slate-300">·</span>
              <NexusStars rating={service.rating} count={service.review_count} />
            </div>
          )}

          <div className="mt-6">
            <Gallery images={service.gallery} alt={service.title} />
          </div>

          <section className="mt-10">
            <h2 className="text-xl font-extrabold text-[#0F172A]">About this service</h2>
            <p className="mt-3 leading-relaxed text-slate-600">{service.description}</p>
          </section>

          {/* Seller profile */}
          {seller && (
            <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="text-xl font-extrabold text-[#0F172A]">About the seller</h2>
              <div className="mt-4 flex flex-wrap items-start gap-4">
                <div className="relative h-20 w-20 overflow-hidden rounded-2xl">
                  <Image src={seller.avatar_url} alt={seller.name} fill sizes="80px" className="object-cover" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link href={`/market/sellers/${seller.slug}`} className="text-lg font-bold text-[#0F172A] hover:text-[#FF6B47]">
                      {seller.name}
                    </Link>
                    <LevelBadge level={seller.level} />
                    {seller.verified && <VerifiedBadge />}
                  </div>
                  <p className="mt-1 text-sm text-slate-500">{seller.tagline}</p>
                  <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-500">
                    <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {seller.location}</span>
                    <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4" /> Responds in {seller.response_time}</span>
                    <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4" /> {seller.completed_orders.toLocaleString()} orders</span>
                  </div>
                </div>
                <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-[#0F172A] hover:bg-slate-50">
                  <MessageSquare className="h-4 w-4" /> Contact
                </button>
              </div>
              <p className="mt-4 leading-relaxed text-slate-600">{seller.bio}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {seller.skills.map((s) => <Pill key={s}>{s}</Pill>)}
              </div>
            </section>
          )}

          {/* Reviews */}
          <section className="mt-10">
            <h2 className="text-xl font-extrabold text-[#0F172A]">
              Reviews <span className="text-slate-400">({service.review_count.toLocaleString()})</span>
            </h2>
            <div className="mt-5 space-y-5">
              {reviews.length === 0 && <p className="text-slate-500">No written reviews yet.</p>}
              {reviews.map((r) => (
                <div key={r.id} className="rounded-2xl border border-slate-200 bg-white p-5">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded-full">
                      <Image src={r.author_avatar} alt={r.author_name} fill sizes="40px" className="object-cover" />
                    </div>
                    <div>
                      <p className="font-bold text-[#0F172A]">{r.author_name}</p>
                      <p className="text-xs text-slate-400">{r.country}</p>
                    </div>
                    <div className="ml-auto">
                      <NexusStars rating={r.rating} />
                    </div>
                  </div>
                  <p className="mt-3 text-slate-600">{r.body}</p>
                  <p className="mt-2 text-xs text-slate-400">{formatDate(r.created_at)}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sticky tiers */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <ServiceTiers service={service} />
        </div>
      </div>

      {more.length > 0 && (
        <section className="mt-16 border-t border-slate-200 pt-10">
          <h2 className="text-xl font-extrabold text-[#0F172A]">More from {seller?.name}</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {more.slice(0, 4).map((s) => <ServiceCard key={s.id} service={s} />)}
          </div>
        </section>
      )}
    </div>
  );
}
