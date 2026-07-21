import { createHmac, timingSafeEqual } from "node:crypto";
import { env } from "@/lib/env";
import type { PaymentProvider } from "@/lib/payments/types";

// Paystack works in minor units, same as our stored prices, so amounts pass
// through unchanged. https://paystack.com/docs/api/transaction/#initialize
const INITIALIZE_URL = "https://api.paystack.co/transaction/initialize";

/**
 * Paystack provider — cards and mobile money across Ghana and Nigeria.
 *
 * `initialize` returns a hosted `authorization_url`; the buyer pays there and
 * Paystack calls the webhook with `charge.success`. We pass the order id as the
 * transaction `reference`, so confirmation is a direct lookup.
 */
export function createPaystackProvider(): PaymentProvider | null {
  const secret = env.paystackSecret;
  if (!secret) return null;

  return {
    id: "paystack",
    label: "Card & Mobile Money (Paystack)",
    methods: "Cards, MTN / Voda / AirtelTigo MoMo, bank",

    async createCheckout(req) {
      const res = await fetch(INITIALIZE_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${secret}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: req.email,
          amount: req.amount, // minor units, no conversion
          currency: req.currency,
          reference: req.orderId,
          callback_url: req.successUrl,
          metadata: {
            order_id: req.orderId,
            user_id: req.userId,
            shipping_name: req.shippingName,
            shipping_address: req.shippingAddress,
          },
        }),
      });

      const body = (await res.json()) as {
        status: boolean;
        message: string;
        data?: { authorization_url: string; reference: string };
      };

      if (!res.ok || !body.status || !body.data) {
        throw new Error(`Paystack init failed: ${body.message || res.statusText}`);
      }

      return { url: body.data.authorization_url, reference: body.data.reference };
    },

    async parseWebhook(rawBody, headers) {
      const signature = headers.get("x-paystack-signature");
      if (!signature) return { reference: null, status: "ignored" };

      // Paystack signs the raw body with HMAC-SHA512 keyed by the secret key.
      const expected = createHmac("sha512", secret).update(rawBody).digest("hex");
      if (!safeEqualHex(signature, expected)) {
        return { reference: null, status: "ignored" };
      }

      const event = JSON.parse(rawBody) as {
        event: string;
        data?: { reference?: string; status?: string };
      };
      if (event.event !== "charge.success") {
        return { reference: event.data?.reference ?? null, status: "ignored" };
      }

      return {
        reference: event.data?.reference ?? null,
        status: event.data?.status === "success" ? "paid" : "failed",
      };
    },
  };
}

/** Constant-time hex compare that never throws on length or format mismatch. */
function safeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  try {
    return timingSafeEqual(Buffer.from(a, "hex"), Buffer.from(b, "hex"));
  } catch {
    return false;
  }
}
