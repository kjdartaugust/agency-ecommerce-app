import type {
  Fulfillment,
  FulfillmentItem,
  Match,
  Order,
  OrderItem,
  Supplier,
  UnroutedItem,
} from "@/lib/types";

/**
 * Order routing: decides *who fulfils what* once an order is paid.
 *
 * The storefront sells a product; it does not care who ships it. This module
 * owns that separation — products are bound to suppliers through matches, so a
 * supplier can be swapped, deactivated, or undercut without the catalogue,
 * checkout, or the customer ever changing.
 */

/** What a routing pass produced, including the items it could not place. */
export type RoutingResult = {
  fulfillments: Fulfillment[];
  /** Items with no active supplier. Never silently dropped — nobody is packing these. */
  unrouted: UnroutedItem[];
  /** Order revenue minus cost of goods across all fulfilments, in cents. */
  margin: number;
  costTotal: number;
};

/**
 * Picks the supplier for one product: lowest `priority` among active suppliers.
 *
 * Priority — not cost — decides, because the cheapest source is not always the
 * one you want (lead time, reliability, and exclusivity all live in that
 * ordering). Cost is recorded for margin, not used for selection.
 */
function selectMatch(
  productId: string,
  matches: Match[],
  suppliersById: Map<string, Supplier>,
): Match | null {
  const candidates = matches
    .filter(m => m.product_id === productId)
    .filter(m => suppliersById.get(m.supplier_id)?.active)
    .sort((a, b) => a.priority - b.priority);

  return candidates[0] ?? null;
}

/**
 * Splits a paid order into one fulfilment per supplier.
 *
 * An order with three items from two suppliers becomes two fulfilments, each
 * tracked independently — that is the whole point, since a supplier can only
 * ship what it holds. Items with no active match are returned in `unrouted`
 * rather than being attached to an arbitrary supplier.
 *
 * Pure: it computes the routing but persists nothing, so both the simulated and
 * the Stripe checkout paths can call it and store the result their own way.
 */
export function routeOrder(
  order: Pick<Order, "id" | "total" | "items">,
  suppliers: Supplier[],
  matches: Match[],
  now: () => string = () => new Date().toISOString(),
): RoutingResult {
  const suppliersById = new Map(suppliers.map(s => [s.id, s]));

  // Group by supplier as we go, so multiple items sharing a supplier collapse
  // into a single fulfilment instead of one per line.
  const bySupplier = new Map<string, FulfillmentItem[]>();
  const unrouted: UnroutedItem[] = [];

  for (const item of order.items) {
    const match = selectMatch(item.product_id, matches, suppliersById);
    if (!match) {
      unrouted.push({
        product_id: item.product_id,
        name: item.name,
        quantity: item.quantity,
      });
      continue;
    }

    const existing = bySupplier.get(match.supplier_id) ?? [];
    existing.push({
      product_id: item.product_id,
      name: item.name,
      quantity: item.quantity,
      // Snapshot the unit cost: a later price renegotiation must not silently
      // restate the margin on orders already placed.
      cost: match.cost,
    });
    bySupplier.set(match.supplier_id, existing);
  }

  // Array.from rather than spread: the project targets below ES2015, where Map
  // iterators are not directly spreadable.
  const fulfillments: Fulfillment[] = Array.from(bySupplier.entries()).map(
    ([supplierId, items]: [string, FulfillmentItem[]], index: number) => ({
      id: `${order.id}-f${index + 1}`,
      order_id: order.id,
      supplier_id: supplierId,
      items,
      cost_total: items.reduce(
        (sum: number, i: FulfillmentItem) => sum + i.cost * i.quantity,
        0,
      ),
      status: "pending",
      tracking: null,
      created_at: now(),
    }),
  );

  const costTotal = fulfillments.reduce((sum, f) => sum + f.cost_total, 0);

  return {
    fulfillments,
    unrouted,
    costTotal,
    // Margin counts only what we actually sourced. Unrouted items contribute
    // revenue with no cost yet, so this reads optimistically until they are
    // placed — which is why `unrouted` is surfaced alongside it.
    margin: order.total - costTotal,
  };
}

