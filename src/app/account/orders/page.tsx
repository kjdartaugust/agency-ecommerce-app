import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Package } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { formatDate, formatPrice } from "@/lib/utils";
import type { Order } from "@/lib/types";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";

export const metadata: Metadata = { title: "Your orders" };

// Reads the signed-in user from cookies — must run per request.
export const dynamic = "force-dynamic";

const statusVariant = {
  pending: "outline",
  paid: "default",
  fulfilled: "accent",
  cancelled: "secondary",
} as const;

export default async function OrdersPage() {
  if (!isSupabaseConfigured) {
    return (
      <Section className="pt-20 text-center">
        <h1 className="font-display text-3xl font-bold">Order history</h1>
        <p className="mx-auto mt-3 max-w-md text-muted-foreground">
          Connect Supabase (see <code>.env.example</code>) to enable accounts and persistent order
          history.
        </p>
      </Section>
    );
  }

  const supabase = createClient()!;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/account/orders");

  const { data } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });
  const orders = (data as Order[]) ?? [];

  return (
    <Section className="pt-16">
      <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Your orders</h1>

      {orders.length === 0 ? (
        <div className="mt-12 flex flex-col items-center gap-4 rounded-3xl border border-border bg-card/40 p-12 text-center">
          <Package className="h-10 w-10 text-muted-foreground" />
          <p className="text-muted-foreground">You haven't placed any orders yet.</p>
          <LinkButton href="/shop">Start shopping</LinkButton>
        </div>
      ) : (
        <div className="mt-10 space-y-5">
          {orders.map((order) => (
            <div key={order.id} className="rounded-2xl border border-border bg-card p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                  <p className="text-sm text-muted-foreground">{formatDate(order.created_at)}</p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant={statusVariant[order.status]}>{order.status}</Badge>
                  <span className="font-display font-semibold">{formatPrice(order.total)}</span>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-4 border-t border-border pt-4 text-sm text-muted-foreground">
                {order.items.map((i, idx) => (
                  <span key={idx}>
                    {i.quantity}× {i.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </Section>
  );
}
