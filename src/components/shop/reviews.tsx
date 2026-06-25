"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";
import type { Review } from "@/lib/types";
import { formatDate, cn } from "@/lib/utils";
import { Stars } from "@/components/ui/stars";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";

export function Reviews({ productId, initial }: { productId: string; initial: Review[] }) {
  const [reviews, setReviews] = useState(initial);
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const payload = {
      product_id: productId,
      rating,
      author_name: String(form.get("author_name") || "Anonymous"),
      title: String(form.get("title") || ""),
      body: String(form.get("body") || ""),
    };
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setReviews((r) => [data.review, ...r]);
      toast.success("Thanks for your review!");
      (e.target as HTMLFormElement).reset();
      setRating(5);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not submit review");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr]">
      <div>
        <h2 className="font-display text-2xl font-bold">Reviews ({reviews.length})</h2>
        <div className="mt-6 space-y-6">
          {reviews.length === 0 && (
            <p className="text-muted-foreground">No reviews yet. Be the first!</p>
          )}
          {reviews.map((r) => (
            <div key={r.id} className="border-b border-border pb-6 last:border-0">
              <div className="flex items-center justify-between">
                <p className="font-medium">{r.author_name}</p>
                <span className="text-sm text-muted-foreground">{formatDate(r.created_at)}</span>
              </div>
              <Stars rating={r.rating} className="mt-1" />
              {r.title && <p className="mt-2 font-medium">{r.title}</p>}
              <p className="mt-1 text-muted-foreground">{r.body}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-card p-6 lg:sticky lg:top-24 lg:self-start">
        <h3 className="font-display text-lg font-semibold">Write a review</h3>
        <form onSubmit={onSubmit} className="mt-4 space-y-4">
          <div>
            <Label>Rating</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setRating(i)}
                  aria-label={`${i} star`}
                >
                  <Star
                    className={cn(
                      "h-7 w-7 transition-colors",
                      i <= rating ? "fill-accent text-accent" : "fill-transparent text-muted-foreground/40"
                    )}
                  />
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label htmlFor="author_name">Name</Label>
            <Input id="author_name" name="author_name" required placeholder="Your name" />
          </div>
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" placeholder="Sums it up" />
          </div>
          <div>
            <Label htmlFor="body">Review</Label>
            <Textarea id="body" name="body" required placeholder="What did you think?" />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Submitting…" : "Submit review"}
          </Button>
        </form>
      </div>
    </div>
  );
}
