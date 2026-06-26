import Image from "next/image";
import Link from "next/link";
import { Clock, Heart } from "lucide-react";
import type { Service } from "@/lib/nexus/types";
import { getSeller } from "@/lib/nexus/data";
import { formatPrice } from "@/lib/utils";
import { NexusStars, VerifiedBadge } from "@/components/nexus/ui";

export function ServiceCard({ service }: { service: Service }) {
  const seller = getSeller(service.seller_id);

  return (
    <Link
      href={`/market/services/${service.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:border-[#FF6B47]/40 hover:shadow-xl"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <Image
          src={service.cover_url}
          alt={service.title}
          fill
          sizes="(max-width:768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate-500 opacity-0 transition-opacity group-hover:opacity-100">
          <Heart className="h-4 w-4" />
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        {seller && (
          <div className="flex items-center gap-2">
            <div className="relative h-7 w-7 overflow-hidden rounded-full">
              <Image src={seller.avatar_url} alt={seller.name} fill sizes="28px" className="object-cover" />
            </div>
            <span className="text-sm font-semibold text-[#0F172A]">{seller.name}</span>
            {seller.verified && <VerifiedBadge className="text-[11px]" />}
          </div>
        )}

        <p className="mt-3 line-clamp-2 flex-1 font-semibold leading-snug text-[#0F172A] group-hover:text-[#FF6B47]">
          {service.title}
        </p>

        <div className="mt-3 flex items-center justify-between">
          <NexusStars rating={service.rating} count={service.review_count} />
          <span className="inline-flex items-center gap-1 text-xs text-slate-400">
            <Clock className="h-3.5 w-3.5" /> {service.delivery_days}d
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
          <span className="text-xs uppercase tracking-wide text-slate-400">Starting at</span>
          <span className="text-lg font-extrabold text-[#0F172A]">{formatPrice(service.starting_price)}</span>
        </div>
      </div>
    </Link>
  );
}
