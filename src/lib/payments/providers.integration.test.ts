import { describe, expect, it } from "vitest";

/**
 * Live provider round-trip checks.
 *
 * These hit the real Paystack / Flutterwave sandbox APIs, so they are guarded by
 * the presence of test keys and skipped otherwise — a normal `npm run test` run
 * stays offline and deterministic. Supply sandbox keys to exercise them:
 *
 *   PAYSTACK_SECRET_KEY=sk_test_xxx \
 *   FLUTTERWAVE_SECRET_KEY=FLWSECK_test-xxx \
 *   npm run test:live
 *
 * A pass proves the real contract we cannot verify with unit tests: that our
 * request shape is accepted and the provider returns a usable hosted-checkout
 * URL. It does not complete a payment — that needs a human on the hosted page.
 */

const CHECKOUT = {
  orderId: `verify-${Date.now()}`,
  email: "test@example.com",
  amount: 5000, // minor units
  currency: (process.env.NEXT_PUBLIC_PAYMENT_CURRENCY || "GHS").toUpperCase(),
  items: [
    { product_id: "p1", name: "Verification Item", price: 5000, quantity: 1, image_url: "" },
  ],
  shippingName: "Test Buyer",
  shippingAddress: "1 Test St, Accra",
  successUrl: "https://example.com/checkout/success",
  cancelUrl: "https://example.com/checkout",
  userId: null,
};

const hasPaystack = Boolean(process.env.PAYSTACK_SECRET_KEY);
const hasFlutterwave = Boolean(process.env.FLUTTERWAVE_SECRET_KEY);

describe.runIf(hasPaystack)("paystack live init", () => {
  it("returns a hosted authorization_url for a valid order", async () => {
    const { createPaystackProvider } = await import("@/lib/payments/providers/paystack");
    const provider = createPaystackProvider()!;

    const session = await provider.createCheckout(CHECKOUT);

    expect(session.url).toMatch(/^https:\/\/checkout\.paystack\.com\//);
    expect(session.reference).toBe(CHECKOUT.orderId);
  }, 20000);
});

describe.runIf(hasFlutterwave)("flutterwave live init", () => {
  it("returns a hosted payment link for a valid order", async () => {
    const { createFlutterwaveProvider } = await import("@/lib/payments/providers/flutterwave");
    const provider = createFlutterwaveProvider()!;

    const session = await provider.createCheckout(CHECKOUT);

    expect(session.url).toMatch(/^https:\/\//);
    expect(session.reference).toBe(CHECKOUT.orderId);
  }, 20000);
});

// Visible marker so a run with no keys explains itself rather than looking empty.
describe.runIf(!hasPaystack && !hasFlutterwave)("live payment checks", () => {
  it("skipped — no provider test keys in env", () => {
    expect(true).toBe(true);
  });
});
