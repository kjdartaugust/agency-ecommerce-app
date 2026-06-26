import Image from "next/image";
import Link from "next/link";
import { MapPin, Clock } from "lucide-react";
import type { Seller } from "@/lib/nexus/types";
import { NexusStars, LevelBadge, VerifiedBadge } from "@/components/nexus/ui";

export function SellerCard({ seller }: { seller: Seller }) {
  return (
    <Link
      href={`/market/sellers/${seller.slug}`}
      className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:border-[#FF6B47]/40 hover:shadow-xl"
    >
      <div className="relative h-24 bg-slate-100">
        <Image src={seller.cover_url} alt="" fill sizes="320px" className="object-cover opacity-90" />
      </div>
      <div className="px-5 pb-5">
        <div className="relative -mt-8 mb-3 h-16 w-16 overflow-hidden rounded-2xl border-4 border-white bg-white">
          <Image src={seller.avatar_url} alt={seller.name} fill sizes="64px" className="object-cover" />
        </div>
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-[#0F172A]">{seller.name}</h3>
          {seller.verified && <VerifiedBadge className="text-[11px]" />}
        </div>
        <p className="mt-1 line-clamp-2 text-sm text-slate-500">{seller.tagline}</p>
        <div className="mt-3 flex items-center justify-between">
          <NexusStars rating={seller.rating} count={seller.review_count} />
          <LevelBadge level={seller.level} />
        </div>
        <div className="mt-3 flex items-center gap-4 border-t border-slate-100 pt-3 text-xs text-slate-400">
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" /> {seller.location}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> {seller.response_time}
          </span>
        </div>
      </div>
    </Link>
  );
}
