import { DollarSign, Package, ShoppingCart, AlertTriangle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getProducts } from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import type { Order } from "@/lib/types";
import { Card } from "@/components/ui/card";

export default async function AdminOverview() {
  const products = await getProducts();
  const supabase = createClient();
  let orders: Order[] = [];
  if (supabase) {
    const { data } = await supabase.from("orders").select("*");
    orders = (data as Order[]) ?? [];
  }

  const revenue = orders
    .filter((o) => o.status === "paid" || o.status === "fulfilled")
    .reduce((sum, o) => sum + o.total, 0);
  const lowStock = products.filter((p) => p.stock <= 10);

  const stats = [
    { label: "Revenue", value: formatPrice(revenue), icon: DollarSign },
    { label: "Orders", value: String(orders.length), icon: ShoppingCart },
    { label: "Products", value: String(products.length), icon: Package },
    { label: "Low stock", value: String(lowStock.length), icon: AlertTriangle },
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
