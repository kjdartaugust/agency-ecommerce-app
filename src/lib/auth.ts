import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";

export type AdminContext = {
  configured: boolean;
  userEmail: string | null;
  isAdmin: boolean;
};

/**
 * Resolve the current admin context. In demo mode (no Supabase) we grant a
 * read-only admin view so the dashboard is explorable without a backend.
 */
export async function getAdminContext(): Promise<AdminContext> {
  if (!isSupabaseConfigured) {
    return { configured: false, userEmail: null, isAdmin: true };
  }
  const supabase = createClient()!;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { configured: true, userEmail: null, isAdmin: false };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return {
    configured: true,
    userEmail: user.email ?? null,
    isAdmin: profile?.role === "admin",
  };
}
