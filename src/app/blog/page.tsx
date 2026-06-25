import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getBlogPosts } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import { Section, SectionHeader } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Journal",
  description: "Case studies and notes on design, engineering, and building brands.",
};

export default async function BlogPage() {
  const posts = await getBlogPosts();
  const [lead, ...rest] = posts;

  return (
    <Section className="pt-16">
      <SectionHeader
        eyebrow="Journal"
        title="Case studies & field notes"
        description="What we're learning about design, engineering, and growing brands."
      />

      {lead && (
        <Link href={`/blog/${lead.slug}`} className="group mt-12 grid gap-8 lg:grid-cols-2 lg:items-center">
          <div className="relative aspect-[16/10] overflow-hidden rounded-3xl bg-secondary">
            <Image
              src={lead.cover_url}
              alt={lead.title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              priority
            />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <Badge variant="default">{lead.tag}</Badge>
              <span className="text-sm text-muted-foreground">
                {formatDate(lead.published_at)} · {lead.read_minutes} min read
              </span>
            </div>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight group-hover:underline">
              {lead.title}
            </h2>
            <p className="mt-3 text-lg text-muted-foreground">{lead.excerpt}</p>
            <p className="mt-4 text-sm font-medium">By {lead.author}</p>
          </div>
        </Link>
      )}

      <div className="mt-16 grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
        {rest.map((post) => (
          <Link key={post.id} href={`/blog/${post.slug}`} className="group">
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-secondary">
              <Image
                src={post.cover_url}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="mt-4 flex items-center gap-3">
              <Badge variant="outline">{post.tag}</Badge>
              <span className="text-sm text-muted-foreground">{post.read_minutes} min</span>
            </div>
            <h3 className="mt-2 font-display text-xl font-semibold leading-snug group-hover:underline">
              {post.title}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">{post.excerpt}</p>
          </Link>
        ))}
      </div>
    </Section>
  );
}
