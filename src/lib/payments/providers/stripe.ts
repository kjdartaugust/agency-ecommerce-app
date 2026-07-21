import { stripe } from "@/lib/stripe";
import { env } from "@/lib/env";
import type { PaymentProvider } from "@/lib/payments/types";

/**
 * Stripe provider.
 *
 * Uses Stripe Checkout Sessions, but adapted to the shared order-first flow:
 * the order already exists as `pending` before the session is created, the
 * order id rides along as `client_reference_id`, and the webhook flips that
 * order to paid rather than inserting a new one.
 */
export function createStripeProvider(): PaymentProvider | null {
  if (!stripe) return null;

  return {
    id: "stripe",
    label: "Card (Stripe)",
    methods: "Visa, Mastercard, Amex",

    async createCheckout(req) {
      const session = await stripe!.checkout.sessions.create({
        mode: "payment",
        customer_email: req.email,
        // Correlates the webhook back to our order without parsing metadata.
        client_reference_id: req.orderId,
        line_items: req.items.map((i) => ({
          quantity: i.quantity,
          price_data: {
            currency: req.currency.toLowerCase(),
            unit_amount: i.price,
            product_data: {
              name: i.name,
              images: i.image_url.startsWith("http") ? [i.image_url] : undefined,
            },
          },
        })),
        shipping_address_collection: { allowed_countries: ["US", "GB", "GH", "CA", "PT", "NG"] },
        success_url: req.successUrl,
        cancel_url: req.cancelUrl,
        metadata: { order_id: req.orderId, user_id: req.userId ?? "" },
      });

      return { url: session.url ?? req.cancelUrl, reference: req.orderId };
    },

    async parseWebhook(rawBody, headers) {
      const signature = headers.get("stripe-signature");
      if (!stripe || !env.stripeWebhookSecret || !signature) {
        return { reference: null, status: "ignored" };
      }

      let event;
      try {
        event = stripe.webhooks.constructEvent(rawBody, signature, env.stripeWebhookSecret);
      } catch {
        // Bad signature: treat as untrusted, never act on the body.
        return { reference: null, status: "ignored" };
      }

      if (event.type !== "checkout.session.completed") {
        return { reference: null, status: "ignored" };
      }

      const session = event.data.object as {
        client_reference_id: string | null;
        payment_status: string;
        metadata?: { order_id?: string };
      };
      const reference = session.client_reference_id ?? session.metadata?.order_id ?? null;
      const status = session.payment_status === "paid" ? "paid" : "failed";

      return { reference, status };
    },
  };
}
