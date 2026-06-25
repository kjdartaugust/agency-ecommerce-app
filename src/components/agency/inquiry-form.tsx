"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/ui/input";

const budgets = ["< $10k", "$10k – $25k", "$25k – $50k", "$50k+"];
const serviceOptions = ["Brand & identity", "Website", "Product design", "E-commerce", "Not sure yet"];

export function InquiryForm() {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed");
      setDone(true);
      toast.success("Thanks — we'll be in touch within two business days.");
    } catch {
      toast.error("Something went wrong. Please email hello@lumen.studio.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-3xl border border-border bg-card p-10 text-center">
        <h3 className="font-display text-2xl font-bold">Proposal request received 🎉</h3>
        <p className="mt-3 text-muted-foreground">
          We've logged your inquiry and will reply within two business days.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 rounded-3xl border border-border bg-card p-7 sm:p-9">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required placeholder="Ada Lovelace" />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required placeholder="ada@company.com" />
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="company">Company</Label>
          <Input id="company" name="company" placeholder="Optional" />
        </div>
        <div>
          <Label htmlFor="budget">Budget</Label>
          <Select id="budget" name="budget" defaultValue="">
            <option value="" disabled>Select a range</option>
            {budgets.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </Select>
        </div>
      </div>
      <div>
        <Label htmlFor="service">What do you need?</Label>
        <Select id="service" name="service" defaultValue="">
          <option value="" disabled>Select a service</option>
          {serviceOptions.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </Select>
      </div>
      <div>
        <Label htmlFor="message">Tell us about your project</Label>
        <Textarea id="message" name="message" required placeholder="Goals, timeline, anything useful…" />
      </div>
      <Button type="submit" size="lg" className="w-full" disabled={loading}>
        {loading ? "Sending…" : "Request a proposal"}
      </Button>
    </form>
  );
}
