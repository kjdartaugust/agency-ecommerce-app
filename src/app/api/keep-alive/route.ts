import { NextResponse } from "next/server";
import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/env";

// Pinged daily by a Vercel Cron (see vercel.json) to keep the free-tier
// Supabase project from auto-pausing after 7 days of inactivity.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Keep-alive ping.
 *
 * NOTICE:
 * The database read must happen on every call, before any auth check. The whole
 * point of this route is to register activity against Supabase; an earlier
 * version returned 401 before querying when the caller's secret did not match,
 * so a misnamed or missing CRON_SECRET meant Vercel's cron was rejected at the
 * route and the project paused anyway — the guard defeated the purpose.
 *
 * The read is a single indexed row and the route is obscure, so there is no
 * meaningful abuse surface to protect. CRON_SECRET, when set, now only gates how
 * much detail the response exposes, never whether the ping runs.
 */
export async function GET(request: Request) {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ ok: true, skipped: "supabase-not-configured" });
  }

  const supabase = createPublicClient();
  if (!supabase) {
    return NextResponse.json({ ok: true, skipped: "no-client" });
  }

  // A real single-row read, not a HEAD count: this is the activity that resets
  // the inactivity timer, so it should look like an ordinary query.
  const startedAt = Date.now();
  const { error } = await supabase.from("categories").select("id").limit(1);
  const durationMs = Date.now() - startedAt;

  // Authenticated callers (Vercel Cron sends `Authorization: Bearer
  // $CRON_SECRET`) get timing and error detail; everyone else gets a bare ok.
  const secret = process.env.CRON_SECRET;
  const authorized =
    !secret || request.headers.get("authorization") === `Bearer ${secret}`;

  if (error) {
    console.warn("[keep-alive] ping failed:", error.message);
    return NextResponse.json(
      authorized ? { ok: false, error: error.message } : { ok: false },
      { status: 500 },
    );
  }

  return NextResponse.json(
    authorized
      ? { ok: true, pingedAt: new Date().toISOString(), durationMs }
      : { ok: true },
  );
}
