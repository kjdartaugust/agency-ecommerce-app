import type { Metadata } from "next";
import { Suspense } from "react";
import { Section } from "@/components/ui/section";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <Section className="pt-20">
      <div className="mb-8 text-center">
        <h1 className="font-display text-3xl font-bold tracking-tight">Welcome to Lumen</h1>
        <p className="mt-2 text-muted-foreground">Sign in to track orders and leave reviews.</p>
      </div>
      <Suspense>
        <AuthForm />
      </Suspense>
    </Section>
  );
}
