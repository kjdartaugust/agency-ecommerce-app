"use client";

import { ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/store";
import { Button } from "@/components/ui/button";

export function CartButton() {
  const { open, items } = useCart();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const count = items.reduce((n, i) => n + i.quantity, 0);

  return (
    <Button variant="ghost" size="icon" aria-label="Open cart" onClick={open} className="relative">
      <ShoppingBag className="h-5 w-5" />
      {mounted && count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-accent px-1 text-[11px] font-bold text-accent-foreground">
          {count}
        </span>
      )}
    </Button>
  );
}
