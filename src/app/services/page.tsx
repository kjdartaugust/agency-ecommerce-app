import type { Metadata } from "next";
import { Check, ArrowRight } from "lucide-react";
import { getServices } from "@/lib/data";
import { formatPrice, cn } from "@/lib/utils";
import { Section, SectionHeader } from "@/components/ui/section";
import { LinkButton } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Services",
  description: "Service packages and pricing for brand, web, and product engagements.",
};

const process = [
  { step: "01", title: "Discover", body: "We dig into your goals, audience, and constraints to write a sharp brief." },
  { step: "02", title: "Design", body: "We explore directions and converge fast on a system that scales." },
  { step: "03", title: "Build", body: "Engineering and design ship together — production-ready, not pixel mockups." },
  { step: "04", title: "Grow", body: "We measure, iterate, and hand off with documentation your team can run with." },
];

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <>
      <Section className="pt-16 pb-10">
        <SectionHeader
          eyebrow="Services & pricing"
          title="Clear scopes, honest pricing"
          description="Every engagement is fixed-scope and fixed-price. No surprise invoices, no padded hours."
          align="center"
        />
      </Section>

      <Section className="pt-0">
        <div className="grid gap-6 lg:grid-cols-3">
          {services.map((s) => (
            <div
              key={s.id}
              className={cn(
                "relative flex flex-col rounded-3xl border bg-card p-8",
                s.popular ? "border-primary shadow-lg ring-1 ring-primary/30" : "border-border"
              )}
            >
              {s.popular && (
                <Badge variant="default" className="absolute right-6 top-6">
                  Most popular
                </Badge>
              )}
              <h3 className="font-display text-2xl font-bold">{s.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.tagline}</p>
              <p className="mt-6 font-display text-4xl font-bold">
                {s.price === 0 ? "Custom" : formatPrice(s.price)}
                {s.price !== 0 && (
                  <span className="text-base font-normal text-muted-foreground">/{s.billing}</span>
                )}
              </p>
              <ul className="mt-6 flex-1 space-y-3">
                {s.features.map((f) => (
                  <li key={f} className="flex gap-2.5 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <LinkButton
                href="/contact"
                variant={s.popular ? "primary" : "outline"}
                className="mt-8 w-full"
              >
                {s.price === 0 ? "Talk to us" : "Get started"}
              </LinkButton>
            </div>
          ))}
        </div>
      </Section>

      <Section className="border-t border-border">
        <SectionHeader eyebrow="How we work" title="A process built to ship" align="center" />
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {process.map((p) => (
            <div key={p.step}>
              <span className="font-display text-4xl font-bold text-primary/30">{p.step}</span>
              <h3 className="mt-2 font-display text-xl font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-14 flex justify-center">
          <LinkButton href="/contact" size="lg">
            Request a proposal <ArrowRight className="h-4 w-4" />
          </LinkButton>
        </div>
      </Section>
    </>
  );
}
