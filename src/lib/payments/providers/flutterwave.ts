import { timingSafeEqual } from "node:crypto";
import { env } from "@/lib/env";
import { toMajorUnits } from "@/lib/payments/money";
import type { PaymentProvider } from "@/lib/payments/types";

// Unlike Stripe and Paystack, Flutterwave's Standard API takes a major-unit
// amount. https://developer.flutterwave.com/reference/create-a-payment
const PAYMENTS_URL = "https://api.flutterwave.com/v3/payments";

/**
 * Flutterwave provider — cards, mobile money, and bank across much of Africa.
 *
 * `payments` returns a hosted `data.link`; the buyer pays there and Flutterwave
 * calls the webhook. We pass the order id as `tx_ref` and confirm on the
 * `charge.completed` event with `status: "successful"`.
 */
export function createFlutterwaveProvider(): PaymentProvider | null {
  const secret = env.flutterwaveSecret;
  if (!secret) return null;

  return {
    id: "flutterwave",
    label: "Card & Mobile Money (Flutterwave)",
    methods: "Cards, mobile money, bank transfer, USSD",

    async createCheckout(req) {
      const res = await fetch(PAYMENTS_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${secret}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tx_ref: req.orderId,
          amount: toMajorUnits(req.amount), // major units, unlike the others
          currency: req.currency,
          redirect_url: req.successUrl,
          customer: { email: req.email, name: req.shippingName },
          meta: { order_id: req.orderId, user_id: req.userId },
        }),
      });

      const body = (await res.json()) as {
        status: string;
        message: string;
        data?: { link: string };
      };

      if (!res.ok || body.status !== "success" || !body.data) {
        throw new Error(`Flutterwave init failed: ${body.message || res.statusText}`);
      }

      return { url: body.data.link, reference: req.orderId };
    },

    async parseWebhook(rawBody, headers) {
      // Flutterwave authenticates webhooks by echoing a shared secret in a
      // header — there is no body signature — so the hash must be configured and
      // must match exactly, or the event is untrusted.
      const configured = env.flutterwaveWebhookHash;
      const received = headers.get("verif-hash");
      if (!configured || !received || !safeEqual(received, configured)) {
        return { reference: null, status: "ignored" };
      }

      const event = JSON.parse(rawBody) as {
        event?: string;
        data?: { tx_ref?: string; status?: string };
      };
      const reference = event.data?.tx_ref ?? null;
      if (event.event !== "charge.completed") {
        return { reference, status: "ignored" };
      }

      return {
        reference,
        status: event.data?.status === "successful" ? "paid" : "failed",
      };
    },
  };
}

/** Constant-time string compare that never throws on length mismatch. */
function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}
