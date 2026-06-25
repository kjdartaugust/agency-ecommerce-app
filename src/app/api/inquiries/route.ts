import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  company: z.string().max(160).optional().or(z.literal("")),
  budget: z.string().max(60).optional().or(z.literal("")),
  service: z.string().max(60).optional().or(z.literal("")),
  message: z.string().min(1).max(4000),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 422 });
  }

  const supabase = createClient();
  if (!supabase) {
    // No backend configured — accept the lead so the demo flow completes.
    console.info("[inquiry] (no Supabase configured)", parsed.data);
    return NextResponse.json({ ok: true, demo: true });
  }

  const { error } = await supabase.from("inquiries").insert({
    name: parsed.data.name,
    email: parsed.data.email,
    company: parsed.data.company || null,
    budget: parsed.data.budget || null,
    service: parsed.data.service || null,
    message: parsed.data.message,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
