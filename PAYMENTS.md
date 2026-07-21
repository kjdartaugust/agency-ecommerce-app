# Payments

Lumen accepts payment through pluggable providers. Each is enabled purely by the
presence of its secret key; with none set, checkout runs in **simulated demo
mode** (an order is created and marked paid, no money moves).

| Provider | Merchant availability | Pays with |
| --- | --- | --- |
| **Paystack** | Ghana, Nigeria, South Africa, Kenya, Côte d'Ivoire | Cards, mobile money (MTN / Telecel / AirtelTigo), bank |
| **Flutterwave** | ~30+ African countries incl. Ghana | Cards, mobile money, bank, USSD |
| **Stripe** | US / UK / EU (not most of Africa as a merchant) | Cards |

Customers anywhere can pay with an international card through any provider; the
table's "merchant availability" is where **you** can register and be paid out.
For a store operated from Ghana, use **Paystack and/or Flutterwave**.

## How it works

Checkout is order-first and provider-agnostic:

1. `POST /api/checkout` creates a `pending` order and computes the authoritative
   total (items + shipping) server-side.
2. The chosen provider opens a hosted checkout; the order id is the provider's
   payment reference.
3. The buyer pays on the provider's page and is returned to
   `/checkout/success`.
4. The provider's webhook (`/api/webhooks/<provider>`) verifies its signature,
   flips the order to `paid`, and routes it to suppliers for fulfilment. This
   step is idempotent — a duplicate delivery does the work at most once.

Provider code lives in `src/lib/payments/providers/`; the shared paid-transition
is in `src/lib/payments/webhook.ts`.

## Enabling a provider

Set the keys in `.env.local` (local) or your Vercel project's Environment
Variables (production), then redeploy. Set the store currency once:

```bash
# ISO 4217. For a Ghana store:
NEXT_PUBLIC_PAYMENT_CURRENCY=GHS
```

### Paystack

1. Create a business at <https://dashboard.paystack.com>.
2. **Settings → API Keys & Webhooks** → copy the **Secret Key**.
   - Use `sk_test_…` while testing, `sk_live_…` for real payments.
3. On the same page, set the **Webhook URL** to
   `https://<your-domain>/api/webhooks/paystack`.
4. Env:
   ```bash
   PAYSTACK_SECRET_KEY=sk_test_xxx
   ```
   Signature verification uses this same secret (HMAC-SHA512), so no separate
   webhook secret is needed.

### Flutterwave

1. Create a business at <https://dashboard.flutterwave.com>.
2. **Settings → API Keys** → copy the **Secret Key** (`FLWSECK_test-…`).
3. **Settings → Webhooks** → set the URL to
   `https://<your-domain>/api/webhooks/flutterwave` and choose a **Secret hash**.
4. Env — `FLUTTERWAVE_WEBHOOK_HASH` must equal the Secret hash exactly, or every
   webhook is rejected as unverified:
   ```bash
   FLUTTERWAVE_SECRET_KEY=FLWSECK_test-xxx
   FLUTTERWAVE_WEBHOOK_HASH=your-secret-hash
   ```

### Stripe

```bash
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx   # from the Stripe CLI or dashboard endpoint
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
```
Webhook endpoint: `https://<your-domain>/api/webhooks/stripe`.

## Verifying

**Init round-trip (no payment completed).** With a test secret key in your
environment, this calls the real provider sandbox and asserts a usable hosted
checkout URL comes back — the part unit tests can't cover:

```bash
PAYSTACK_SECRET_KEY=sk_test_xxx npm run test:live
```

**Full round-trip.** Add the key in Vercel, register the webhook, then place an
order on the live site and pay on the hosted page using the provider's current
sandbox test instrument (test card / test mobile-money number — see each
provider's docs, as these change):

- Paystack test cards: <https://paystack.com/docs/payments/test-payments>
- Flutterwave test cards: <https://developer.flutterwave.com/docs/test-cards>

After paying, confirm in the admin that the order moved to `paid` and a
fulfilment was created. If it stays `pending`, the webhook is not reaching you —
recheck the webhook URL and (Flutterwave) the secret hash.

## Going live checklist

- [ ] Business verified with the provider; live keys issued
- [ ] Live keys set in Vercel (not test keys)
- [ ] Webhook URL registered on the **production** domain
- [ ] `NEXT_PUBLIC_PAYMENT_CURRENCY` matches your settlement currency
- [ ] One real low-value transaction completed and refunded per provider
- [ ] Product prices are real and in the store currency's minor units (cents/pesewas)
