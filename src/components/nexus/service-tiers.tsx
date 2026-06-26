"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Clock, RefreshCw, MessageSquare } from "lucide-react";
import type { Service } from "@/lib/nexus/types";
import { formatPrice, cn } from "@/lib/utils";

export function ServiceTiers({ service }: { service: Service }) {
  const [active, setActive] = useState(1); // default Standard
  const tier = service.tiers[active];

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="grid grid-cols-3 border-b border-slate-200">
        {service.tiers.map((t, i) => (
          <button
            key={t.name}
            onClick={() => setActive(i)}
            className={cn(
              "py-3 text-sm font-bold transition-colors",
              active === i ? "border-b-2 border-[#FF6B47] text-[#FF6B47]" : "text-slate-400 hover:text-[#0F172A]"
            )}
          >
            {t.name}
          </button>
        ))}
      </div>

      <div className="p-6">
        <div className="flex items-baseline justify-between">
          <span className="text-3xl font-extrabold text-[#0F172A]">{formatPrice(tier.price)}</span>
          <span className="text-sm font-semibold text-slate-400">{tier.name} package</span>
        </div>

        <div className="mt-4 flex items-center gap-5 text-sm font-semibold text-[#0F172A]">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-[#FF6B47]" /> {tier.delivery_days}-day delivery
          </span>
          <span className="inline-flex items-center gap-1.5">
            <RefreshCw className="h-4 w-4 text-[#FF6B47]" /> {tier.revisions}
          </span>
        </div>

        <ul className="mt-5 space-y-2.5">
          {tier.features.map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-sm text-[#0F172A]">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#FF6B47]" />
              {f}
            </li>
          ))}
        </ul>

        <Link
          href={`/market/checkout?service=${service.slug}&tier=${tier.name}`}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF6B47] py-3.5 font-bold text-white transition-colors hover:bg-[#ff5530]"
        >
          Order Now ({formatPrice(tier.price)})
        </Link>
        <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 font-semibold text-[#0F172A] transition-colors hover:bg-slate-50">
          <MessageSquare className="h-4 w-4" /> Contact seller
        </button>
      </div>
    </div>
  );
}
