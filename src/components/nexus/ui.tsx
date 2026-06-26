import { BadgeCheck, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SellerLevel } from "@/lib/nexus/types";

export function NexusStars({ rating, count, className }: { rating: number; count?: number; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 text-sm", className)}>
      <Star className="h-4 w-4 fill-[#FF6B47] text-[#FF6B47]" />
      <span className="font-bold text-[#0F172A]">{rating.toFixed(1)}</span>
      {count !== undefined && <span className="text-slate-400">({count.toLocaleString()})</span>}
    </span>
  );
}

export function VerifiedBadge({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 text-xs font-semibold text-[#FF6B47]", className)}>
      <BadgeCheck className="h-4 w-4" /> Verified
    </span>
  );
}

const levelStyles: Record<SellerLevel, string> = {
  "New Seller": "bg-slate-100 text-slate-600",
  "Level 1": "bg-sky-100 text-sky-700",
  "Level 2": "bg-violet-100 text-violet-700",
  "Top Rated": "bg-[#FF6B47]/12 text-[#FF6B47]",
};

export function LevelBadge({ level, className }: { level: SellerLevel; className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold", levelStyles[level], className)}>
      {level}
    </span>
  );
}

export function Pill({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600", className)}>
      {children}
    </span>
  );
}
