import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { persistRouting } from "@/lib/fulfillment-store";
import { getProvider } from "@/lib/payments";
import type { Order } from "@/lib/types";
import type { PaymentProviderId } from "@/lib/payments/types";

/**
 * Shared webhook handler for every payment provider.
 *
 * Each provider's route is a one-liner over this: verify + normalize the event
 * through the provider, then, only on a confirmed payment, flip the matching
 * order to paid and route it for fulfilment. Verification lives in the provider;
 * this owns the idempotent state transition.
 */
export async function handleProviderWebhook(
  providerId: PaymentProviderId,
  req: Request,
): Promise<NextResponse> {
  const provider = getProvider(providerId);
  // Raw body is required for signature verification, so read text, not json.
  const rawBody = await req.text();

  // An unconfigured provider cannot have sent a verifiable event. Ack with 200
  // so the provider does not retry a webhook we can never process.
  if (!provider) {
    return NextResponse.json({ received: true, skipped: "provider-not-configured" });
  }

  const result = await provider.parseWebhook(rawBody, req.headers);

  // "ignored" covers bad signatures and events we do not act on (refunds,
  // pending, etc.). 200 keeps the provider from retrying indefinitely; a bad
  // signature simply never reaches the state change below.
  if (result.status !== "paid" || !result.reference) {
    return NextResponse.json({ received: true, status: result.status });
  }

  const admin = createAdminClient();
  if (!admin) {
    return NextResponse.json({ received: true, skipped: "no-database" });
  }

  const { data: order } = await admin
    .from("orders")
    .select("*")
    .eq("id", result.reference)
    .maybeSingle();

  if (!order) {
    return NextResponse.json({ received: true, skipped: "order-not-found" });
  }

  // Idempotency: providers may deliver the same event more than once, and a
  // buyer may also hit the success redirect. Only the first transition to paid
  // does work; repeats are acknowledged and ignored.
  const typed = order as Order;
  if (typed.status === "paid" || typed.status === "fulfilled") {
    return NextResponse.json({ received: true, duplicate: true });
  }

  await admin.from("orders").update({ status: "paid" }).eq("id", typed.id);
  // persistRouting reads only id/total/items; the status was just set above.
  await persistRouting(admin, typed);

  return NextResponse.json({ received: true });
}
