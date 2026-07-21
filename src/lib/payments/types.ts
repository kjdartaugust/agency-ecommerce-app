import type { OrderItem } from "@/lib/types";

/**
 * Payment providers, decoupled from the storefront.
 *
 * Every provider drives the same order-first flow: the app creates a pending
 * order, hands the buyer to the provider's hosted page, and a webhook confirms
 * payment against the order id. The storefront and checkout never learn which
 * provider ran — swapping or adding one is configuration, not a code change.
 *
 * This exists because Stripe is not available to merchants in much of the
 * world; a store in Ghana settles through Paystack or Flutterwave (cards *and*
 * mobile money), and the buyer, not the code, should choose.
 */

export type PaymentProviderId = "stripe" | "paystack" | "flutterwave";

/** Everything a provider needs to open a hosted checkout for one order. */
export interface CheckoutRequest {
  /** Our order id. Used verbatim as the provider-side reference so the webhook can correlate. */
  orderId: string;
  email: string;
  /** Total to charge, in minor units (cents/pesewas) of {@link CheckoutRequest.currency}. */
  amount: number;
  /** ISO 4217 code, e.g. "USD", "GHS", "NGN". */
  currency: string;
  items: OrderItem[];
  shippingName: string;
  shippingAddress: string;
  /** Where the provider returns the buyer after a successful payment. */
  successUrl: string;
  /** Where the provider returns the buyer if they abandon payment. */
  cancelUrl: string;
  userId: string | null;
}

/** A hosted payment page to redirect the buyer to. */
export interface CheckoutSession {
  url: string;
  /** Provider-side reference; equals the order id for every provider here. */
  reference: string;
}

/**
 * Normalized outcome of a webhook, after signature verification.
 *
 * `reference` is our order id. `status` collapses each provider's event
 * vocabulary into the only three outcomes the app acts on.
 */
export interface WebhookResult {
  reference: string | null;
  status: "paid" | "failed" | "ignored";
}

export interface PaymentProvider {
  id: PaymentProviderId;
  /** Buyer-facing name shown on the provider picker. */
  label: string;
  /** Short note on what the buyer can pay with, shown under the label. */
  methods: string;
  /** Opens a hosted checkout and returns where to send the buyer. */
  createCheckout: (req: CheckoutRequest) => Promise<CheckoutSession>;
  /**
   * Verifies a webhook's authenticity and normalizes it. Must reject a bad or
   * missing signature by returning `{ status: "ignored" }` rather than trusting
   * the body — a webhook endpoint is public and unauthenticated otherwise.
   */
  parseWebhook: (rawBody: string, headers: Headers) => Promise<WebhookResult>;
}

/** Provider metadata safe to expose to the browser (no secrets). */
export interface PublicProvider {
  id: PaymentProviderId;
  label: string;
  methods: string;
}
