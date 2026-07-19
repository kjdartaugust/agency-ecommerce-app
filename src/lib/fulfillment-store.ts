import type { SupabaseClient } from "@supabase/supabase-js";
import { routeOrder } from "@/lib/fulfillment";
import type { Match, Order, Supplier } from "@/lib/types";

/**
 * Persistence boundary for order routing.
 *
 * `routeOrder` decides who fulfils what and stays pure; this module is the only
 * place that reads the supplier network and writes the resulting fulfilments.
 * Both checkout paths — simulated and Stripe — funnel through here so a demo
 * order and a real one land in exactly the same state.
 */

/**
 * Routes a freshly-paid order and stores its fulfilments.
 *
 * Best-effort by design: a routing failure must never fail the webhook, because
 * Stripe would retry and the customer has already paid. An order with no
 * fulfilments shows up unrouted in the admin, which is recoverable; a rejected
 * webhook is not.
 *
 * Returns the number of fulfilments written, or 0 if the order could not be
 * routed at all.
 */
export async function persistRouting(
  admin: SupabaseClient,
  order: Pick<Order, "id" | "total" | "items">,
): Promise<number> {
  try {
    const [{ data: suppliers }, { data: matches }] = await Promise.all([
      admin.from("suppliers").select("*"),
      admin.from("matches").select("*"),
    ]);

    // No supplier network configured yet: the order stays unrouted rather than
    // being invented against a supplier that does not exist.
    if (!suppliers?.length || !matches?.length) return 0;

    const { fulfillments } = routeOrder(
      order,
      suppliers as Supplier[],
      matches as Match[],
    );
    if (!fulfillments.length) return 0;

    // Let Postgres assign fulfilment ids; routeOrder's synthetic ids exist for
    // the seed-data path, where nothing is persisted.
    const rows = fulfillments.map(({ id: _id, ...row }) => row);
    const { error } = await admin.from("fulfillments").insert(rows);
    if (error) return 0;

    return rows.length;
  } catch {
    return 0;
  }
}
