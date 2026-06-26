import type { Metadata } from "next";
import Link from "next/link";
import { Package, ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatDate, formatPrice } from "@/lib/utils";
import type { Order } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";

export const metadata: Metadata = { title: "Your orders" };

const statusVariant = {
  pending: "outline",
  paid: "default",
  fulfilled: "accent",
  cancelled: "secondary",
} as const;

export default async function OrdersPage() {
  // Auth + Supabase config are guaranteed by the account layout.
  const supabase = createClient()!;
  const { data } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });
  const orders = (data as Order[]) ?? [];

  return (
    <div>
      <h1 className="font-display text-3xl font-bold tracking-tight">Your orders</h1>

      {orders.length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-4 rounded-3xl border border-border bg-card/40 p-12 text-center">
          <Package className="h-10 w-10 text-muted-foreground" />
          <p className="text-muted-foreground">You haven't placed any orders yet.</p>
          <LinkButton href="/shop">Start shopping</LinkButton>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/account/orders/${order.id}`}
              className="flex items-center justify-between rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/40"
            >
              <div>
                <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(order.created_at)} · {order.items.reduce((n, i) => n + i.quantity, 0)} items
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant={statusVariant[order.status]}>{order.status}</Badge>
                <span className="font-display font-semibold">{formatPrice(order.total)}</span>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
