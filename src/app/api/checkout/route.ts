import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { persistRouting } from "@/lib/fulfillment-store";
import { resolveProvider } from "@/lib/payments";
import { env } from "@/lib/env";

const itemSchema = z.object({
  productId: z.string(),
  name: z.string(),
  price: z.number().int().nonnegative(),
  quantity: z.number().int().positive(),
  image_url: z.string().url().or(z.string()),
});

const schema = z.object({
  items: z.array(itemSchema).min(1),
  email: z.string().email(),
  shipping_name: z.string().min(1),
  shipping_address: z.string().min(1),
  // Optional: the buyer's chosen provider. Ignored if not configured.
  provider: z.string().optional(),
});

// Shipping policy, authoritative on the server. The client shows the same
// numbers, but the amount charged must be computed here so a tampered or stale
// client can never change what the customer pays.
const SHIPPING_THRESHOLD = 10000;
const SHIPPING_FEE = 900;

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 422 });
  }

  const { items, email, shipping_name, shipping_address, provider: requested } = parsed.data;

  // The cart posts `productId`; a stored order line is an `OrderItem` with
  // `product_id`. Normalize once so every downstream reader sees one shape.
  const orderItems = items.map((i) => ({
    product_id: i.productId,
    name: i.name,
    price: i.price,
    quantity: i.quantity,
    image_url: i.image_url,
  }));

  const itemsTotal = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shipping = itemsTotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  // Charge items + shipping. Previously the server charged items only, so every
  // order under the free-shipping threshold silently undercharged the fee.
  const total = itemsTotal + shipping;

  const supabase = createClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;
  const admin = createAdminClient();
  const provider = resolveProvider(requested);

  // Order-first: the order exists before payment. With a live provider it starts
  // `pending` and its webhook flips it to paid; without one (demo mode) it is
  // paid immediately. Correlation between provider and order is the order id.
  let orderId = crypto.randomUUID();
  let order = null;
  if (admin) {
    const { data } = await admin
      .from("orders")
      .insert({
        user_id: user?.id ?? null,
        email,
        status: provider ? "pending" : "paid",
        total,
        currency: env.paymentCurrency,
        items: orderItems,
        shipping_name,
        shipping_address,
      })
      .select()
      .single();
    if (data) {
      order = data;
      orderId = data.id;
    }
  }

  // Demo mode: no provider configured. Treat as paid and route immediately, so
  // the whole fulfilment flow is exercisable with zero payment keys.
  if (!provider) {
    if (admin && order) await persistRouting(admin, order);
    return NextResponse.json({
      url: `${env.siteUrl}/checkout/success?demo=1&order=${orderId}`,
      demo: true,
    });
  }

  try {
    const session = await provider.createCheckout({
      orderId,
      email,
      amount: total,
      currency: env.paymentCurrency,
      items: orderItems,
      shippingName: shipping_name,
      shippingAddress: shipping_address,
      successUrl: `${env.siteUrl}/checkout/success?order=${orderId}`,
      cancelUrl: `${env.siteUrl}/checkout?cancelled=1`,
      userId: user?.id ?? null,
    });
    return NextResponse.json({ url: session.url, provider: provider.id });
  } catch (err) {
    // The pending order stays in the DB as an abandoned-payment record rather
    // than being deleted, so it can be reconciled or retried.
    console.error("[checkout] provider init failed:", err);
    return NextResponse.json(
      { error: "Could not start payment. Please try again." },
      { status: 502 },
    );
  }
}
