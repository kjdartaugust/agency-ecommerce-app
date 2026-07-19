import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { persistRouting } from "@/lib/fulfillment-store";
import { env } from "@/lib/env";

// Webhooks need the raw body + Node runtime; never cache.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Stripe requires the raw body to verify the signature.
export async function POST(req: Request) {
  if (!stripe || !env.stripeWebhookSecret) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 400 });
  }

  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  const payload = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, sig, env.stripeWebhookSecret);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Invalid signature";
    return NextResponse.json({ error: `Webhook error: ${msg}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const admin = createAdminClient();
    if (admin) {
      // Idempotency: Stripe may deliver the same event more than once.
      const { data: existing } = await admin
        .from("orders")
        .select("id")
        .eq("stripe_session_id", session.id)
        .maybeSingle();
      if (existing) {
        return NextResponse.json({ received: true, duplicate: true });
      }

      const meta = session.metadata ?? {};
      let items: unknown = [];
      try {
        items = JSON.parse(meta.items || "[]");
      } catch {
        items = [];
      }
      const { data: order } = await admin
        .from("orders")
        .insert({
          user_id: meta.user_id || null,
          email: session.customer_email ?? session.customer_details?.email ?? "",
          status: "paid",
          total: session.amount_total ?? 0,
          currency: (session.currency ?? "usd").toUpperCase(),
          items,
          shipping_name: meta.shipping_name || session.customer_details?.name || null,
          shipping_address: meta.shipping_address || null,
          stripe_session_id: session.id,
        })
        .select()
        .single();

      if (order) await persistRouting(admin, order);
    }
  }

  return NextResponse.json({ received: true });
}
