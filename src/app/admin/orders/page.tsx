import { createClient } from "@/lib/supabase/server";
import { formatDate, formatPrice } from "@/lib/utils";
import type { Order, OrderStatus } from "@/lib/types";
import { updateOrderStatus } from "@/app/admin/actions";
import { Badge } from "@/components/ui/badge";

const statuses: OrderStatus[] = ["pending", "paid", "fulfilled", "cancelled"];

// Sample orders so the admin view is explorable in demo mode.
const demoOrders: Order[] = [
  {
    id: "demo-1001", user_id: null, email: "ada@example.com", status: "paid",
    total: 41800, currency: "USD",
    items: [{ product_id: "p1", name: "Aperture Desk Lamp", price: 18900, quantity: 1, image_url: "" },
      { product_id: "p5", name: "Aria Mechanical Keyboard", price: 21900, quantity: 1, image_url: "" }],
    shipping_name: "Ada Lovelace", shipping_address: "12 Analytical St, London",
    stripe_session_id: null, created_at: "2026-06-18T10:00:00Z",
  },
  {
    id: "demo-1002", user_id: null, email: "grace@example.com", status: "fulfilled",
    total: 32900, currency: "USD",
    items: [{ product_id: "p2", name: "Monarch Headphones", price: 32900, quantity: 1, image_url: "" }],
    shipping_name: "Grace Hopper", shipping_address: "1 Navy Yard, Washington",
    stripe_session_id: null, created_at: "2026-06-12T14:30:00Z",
  },
];

export default async function AdminOrdersPage() {
  const supabase = createClient();
  let orders: Order[] = demoOrders;
  if (supabase) {
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    orders = (data as Order[]) ?? [];
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-bold tracking-tight">Orders</h1>

      {orders.length === 0 ? (
        <p className="mt-8 text-muted-foreground">No orders yet.</p>
      ) : (
        <div className="mt-8 space-y-4">
          {orders.map((order) => (
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
          ))}
        </div>
      )}
    </div>
  );
}
