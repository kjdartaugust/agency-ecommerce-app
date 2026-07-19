import { AlertTriangle, Mail, Phone, Sheet, Webhook } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getFulfillments, getMatches, getSuppliers } from "@/lib/data";
import { demoOrders } from "@/lib/seed";
import { formatDate, formatPrice } from "@/lib/utils";
import { marginPercent, resolveRouting } from "@/lib/fulfillment";
import type {
  ChannelType,
  Fulfillment,
  FulfillmentStatus,
  Order,
  OrderStatus,
} from "@/lib/types";
import { updateFulfillment, updateOrderStatus } from "@/app/admin/actions";
import { Badge } from "@/components/ui/badge";

const statuses: OrderStatus[] = ["pending", "paid", "fulfilled", "cancelled"];
const fulfillmentStatuses: FulfillmentStatus[] = [
  "pending",
  "sent",
  "shipped",
  "delivered",
  "failed",
];

const channelIcon: Record<ChannelType, typeof Mail> = {
  api: Webhook,
  email: Mail,
  sheet: Sheet,
  manual: Phone,
};

function statusVariant(status: FulfillmentStatus) {
  if (status === "delivered") return "default" as const;
  if (status === "failed") return "accent" as const;
  return "outline" as const;
}

export default async function AdminOrdersPage() {
  const supabase = createClient();
  let orders: Order[] = demoOrders;
  if (supabase) {
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    orders = (data as Order[]) ?? [];
  }

  const [suppliers, matches, persisted] = await Promise.all([
    getSuppliers(),
    getMatches(),
    getFulfillments(),
  ]);
  const supplierById = new Map(suppliers.map((s) => [s.id, s]));

  return (
    <div>
      <h1 className="font-display text-3xl font-bold tracking-tight">Orders</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Each order is routed to the suppliers that stock its items. An order split
        across suppliers is tracked per supplier, not as one shipment.
      </p>

      {orders.length === 0 ? (
        <p className="mt-8 text-muted-foreground">No orders yet.</p>
      ) : (
        <div className="mt-8 space-y-4">
          {orders.map((order) => {
            const routing = resolveRouting(order, persisted, suppliers, matches);
            const pct = marginPercent(order.total, routing.margin);

            return (
              <div key={order.id} className="rounded-2xl border border-border bg-card p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-medium">#{order.id.slice(0, 8)} · {order.email}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(order.created_at)} · {order.shipping_name}
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {order.items.map((i) => `${i.quantity}× ${i.name}`).join(", ")}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-display font-semibold">{formatPrice(order.total)}</span>
                    <Badge variant="default">{order.status}</Badge>
                  </div>
                </div>

                {/* Unit economics: what the order earned after cost of goods. */}
                <div className="mt-4 grid grid-cols-3 gap-3 rounded-xl bg-secondary/50 px-4 py-3 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Cost of goods</p>
                    <p className="mt-0.5 font-medium">{formatPrice(routing.costTotal)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Margin</p>
                    <p className="mt-0.5 font-medium">{formatPrice(routing.margin)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Margin %</p>
                    <p className="mt-0.5 font-medium">{pct.toFixed(1)}%</p>
                  </div>
                </div>

                {routing.unrouted.length > 0 && (
                  <div className="mt-3 flex items-start gap-2 rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <span>
                      <strong>Nobody is packing these.</strong>{" "}
                      {routing.unrouted.map((u) => `${u.quantity}× ${u.name}`).join(", ")} — no
                      active supplier. Margin above counts their revenue but no cost, so it reads high.
                    </span>
                  </div>
                )}

                <div className="mt-4 space-y-3 border-t border-border pt-4">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Fulfilment {routing.derived && "· projected"}
                  </p>

                  {routing.fulfillments.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Not routed — no supplier matches any item on this order.
                    </p>
                  ) : (
                    routing.fulfillments.map((f: Fulfillment) => {
                      const supplier = supplierById.get(f.supplier_id);
                      const Icon = supplier ? channelIcon[supplier.channel_type] : Webhook;

                      return (
                        <div key={f.id} className="rounded-xl border border-border px-4 py-3">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm font-medium">
                                {supplier?.name ?? "Unknown supplier"}
                              </span>
                              <Badge variant="secondary">{supplier?.channel_type ?? "—"}</Badge>
                              <Badge variant={statusVariant(f.status)}>{f.status}</Badge>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {formatPrice(f.cost_total)} cost
                              {supplier && ` · ~${supplier.lead_time_days}d`}
                            </span>
                          </div>

                          <p className="mt-2 text-sm text-muted-foreground">
                            {f.items.map((i) => `${i.quantity}× ${i.name}`).join(", ")}
                          </p>

                          {f.tracking && (
                            <p className="mt-1 text-sm">Tracking: <code>{f.tracking}</code></p>
                          )}

                          {/* Derived routing has no row to update — only persisted
                              fulfilments are editable. */}
                          {!routing.derived && (
                            <form action={updateFulfillment} className="mt-3 flex flex-wrap items-center gap-2">
                              <input type="hidden" name="id" value={f.id} />
                              <select
                                name="status"
                                defaultValue={f.status}
                                className="rounded-full border border-input bg-background px-4 py-1.5 text-sm"
                              >
                                {fulfillmentStatuses.map((s) => (
                                  <option key={s} value={s}>{s}</option>
                                ))}
                              </select>
                              <input
                                name="tracking"
                                defaultValue={f.tracking ?? ""}
                                placeholder="Tracking number"
                                className="rounded-full border border-input bg-background px-4 py-1.5 text-sm"
                              />
                              <button
                                type="submit"
                                className="rounded-full bg-secondary px-4 py-1.5 text-sm font-medium hover:bg-secondary/80"
                              >
                                Save
                              </button>
                            </form>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>

                <form action={updateOrderStatus} className="mt-4 flex items-center gap-2 border-t border-border pt-4">
                  <input type="hidden" name="id" value={order.id} />
                  <select
                    name="status"
                    defaultValue={order.status}
                    className="rounded-full border border-input bg-background px-4 py-1.5 text-sm"
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    className="rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                  >
                    Update
                  </button>
                </form>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
