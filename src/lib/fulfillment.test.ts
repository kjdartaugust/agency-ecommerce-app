import { describe, expect, it } from "vitest";
import {
  costForProduct,
  describeDispatch,
  itemsForSupplier,
  marginPercent,
  resolveRouting,
  routeOrder,
} from "@/lib/fulfillment";
import type { Fulfillment, Match, OrderItem, Supplier } from "@/lib/types";

const suppliers: Supplier[] = [
  { id: "s1", name: "Primary", channel_type: "api", contact: "https://x.test/orders", lead_time_days: 2, active: true },
  { id: "s2", name: "Backup", channel_type: "email", contact: "orders@x.test", lead_time_days: 7, active: true },
  { id: "s3", name: "Local", channel_type: "manual", contact: "+233 24 000 0000", lead_time_days: 3, active: true },
];

// p1 is dual-sourced so failover is exercisable; p9 is matched to nothing.
const matches: Match[] = [
  { id: "m1", product_id: "p1", supplier_id: "s1", cost: 1000, priority: 0 },
  { id: "m2", product_id: "p1", supplier_id: "s2", cost: 1200, priority: 1 },
  { id: "m3", product_id: "p2", supplier_id: "s1", cost: 2000, priority: 0 },
  { id: "m4", product_id: "p3", supplier_id: "s3", cost: 3000, priority: 0 },
];

const item = (product_id: string, quantity = 1, price = 5000): OrderItem => ({
  product_id,
  name: `Product ${product_id}`,
  price,
  quantity,
  image_url: "",
});

const order = (items: OrderItem[], id = "o1") => ({
  id,
  items,
  total: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
});

describe("routeOrder", () => {
  it("groups items sharing a supplier into one fulfilment", () => {
    // p1 and p2 both come from s1, so this must produce one shipment, not two.
    const result = routeOrder(order([item("p1"), item("p2")]), suppliers, matches);

    expect(result.fulfillments).toHaveLength(1);
    expect(result.fulfillments[0].supplier_id).toBe("s1");
    expect(result.fulfillments[0].items).toHaveLength(2);
  });

  it("splits an order across every supplier behind its items", () => {
    const result = routeOrder(
      order([item("p1"), item("p2"), item("p3")]),
      suppliers,
      matches,
    );

    expect(result.fulfillments).toHaveLength(2);
    expect(result.fulfillments.map((f) => f.supplier_id).sort()).toEqual(["s1", "s3"]);
  });

  it("multiplies unit cost by quantity", () => {
    const result = routeOrder(order([item("p1", 3)]), suppliers, matches);

    expect(result.fulfillments[0].items[0].cost).toBe(1000);
    expect(result.fulfillments[0].cost_total).toBe(3000);
    expect(result.costTotal).toBe(3000);
  });

  it("derives margin as revenue minus cost of goods", () => {
    const o = order([item("p1", 1, 5000)]);
    const result = routeOrder(o, suppliers, matches);

    expect(o.total).toBe(5000);
    expect(result.costTotal).toBe(1000);
    expect(result.margin).toBe(4000);
  });

  it("selects the lowest-priority match, not the cheapest", () => {
    // s1 at priority 0 costs 1000; a cheaper competing source must not win on
    // price alone, because priority encodes lead time and reliability.
    const cheaperBackup: Match[] = [
      { id: "m1", product_id: "p1", supplier_id: "s1", cost: 1000, priority: 0 },
      { id: "m2", product_id: "p1", supplier_id: "s2", cost: 10, priority: 1 },
    ];
    const result = routeOrder(order([item("p1")]), suppliers, cheaperBackup);

    expect(result.fulfillments[0].supplier_id).toBe("s1");
    expect(result.fulfillments[0].items[0].cost).toBe(1000);
  });

  it("falls through to the next priority when the primary is paused", () => {
    const paused = suppliers.map((s) => (s.id === "s1" ? { ...s, active: false } : s));
    const result = routeOrder(order([item("p1")]), paused, matches);

    expect(result.fulfillments[0].supplier_id).toBe("s2");
    expect(result.fulfillments[0].items[0].cost).toBe(1200);
    // Margin compresses because the fallback costs more.
    expect(result.margin).toBe(5000 - 1200);
  });

  it("reports items with no active supplier as unrouted rather than dropping them", () => {
    const result = routeOrder(order([item("p1"), item("p9", 2)]), suppliers, matches);

    expect(result.unrouted).toEqual([
      { product_id: "p9", name: "Product p9", quantity: 2 },
    ]);
    expect(result.fulfillments).toHaveLength(1);
  });

  it("treats a product as unrouted when every match points at a paused supplier", () => {
    const allPaused = suppliers.map((s) => ({ ...s, active: false }));
    const result = routeOrder(order([item("p1")]), allPaused, matches);

    expect(result.fulfillments).toHaveLength(0);
    expect(result.unrouted).toHaveLength(1);
  });

  it("never loses units: every ordered unit is placed or unrouted", () => {
    const items = [item("p1", 2), item("p2", 1), item("p3", 4), item("p9", 3)];
    const result = routeOrder(order(items), suppliers, matches);

    const ordered = items.reduce((sum, i) => sum + i.quantity, 0);
    const placed = result.fulfillments
      .flatMap((f) => f.items)
      .reduce((sum, i) => sum + i.quantity, 0);
    const skipped = result.unrouted.reduce((sum, i) => sum + i.quantity, 0);

    expect(placed + skipped).toBe(ordered);
  });

  it("routes nothing and invents no supplier when the network is empty", () => {
    const result = routeOrder(order([item("p1"), item("p2")]), [], []);

    expect(result.fulfillments).toHaveLength(0);
    expect(result.unrouted).toHaveLength(2);
    expect(result.costTotal).toBe(0);
    // Margin reads as full revenue here: unrouted items contribute revenue with
    // no cost yet, which is why unrouted is surfaced alongside it.
    expect(result.margin).toBe(10000);
  });
});

