/**
 * Amount conversions between the app and payment providers.
 *
 * The app stores money as minor units (an integer number of cents/pesewas),
 * which is also what Stripe and Paystack expect. Flutterwave is the exception —
 * it wants a major-unit decimal — so the conversion lives here, once, tested,
 * instead of inline at a call site where a stray *100 would silently over- or
 * under-charge a real customer.
 */

/**
 * Minor units → major-unit number.
 *
 * Before:
 * - 18900  (USD cents)
 *
 * After:
 * - 189    (USD)
 */
export function toMajorUnits(minor: number): number {
  return minor / 100;
}

/** Two-decimal major-unit string, for provider fields that want text ("189.00"). */
export function toMajorUnitsString(minor: number): string {
  return toMajorUnits(minor).toFixed(2);
}
