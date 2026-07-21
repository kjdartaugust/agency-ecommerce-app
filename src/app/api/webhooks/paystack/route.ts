import { handleProviderWebhook } from "@/lib/payments/webhook";

// Webhooks need the raw body + Node runtime; never cache.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function POST(req: Request) {
  return handleProviderWebhook("paystack", req);
}