/**
 * Routing as the admin should display it for one order.
 *
 * Persisted fulfilments win when they exist — they are the record of what was
 * actually dispatched, including any later status or tracking edits. With no
 * backend configured nothing is ever written, so routing is recomputed on the
 * fly instead, letting the admin demonstrate the full flow on seed data.
 *
 * The two cases are not equivalent and must not be conflated: stored routing is
 * history, derived routing is a projection of what *would* happen now.
 */
export function resolveRouting(
  order: Pick<Order, "id" | "total" | "items">,
  persisted: Fulfillment[],
  suppliers: Supplier[],
  matches: Match[],
): RoutingResult & { derived: boolean } {
  const stored = persisted.filter(f => f.order_id === order.id);
  if (!stored.length) {
    return { ...routeOrder(order, suppliers, matches), derived: true };
  }

  const costTotal = stored.reduce((sum, f) => sum + f.cost_total, 0);

  // Anything on the order that no stored fulfilment covers was never placed —
  // recovered by diffing rather than trusted from a stale column.
  const placed = new Set<string>();
  for (const f of stored) {
    for (const item of f.items) placed.add(item.product_id);
  }
  const unrouted: UnroutedItem[] = order.items
    .filter(i => !placed.has(i.product_id))
    .map(i => ({
      product_id: i.product_id,
      name: i.name,
      quantity: i.quantity,
    }));

  return {
    fulfillments: stored,
    unrouted,
    costTotal,
    margin: order.total - costTotal,
    derived: false,
  };
}

/**
 * Renders the instruction a supplier receives, per channel.
 *
 * `api` suppliers get a machine payload; everyone else gets text a human can
 * act on. This is what lets a supplier with no software still be a real
 * fulfilment destination.
 */
export function describeDispatch(
  fulfillment: Fulfillment,
  supplier: Supplier,
): { channel: Supplier["channel_type"]; destination: string; body: string } {
  const lines = fulfillment.items
    .map(i => `${i.quantity} x ${i.name}`)
    .join("\n");

  const body =
    supplier.channel_type === "api"
      ? JSON.stringify(
          { order_id: fulfillment.order_id, items: fulfillment.items },
          null,
          2,
        )
      : `Order ${fulfillment.order_id}\n\n${lines}`;

  return { channel: supplier.channel_type, destination: supplier.contact, body };
}

/** Formats cents as a currency string for admin surfaces. */
export function formatMoney(cents: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(
    cents / 100,
  );
}

/** Margin as a percentage of revenue. Returns 0 for a zero-revenue order. */
export function marginPercent(revenue: number, margin: number): number {
  if (revenue <= 0) return 0;
  return (margin / revenue) * 100;
}

/** Unit-cost lookup used by admin views that price a product before any order exists. */
export function costForProduct(
  productId: string,
  suppliers: Supplier[],
  matches: Match[],
): { supplier: Supplier; cost: number } | null {
  const suppliersById = new Map(suppliers.map(s => [s.id, s]));
  const match = selectMatch(productId, matches, suppliersById);
  if (!match) return null;

  const supplier = suppliersById.get(match.supplier_id);
  if (!supplier) return null;

  return { supplier, cost: match.cost };
}

/** Aggregate order items by product across fulfilments — used for supplier load views. */
export function itemsForSupplier(
  fulfillments: Fulfillment[],
  supplierId: string,
): FulfillmentItem[] {
  const totals = new Map<string, FulfillmentItem>();

  for (const f of fulfillments.filter(f => f.supplier_id === supplierId)) {
    for (const item of f.items) {
      const existing = totals.get(item.product_id);
      if (existing) {
        existing.quantity += item.quantity;
        continue;
      }
      totals.set(item.product_id, { ...item });
    }
  }

  return Array.from(totals.values());
}

export type { OrderItem };
