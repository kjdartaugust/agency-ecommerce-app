import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import { updateProfile } from "@/app/account/actions";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "Profile" };

export default async function ProfilePage() {
  const supabase = createClient()!;
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role, created_at")
    .eq("id", user!.id)
    .maybeSingle();

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-3xl font-bold tracking-tight">Profile</h1>
      <p className="mt-1 text-muted-foreground">Manage your account details.</p>

      <div className="mt-8 rounded-2xl border border-border bg-card p-6 sm:p-8">
        <form action={updateProfile} className="space-y-5">
          <div>
            <Label htmlFor="full_name">Full name</Label>
            <Input
              id="full_name"
              name="full_name"
              defaultValue={profile?.full_name ?? ""}
              placeholder="Your name"
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={user!.email ?? ""} disabled />
            <p className="mt-1 text-xs text-muted-foreground">Email can't be changed here.</p>
          </div>
          <Button type="submit">Save changes</Button>
        </form>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-card/50 p-6 text-sm">
        <div>
          <p className="text-muted-foreground">Account type</p>
          <Badge variant={profile?.role === "admin" ? "accent" : "secondary"} className="mt-1">
            {profile?.role ?? "customer"}
          </Badge>
        </div>
        {profile?.created_at && (
          <div>
            <p className="text-muted-foreground">Member since</p>
            <p className="mt-1 font-medium">{formatDate(profile.created_at)}</p>
          </div>
        )}
        {profile?.role === "admin" && (
          <a href="/admin" className="ml-auto text-sm font-medium text-primary hover:underline">
            Go to admin dashboard →
          </a>
        )}
      </div>
    </div>
  );
}