describe("resolveRouting", () => {
  const o = order([item("p1"), item("p2")]);

  it("projects routing when nothing has been persisted", () => {
    const result = resolveRouting(o, [], suppliers, matches);

    expect(result.derived).toBe(true);
    expect(result.fulfillments).toHaveLength(1);
  });

  it("prefers stored fulfilments over recomputing, preserving status and tracking", () => {
    // Stored history must win: it records what was actually dispatched, plus
    // any later edits a fresh routing pass knows nothing about.
    const stored: Fulfillment[] = [
      {
        id: "f1",
        order_id: "o1",
        supplier_id: "s2",
        items: [{ product_id: "p1", name: "Product p1", quantity: 1, cost: 1200 }],
        cost_total: 1200,
        status: "shipped",
        tracking: "TRK123",
        created_at: "2026-01-01T00:00:00Z",
      },
    ];
    const result = resolveRouting(o, stored, suppliers, matches);

    expect(result.derived).toBe(false);
    expect(result.fulfillments[0].status).toBe("shipped");
    expect(result.fulfillments[0].tracking).toBe("TRK123");
    // s2, not the s1 a fresh routing pass would have chosen.
    expect(result.fulfillments[0].supplier_id).toBe("s2");
    expect(result.costTotal).toBe(1200);
  });

  it("recovers order items no stored fulfilment covers", () => {
    const stored: Fulfillment[] = [
      {
        id: "f1",
        order_id: "o1",
        supplier_id: "s1",
        items: [{ product_id: "p1", name: "Product p1", quantity: 1, cost: 1000 }],
        cost_total: 1000,
        status: "sent",
        tracking: null,
        created_at: "2026-01-01T00:00:00Z",
      },
    ];
    // p2 is on the order but absent from storage, so it was never placed.
    const result = resolveRouting(o, stored, suppliers, matches);

    expect(result.unrouted).toEqual([
      { product_id: "p2", name: "Product p2", quantity: 1 },
    ]);
  });

  it("ignores fulfilments belonging to other orders", () => {
    const stored: Fulfillment[] = [
      {
        id: "f1",
        order_id: "other-order",
        supplier_id: "s1",
        items: [{ product_id: "p1", name: "Product p1", quantity: 1, cost: 1000 }],
        cost_total: 1000,
        status: "sent",
        tracking: null,
        created_at: "2026-01-01T00:00:00Z",
      },
    ];
    const result = resolveRouting(o, stored, suppliers, matches);

    expect(result.derived).toBe(true);
  });
});

