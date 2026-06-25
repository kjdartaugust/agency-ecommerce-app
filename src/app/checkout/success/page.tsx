"use client";

import { useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
import { useCart } from "@/lib/store";
import { Section } from "@/components/ui/section";
import { LinkButton } from "@/components/ui/button";

export default function CheckoutSuccessPage() {
  const clear = useCart((s) => s.clear);
  useEffect(() => {
    clear();
  }, [clear]);

  return (
    <Section className="pt-24 text-center">
      <div className="mx-auto flex max-w-md flex-col items-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/15">
          <CheckCircle2 className="h-10 w-10 text-emerald-500" />
        </div>
        <h1 className="mt-6 font-display text-3xl font-bold tracking-tight">Order confirmed!</h1>
        <p className="mt-3 text-muted-foreground">
          Thank you for your purchase. A confirmation email is on its way, and you can track your
          order in your account.
        </p>
        <div className="mt-8 flex gap-3">
          <LinkButton href="/account/orders" variant="outline">View orders</LinkButton>
          <LinkButton href="/shop">Continue shopping</LinkButton>
        </div>
      </div>
    </Section>
  );
}
