import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, Star } from "lucide-react";
import { getBlogPosts, getProducts, getProjects, getServices } from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import { Section, SectionHeader } from "@/components/ui/section";
import { LinkButton } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProjectCard } from "@/components/agency/project-card";
import { ProductCard } from "@/components/shop/product-card";

const clients = ["Northwind", "Vela", "Atlas", "Mori Labs", "Saffron", "Quanta"];
const stats = [
  { value: "120+", label: "Projects shipped" },
  { value: "64%", label: "Avg. revenue lift" },
  { value: "12", label: "Industry awards" },
  { value: "4.9", label: "Client rating" },
];

export default async function HomePage() {
  const [projects, products, services, posts] = await Promise.all([
    getProjects(true),
    getProducts({ featured: true }),
    getServices(),
    getBlogPosts(),
  ]);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-[-10%] h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute right-[10%] top-[20%] h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
        </div>
        <div className="container-px mx-auto max-w-7xl pb-16 pt-20 sm:pt-28">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="default" className="mb-6 gap-1.5 px-3 py-1">
              <Sparkles className="h-3.5 w-3.5" /> Design, engineering & a store you'll love
            </Badge>
            <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              We build <span className="text-gradient">brands</span> and the products that carry them.
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
              Lumen is a design and engineering studio. We craft identities, ship digital
              products, and curate a store of beautifully made workspace essentials.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <LinkButton href="/contact" size="lg">
                Start a project <ArrowRight className="h-4 w-4" />
              </LinkButton>
              <LinkButton href="/shop" size="lg" variant="outline">
                Visit the shop
              </LinkButton>
            </div>
          </div>

          {/* Marquee of clients */}
          <div className="relative mt-20 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
            <div className="flex w-max animate-marquee gap-12 pr-12">
              {[...clients, ...clients].map((c, i) => (
                <span key={i} className="font-display text-xl font-semibold text-muted-foreground/70">
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <Section className="py-12">
        <div className="grid grid-cols-2 gap-6 rounded-3xl border border-border bg-card/50 p-8 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display text-3xl font-bold sm:text-4xl">{s.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Selected work */}
      <Section className="pt-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeader eyebrow="Selected work" title="Projects we're proud of" />
          <LinkButton href="/work" variant="outline">
            View all work <ArrowRight className="h-4 w-4" />
          </LinkButton>
        </div>
        <div className="mt-12 grid gap-x-8 gap-y-12 md:grid-cols-2">
          {projects.slice(0, 4).map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      </Section>

      {/* Services */}
      <Section className="border-y border-border bg-card/30">
        <SectionHeader
          eyebrow="What we do"
          title="Engagements built around your stage"
          description="From a first brand to an embedded product team, pick the partnership that fits."
          align="center"
        />
        <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
          {services.map((s) => (
            <div
              key={s.id}
              className="relative rounded-2xl border border-border bg-card p-6"
            >
              {s.popular && (
                <Badge variant="accent" className="absolute right-5 top-5">
                  Popular
                </Badge>
              )}
              <h3 className="font-display text-xl font-semibold">{s.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.tagline}</p>
              <p className="mt-4 font-display text-3xl font-bold">
                {s.price === 0 ? "Custom" : formatPrice(s.price)}
                {s.price !== 0 && (
                  <span className="text-base font-normal text-muted-foreground">/{s.billing}</span>
                )}
              </p>
              <LinkButton href="/services" variant="outline" className="mt-5 w-full">
                Learn more
              </LinkButton>
            </div>
          ))}
        </div>
      </Section>

      {/* Featured products */}
      <Section>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeader eyebrow="From the shop" title="Essentials, thoughtfully made" />
          <LinkButton href="/shop" variant="outline">
            Shop all <ArrowRight className="h-4 w-4" />
          </LinkButton>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
          {products.slice(0, 4).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </Section>

      {/* Testimonial */}
      <Section className="py-12">
        <div className="relative mx-auto max-w-4xl rounded-3xl border border-border bg-gradient-to-br from-primary/10 to-accent/10 p-10 text-center sm:p-16">
          <div className="mb-4 flex justify-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-accent text-accent" />
            ))}
          </div>
          <p className="font-display text-2xl font-medium leading-snug sm:text-3xl">
            “Lumen rebuilt our brand and our store in eight weeks. Revenue is up 64% and we finally
            look like the company we want to be.”
          </p>
          <p className="mt-6 text-muted-foreground">— Founder, Northwind Coffee</p>
        </div>
      </Section>

      {/* Journal */}
      <Section className="pt-0">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeader eyebrow="Journal" title="Notes from the studio" />
          <LinkButton href="/blog" variant="outline">
            Read the journal <ArrowRight className="h-4 w-4" />
          </LinkButton>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {posts.slice(0, 3).map((post) => (
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
              <Badge variant="outline" className="mt-4">{post.tag}</Badge>
              <h3 className="mt-2 font-display text-lg font-semibold leading-snug group-hover:underline">
                {post.title}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">{post.excerpt}</p>
            </Link>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section className="pt-0">
        <div className="relative overflow-hidden rounded-3xl bg-primary px-8 py-16 text-center text-primary-foreground sm:py-20">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Have something to build?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-primary-foreground/80">
            Tell us about your project. We'll send a proposal within two business days.
          </p>
          <LinkButton href="/contact" size="lg" variant="accent" className="mt-8">
            Request a proposal <ArrowRight className="h-4 w-4" />
          </LinkButton>
        </div>
      </Section>
    </>
  );
}
