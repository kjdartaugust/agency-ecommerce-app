"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

const popular = ["Logo design", "Next.js dev", "SEO audit", "Explainer video"];

export function NexusSearch({
  variant = "hero",
  defaultValue = "",
}: {
  variant?: "hero" | "nav";
  defaultValue?: string;
}) {
  const router = useRouter();
  const [q, setQ] = useState(defaultValue);
  const [focused, setFocused] = useState(false);

  function submit(value: string) {
    const term = value.trim();
    if (!term) return;
    router.push(`/market/search?q=${encodeURIComponent(term)}`);
  }

  if (variant === "nav") {
    return (
      <form
        onSubmit={(e) => { e.preventDefault(); submit(q); }}
        className="relative hidden flex-1 lg:block"
      >
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search services and products…"
          className="w-full rounded-full border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-[#0F172A] outline-none transition-colors focus:border-[#FF6B47] focus:bg-white"
        />
      </form>
    );
  }

  return (
    <div className="w-full">
      <motion.form
        onSubmit={(e) => { e.preventDefault(); submit(q); }}
        animate={{ scale: focused ? 1.02 : 1 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "flex items-center gap-2 rounded-2xl bg-white p-2 shadow-xl ring-1 transition-shadow",
          focused ? "ring-2 ring-[#FF6B47] shadow-2xl" : "ring-slate-200"
        )}
      >
        <Search className="ml-3 h-5 w-5 shrink-0 text-slate-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Try “brand identity”, “web app”, or “wireless headphones”"
          className="h-12 w-full bg-transparent text-base text-[#0F172A] outline-none placeholder:text-slate-400"
          aria-label="Search services and products"
        />
        <button
          type="submit"
          className="hidden h-12 shrink-0 items-center gap-2 rounded-xl bg-[#FF6B47] px-6 font-semibold text-white transition-colors hover:bg-[#ff5530] sm:flex"
        >
          Search
        </button>
      </motion.form>
      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-slate-500">
        <span>Popular:</span>
        {popular.map((p) => (
          <button
            key={p}
            onClick={() => { setQ(p); submit(p); }}
            className="rounded-full border border-white/40 bg-white/10 px-3 py-1 text-white/90 backdrop-blur transition-colors hover:bg-white/20"
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}
