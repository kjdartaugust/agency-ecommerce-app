import { createFlutterwaveProvider } from "@/lib/payments/providers/flutterwave";
import { createPaystackProvider } from "@/lib/payments/providers/paystack";
import { createStripeProvider } from "@/lib/payments/providers/stripe";
import type { PaymentProvider, PaymentProviderId, PublicProvider } from "@/lib/payments/types";

/**
 * Default provider order when the buyer has not chosen one.
 *
 * Paystack and Flutterwave lead because this store's operators are in markets
 * Stripe does not serve as a merchant; Stripe stays available for card-only
 * regions. This orders the *default* only — the buyer picks from whatever is
 * configured.
 */
const PRIORITY: PaymentProviderId[] = ["paystack", "flutterwave", "stripe"];

/** Every provider whose keys are present, in default-selection order. */
export function configuredProviders(): PaymentProvider[] {
  const built = [
    createPaystackProvider(),
    createFlutterwaveProvider(),
    createStripeProvider(),
  ].filter((p): p is PaymentProvider => p !== null);

  return built.sort((a, b) => PRIORITY.indexOf(a.id) - PRIORITY.indexOf(b.id));
}

/**
 * Resolves the provider to charge with.
 *
 * An explicit, configured `requested` id always wins so the buyer's choice is
 * honoured; otherwise the highest-priority configured provider is used. Returns
 * null when nothing is configured, which the checkout route reads as "simulate
 * the payment" — the app's zero-config demo mode.
 */
export function resolveProvider(requested?: string | null): PaymentProvider | null {
  const providers = configuredProviders();
  if (requested) {
    const match = providers.find((p) => p.id === requested);
    if (match) return match;
  }
  return providers[0] ?? null;
}

/** Provider ids present in config, for webhook routes to look up their own provider. */
export function getProvider(id: PaymentProviderId): PaymentProvider | null {
  return configuredProviders().find((p) => p.id === id) ?? null;
}

/** Browser-safe provider list (no secrets) for the checkout picker. */
export function publicProviders(): PublicProvider[] {
  return configuredProviders().map(({ id, label, methods }) => ({ id, label, methods }));
}
