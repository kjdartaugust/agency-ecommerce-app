import { AlertTriangle, DollarSign, Package, Percent, ShoppingCart, TrendingUp } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getFulfillments, getMatches, getProducts, getSuppliers } from "@/lib/data";
import { demoOrders } from "@/lib/seed";
import { formatPrice } from "@/lib/utils";
import { marginPercent, resolveRouting } from "@/lib/fulfillment";
import type { Order } from "@/lib/types";
import { Card } from "@/components/ui/card";

export default async function AdminOverview() {
  const products = await getProducts();
  const supabase = createClient();
  // Falls back to the same demo orders the orders page renders, so revenue,
  // cost, and margin here always describe the set shown there.
  let orders: Order[] = demoOrders;
  if (supabase) {
    const { data } = await supabase.from("orders").select("*");
    orders = (data as Order[]) ?? [];
  }

  const [suppliers, matches, persisted] = await Promise.all([
    getSuppliers(),
    getMatches(),
    getFulfillments(),
  ]);

  const earning = orders.filter((o) => o.status === "paid" || o.status === "fulfilled");
  const revenue = earning.reduce((sum, o) => sum + o.total, 0);

  // Cost of goods is derived from routing rather than stored on the order, so it
  // stays correct when a supplier is re-pointed or a match is re-priced.
  const routed = earning.map((o) => resolveRouting(o, persisted, suppliers, matches));
  const cogs = routed.reduce((sum, r) => sum + r.costTotal, 0);
  const margin = revenue - cogs;

  // An order is "at risk" when something on it has no supplier — revenue is
  // booked but nobody is packing part of it.
  const atRisk = routed.filter((r) => r.unrouted.length > 0).length;

  const lowStock = products.filter((p) => p.stock <= 10);
  const activeSupplierIds = new Set(suppliers.filter((s) => s.active).map((s) => s.id));
  const unfulfillable = products.filter(
    (p) => !matches.some((m) => m.product_id === p.id && activeSupplierIds.has(m.supplier_id)),
  );

  const stats = [
    { label: "Revenue", value: formatPrice(revenue), icon: DollarSign },
    { label: "Cost of goods", value: formatPrice(cogs), icon: TrendingUp },
    { label: "Margin", value: formatPrice(margin), icon: Percent },
    { label: "Margin %", value: `${marginPercent(revenue, margin).toFixed(1)}%`, icon: Percent },
    { label: "Orders", value: String(orders.length), icon: ShoppingCart },
    { label: "Products", value: String(products.length), icon: Package },
    { label: "Low stock", value: String(lowStock.length), icon: AlertTriangle },
    { label: "Unrouted orders", value: String(atRisk), icon: AlertTriangle },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl font-bold tracking-tight">Overview</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="p-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{s.label}</span>
              <s.icon className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="mt-3 font-display text-3xl font-bold">{s.value}</p>
          </Card>
        ))}
      </div>

      {unfulfillable.length > 0 && (
        <div className="mt-10">
          <h2 className="font-display text-xl font-semibold">No active supplier</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            These sell fine but cannot be fulfilled. Assign a supplier on the
            Suppliers page.
          </p>
          <div className="mt-4 divide-y divide-border rounded-2xl border border-border">
            {unfulfillable.map((p) => (
              <div key={p.id} className="flex items-center justify-between px-5 py-3">
                <span className="font-medium">{p.name}</span>
                <span className="text-sm text-muted-foreground">{formatPrice(p.price)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-10">
        <h2 className="font-display text-xl font-semibold">Low stock alerts</h2>
        {lowStock.length === 0 ? (
          <p className="mt-3 text-muted-foreground">All products are well stocked.</p>
        ) : (
          <div className="mt-4 divide-y divide-border rounded-2xl border border-border">
            {lowStock.map((p) => (
              <div key={p.id} className="flex items-center justify-between px-5 py-3">
                <span className="font-medium">{p.name}</span>
                <span className="text-sm text-muted-foreground">{p.stock} in stock</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
