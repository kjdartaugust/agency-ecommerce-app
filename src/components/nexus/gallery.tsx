"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Gallery({ images, alt }: { images: string[]; alt: string }) {
  const list = images.length ? images : [];
  const [active, setActive] = useState(list[0]);

  if (!list.length) return null;

  return (
    <div>
      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-slate-100">
        <Image src={active} alt={alt} fill sizes="(max-width:1024px) 100vw, 60vw" className="object-cover" priority />
      </div>
      {list.length > 1 && (
        <div className="mt-3 flex gap-3">
          {list.map((src) => (
            <button
              key={src}
              onClick={() => setActive(src)}
              className={cn(
                "relative h-20 w-28 shrink-0 overflow-hidden rounded-xl border-2 transition-colors",
                active === src ? "border-[#FF6B47]" : "border-transparent hover:border-slate-200"
              )}
            >
              <Image src={src} alt="" fill sizes="112px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
