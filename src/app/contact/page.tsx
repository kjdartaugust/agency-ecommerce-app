import type { Metadata } from "next";
import { Mail, MapPin, Clock } from "lucide-react";
import { Section } from "@/components/ui/section";
import { InquiryForm } from "@/components/agency/inquiry-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Request a proposal or say hello. We reply within two business days.",
};

const details = [
  { icon: Mail, label: "Email", value: "hello@lumen.studio" },
  { icon: MapPin, label: "Studio", value: "Accra · Lisbon · Remote" },
  { icon: Clock, label: "Response time", value: "Within 2 business days" },
];

export default function ContactPage() {
  return (
    <Section className="pt-16">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">Contact</p>
          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Let's build something.
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Tell us about your project and we'll put together a proposal with scope, timeline, and
            pricing.
          </p>
          <ul className="mt-10 space-y-6">
            {details.map((d) => (
              <li key={d.label} className="flex items-center gap-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary">
                  <d.icon className="h-5 w-5 text-primary" />
                </span>
                <div>
                  <p className="text-sm text-muted-foreground">{d.label}</p>
                  <p className="font-medium">{d.value}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <InquiryForm />
      </div>
    </Section>
  );
}
