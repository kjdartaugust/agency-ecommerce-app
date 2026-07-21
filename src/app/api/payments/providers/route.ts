import { NextResponse } from "next/server";
import { publicProviders } from "@/lib/payments";

// Reads server-only keys to decide what is configured, so it must run per
// request and never be cached into the static build.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Lists configured payment providers for the checkout picker. Secret-free:
 * `configuredProviders` reads the keys, but only id/label/methods leave the
 * server. An empty array means demo mode — the client shows a simulated
 * checkout note.
 */
export function GET() {
  return NextResponse.json({ providers: publicProviders() });
}
