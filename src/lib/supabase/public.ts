import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { env, isSupabaseConfigured } from "@/lib/env";

/**
 * Cookie-free anon client for PUBLIC reads (catalog, projects, blog, etc.).
 * Safe to call during static generation / generateStaticParams because it
 * never touches request-scoped APIs like `cookies()`.
 */
export function createPublicClient() {
  if (!isSupabaseConfigured) return null;
  return createSupabaseClient(env.supabaseUrl!, env.supabaseAnonKey!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
