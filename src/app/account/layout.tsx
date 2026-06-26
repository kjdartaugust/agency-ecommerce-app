import Link from "next/link";
import { redirect } from "next/navigation";
import { User, Package, LogOut, ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { Section } from "@/components/ui/section";
import { signOut } from "@/app/account/actions";

export const dynamic = "force-dynamic";

const nav = [
  { href: "/account", label: "Profile", icon: User },
  { href: "/account/orders", label: "Orders", icon: Package },
];

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured) {
    return (
      <Section className="pt-20 text-center">
        <h1 className="font-display text-3xl font-bold">Your account</h1>
        <p className="mx-auto mt-3 max-w-md text-muted-foreground">
          Connect Supabase (see <code>.env.example</code>) to enable accounts, profiles, and order
          history.
        </p>
      </Section>
    );
  }

  const supabase = createClient()!;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/account");

  return (
    <div className="container-px mx-auto flex max-w-7xl gap-8 py-10">
      <aside className="hidden w-56 shrink-0 md:block">
        <div className="sticky top-24 space-y-1">
          <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Account
          </p>
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <n.icon className="h-4 w-4" /> {n.label}
            </Link>
          ))}
          <form action={signOut}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </form>
          <Link
            href="/"
            className="mt-4 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:bg-secondary"
          >
            <ArrowLeft className="h-4 w-4" /> Back to site
          </Link>
        </div>
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