describe("describeDispatch", () => {
  it("sends a machine payload to api suppliers", () => {
    const { fulfillments } = routeOrder(order([item("p1")]), suppliers, matches);
    const dispatch = describeDispatch(fulfillments[0], suppliers[0]);

    expect(dispatch.channel).toBe("api");
    expect(dispatch.destination).toBe("https://x.test/orders");
    expect(JSON.parse(dispatch.body).order_id).toBe("o1");
  });

  it("sends human-readable text to suppliers with no software", () => {
    const { fulfillments } = routeOrder(order([item("p3", 2)]), suppliers, matches);
    const dispatch = describeDispatch(fulfillments[0], suppliers[2]);

    expect(dispatch.channel).toBe("manual");
    expect(dispatch.destination).toBe("+233 24 000 0000");
    expect(dispatch.body).toContain("2 x Product p3");
    expect(() => JSON.parse(dispatch.body)).toThrow();
  });
});

describe("costForProduct", () => {
  it("returns the supplier that would be selected and its unit cost", () => {
    const result = costForProduct("p1", suppliers, matches);

    expect(result?.supplier.id).toBe("s1");
    expect(result?.cost).toBe(1000);
  });

  it("returns null for a product with no active supplier", () => {
    expect(costForProduct("p9", suppliers, matches)).toBeNull();
  });
});

describe("itemsForSupplier", () => {
  it("sums quantities of the same product across separate fulfilments", () => {
    const fulfillments: Fulfillment[] = [
      {
        id: "f1", order_id: "o1", supplier_id: "s1",
        items: [{ product_id: "p1", name: "Product p1", quantity: 2, cost: 1000 }],
        cost_total: 2000, status: "pending", tracking: null, created_at: "",
      },
      {
        id: "f2", order_id: "o2", supplier_id: "s1",
        items: [{ product_id: "p1", name: "Product p1", quantity: 3, cost: 1000 }],
        cost_total: 3000, status: "pending", tracking: null, created_at: "",
      },
      {
        id: "f3", order_id: "o3", supplier_id: "s2",
        items: [{ product_id: "p1", name: "Product p1", quantity: 9, cost: 1200 }],
        cost_total: 10800, status: "pending", tracking: null, created_at: "",
      },
    ];

    const result = itemsForSupplier(fulfillments, "s1");

    expect(result).toHaveLength(1);
    expect(result[0].quantity).toBe(5);
  });

  it("does not mutate the fulfilments it aggregates", () => {
    const fulfillments: Fulfillment[] = [
      {
        id: "f1", order_id: "o1", supplier_id: "s1",
        items: [{ product_id: "p1", name: "Product p1", quantity: 2, cost: 1000 }],
        cost_total: 2000, status: "pending", tracking: null, created_at: "",
      },
      {
        id: "f2", order_id: "o2", supplier_id: "s1",
        items: [{ product_id: "p1", name: "Product p1", quantity: 3, cost: 1000 }],
        cost_total: 3000, status: "pending", tracking: null, created_at: "",
      },
    ];

    itemsForSupplier(fulfillments, "s1");

    expect(fulfillments[0].items[0].quantity).toBe(2);
  });
});

describe("marginPercent", () => {
  it("expresses margin as a share of revenue", () => {
    expect(marginPercent(10000, 4000)).toBe(40);
  });

  it("returns 0 rather than dividing by zero on a zero-revenue order", () => {
    expect(marginPercent(0, 0)).toBe(0);
  });

  it("goes negative when an order is sold below cost", () => {
    expect(marginPercent(1000, -500)).toBe(-50);
  });
});
