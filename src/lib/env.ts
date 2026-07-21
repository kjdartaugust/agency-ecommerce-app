export const env = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,

  // Stripe — cards, mostly US/EU. Not available to merchants in much of Africa.
  stripeSecret: process.env.STRIPE_SECRET_KEY,
  stripePublishable: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,

  // Paystack — cards + mobile money across Ghana, Nigeria, and more.
  paystackSecret: process.env.PAYSTACK_SECRET_KEY,

  // Flutterwave — cards + mobile money + bank across much of Africa.
  flutterwaveSecret: process.env.FLUTTERWAVE_SECRET_KEY,
  // Shared secret echoed back in the `verif-hash` webhook header.
  flutterwaveWebhookHash: process.env.FLUTTERWAVE_WEBHOOK_HASH,

  // Currency every charge is created in. Product prices are stored as minor
  // units (cents/pesewas) of this currency. Public because the storefront reads
  // it too. Defaults to USD so nothing changes for existing deployments.
  paymentCurrency: (process.env.NEXT_PUBLIC_PAYMENT_CURRENCY || "USD").toUpperCase(),

  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
};

export const isSupabaseConfigured = Boolean(
  env.supabaseUrl && env.supabaseAnonKey
);

export const isStripeConfigured = Boolean(env.stripeSecret);
export const isPaystackConfigured = Boolean(env.paystackSecret);
export const isFlutterwaveConfigured = Boolean(env.flutterwaveSecret);
