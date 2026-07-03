import { NextResponse } from "next/server";
import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/env";

// Pinged daily by a Vercel Cron (see vercel.json) to keep the free-tier
// Supabase project from auto-pausing after 7 days of inactivity. Runs a
// trivial read so the project registers "activity".
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  // If CRON_SECRET is set, only allow authorized callers (Vercel Cron sends it).
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  if (!isSupabaseConfigured) {
    return NextResponse.json({ ok: true, skipped: "supabase-not-configured" });
  }

  const supabase = createPublicClient();
  if (!supabase) {
    return NextResponse.json({ ok: true, skipped: "no-client" });
  }

  const { error } = await supabase
    .from("categories")
    .select("id", { head: true, count: "exact" });

  if (error) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, pingedAt: new Date().toISOString() });
}
