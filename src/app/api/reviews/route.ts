import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({
  product_id: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  author_name: z.string().min(1).max(120),
  title: z.string().max(160).optional().or(z.literal("")),
  body: z.string().min(1).max(2000),
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

  const review = {
    id: crypto.randomUUID(),
    product_id: parsed.data.product_id,
    author_name: parsed.data.author_name,
    rating: parsed.data.rating,
    title: parsed.data.title || null,
    body: parsed.data.body,
    created_at: new Date().toISOString(),
  };

  const supabase = createClient();
  if (!supabase) {
    // Demo mode — echo the review back so the UI updates optimistically.
    return NextResponse.json({ ok: true, demo: true, review });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("reviews")
    .insert({ ...review, id: undefined, user_id: user?.id ?? null })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true, review: data });
}
