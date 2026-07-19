import { NextResponse } from "next/server";
import { z } from "zod";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { persistRouting } from "@/lib/fulfillment-store";
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
});

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

  const { items, email, shipping_name, shipping_address } = parsed.data;
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  // The cart posts `productId`, but a stored order line is an `OrderItem` with
  // `product_id`. Normalize once here so the demo and Stripe paths persist the
  // identical shape — they previously diverged, leaving demo orders with a
  // `productId` key that nothing downstream reads.
  const orderItems = items.map((i) => ({
    product_id: i.productId,
    name: i.name,
    price: i.price,
    quantity: i.quantity,
    image_url: i.image_url,
  }));

  const supabase = createClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;

  // --- Demo mode: no Stripe configured -> create order directly, skip payment.
  if (!stripe) {
    const admin = createAdminClient();
    let orderId = crypto.randomUUID();
    if (admin) {
      const { data } = await admin
        .from("orders")
        .insert({
          user_id: user?.id ?? null,
          email,
          status: "paid",
          total,
          items: orderItems,
          shipping_name,
          shipping_address,
        })
        .select()
        .single();
      if (data) {
        orderId = data.id;
        // Demo orders route exactly like paid ones, so the admin fulfilment
        // view is populated without Stripe configured.
        await persistRouting(admin, data);
      }
    }
    return NextResponse.json({
      url: `${env.siteUrl}/checkout/success?demo=1&order=${orderId}`,
      demo: true,
    });
  }

  // --- Stripe Checkout (test mode) ---
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: email,
    line_items: items.map((i) => ({
      quantity: i.quantity,
      price_data: {
        currency: "usd",
        unit_amount: i.price,
        product_data: {
          name: i.name,
          images: i.image_url.startsWith("http") ? [i.image_url] : undefined,
        },
      },
    })),
    shipping_address_collection: { allowed_countries: ["US", "GB", "GH", "CA", "PT"] },
    success_url: `${env.siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${env.siteUrl}/checkout?cancelled=1`,
    metadata: {
      user_id: user?.id ?? "",
      shipping_name,
      shipping_address,
      items: JSON.stringify(orderItems),
    },
  });

  return NextResponse.json({ url: session.url });
}
