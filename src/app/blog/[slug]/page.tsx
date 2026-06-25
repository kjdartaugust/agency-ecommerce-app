import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getBlogPost, getBlogPosts } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getBlogPost(params.slug);
  if (!post) return { title: "Post not found" };
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug);
  if (!post) notFound();

  return (
    <Section className="max-w-3xl pt-12">
      <LinkButton href="/blog" variant="ghost" size="sm" className="mb-8 -ml-2">
        <ArrowLeft className="h-4 w-4" /> Journal
      </LinkButton>

      <Badge variant="default">{post.tag}</Badge>
      <h1 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">
        {post.title}
      </h1>
      <p className="mt-4 text-muted-foreground">
        By {post.author} · {formatDate(post.published_at)} · {post.read_minutes} min read
      </p>

      <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-3xl bg-secondary">
        <Image src={post.cover_url} alt={post.title} fill sizes="100vw" className="object-cover" priority />
      </div>

      <div className="prose-lumen mt-10 space-y-5 text-lg leading-relaxed text-foreground/90">
        {post.content.split("\n\n").map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>
    </Section>
  );
}
