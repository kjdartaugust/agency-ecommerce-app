import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatDate, formatPrice, cn } from "@/lib/utils";
import type { Order, OrderStatus } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";

export const metadata: Metadata = { title: "Order details" };

const steps: OrderStatus[] = ["pending", "paid", "fulfilled"];

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()!;
  const { data } = await supabase.from("orders").select("*").eq("id", params.id).maybeSingle();
  const order = data as Order | null;
  if (!order) notFound();

  const subtotal = order.items.reduce((n, i) => n + i.price * i.quantity, 0);
  const shipping = order.total - subtotal;
  const currentStep = steps.indexOf(order.status as OrderStatus);
  const cancelled = order.status === "cancelled";

  return (
    <div>
      <LinkButton href="/account/orders" variant="ghost" size="sm" className="mb-6 -ml-2">
        <ArrowLeft className="h-4 w-4" /> Orders
      </LinkButton>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">
            Order #{order.id.slice(0, 8)}
          </h1>
          <p className="mt-1 text-muted-foreground">Placed {formatDate(order.created_at)}</p>
        </div>
        <Badge variant={cancelled ? "secondary" : "default"}>{order.status}</Badge>
      </div>

      {/* Status tracker */}
      {!cancelled && (
        <div className="mt-8 flex items-center">
          {steps.map((s, i) => (
            <div key={s} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center">
                <span
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-semibold",
                    i <= currentStep
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-muted-foreground"
                  )}
                >
                  {i <= currentStep ? <Check className="h-4 w-4" /> : i + 1}
                </span>
                <span className="mt-2 text-xs capitalize text-muted-foreground">{s}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={cn("mx-2 h-0.5 flex-1", i < currentStep ? "bg-primary" : "bg-border")} />
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-display text-lg font-semibold">Items</h2>
          <div className="mt-4 divide-y divide-border">
            {order.items.map((i, idx) => (
              <div key={idx} className="flex items-center gap-4 py-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-secondary">
                  {i.image_url ? (
                    <Image src={i.image_url} alt={i.name} fill sizes="64px" className="object-cover" />
                  ) : null}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{i.name}</p>
                  <p className="text-sm text-muted-foreground">Qty {i.quantity}</p>
                </div>
                <p className="font-medium">{formatPrice(i.price * i.quantity)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-display text-lg font-semibold">Summary</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd>{formatPrice(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Shipping</dt>
                <dd>{shipping <= 0 ? "Free" : formatPrice(shipping)}</dd>
              </div>
              <div className="flex justify-between border-t border-border pt-2 font-display text-base font-semibold">
                <dt>Total</dt>
                <dd>{formatPrice(order.total)}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-display text-lg font-semibold">Shipping</h2>
            <p className="mt-3 text-sm font-medium">{order.shipping_name || "—"}</p>
            <p className="whitespace-pre-line text-sm text-muted-foreground">
              {order.shipping_address || "No address on file"}
            </p>
            <p className="mt-3 text-sm text-muted-foreground">{order.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
