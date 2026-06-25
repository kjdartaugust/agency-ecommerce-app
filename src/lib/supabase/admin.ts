import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";

// Service-role client for privileged server-side operations (webhooks, admin).
export function createAdminClient() {
  if (!env.supabaseUrl || !env.supabaseServiceKey) return null;
  return createClient(env.supabaseUrl, env.supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
