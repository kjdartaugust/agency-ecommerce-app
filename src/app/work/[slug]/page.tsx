import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getProject, getProjects } from "@/lib/data";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const project = await getProject(params.slug);
  if (!project) return { title: "Project not found" };
  return { title: project.title, description: project.summary };
}

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const project = await getProject(params.slug);
  if (!project) notFound();

  const gallery = project.gallery?.length ? project.gallery : [project.cover_url];

  return (
    <Section className="pt-12">
      <LinkButton href="/work" variant="ghost" size="sm" className="mb-8 -ml-2">
        <ArrowLeft className="h-4 w-4" /> All work
      </LinkButton>

      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
        <div>
          <div className="flex items-center gap-3">
            <Badge variant="default">{project.category}</Badge>
            <span className="text-sm text-muted-foreground">{project.year}</span>
          </div>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">
            {project.title}
          </h1>
          <p className="mt-4 max-w-xl text-lg text-muted-foreground">{project.summary}</p>
        </div>
        <dl className="grid grid-cols-2 gap-4 rounded-2xl border border-border bg-card/50 p-6">
          <div>
            <dt className="text-sm text-muted-foreground">Client</dt>
            <dd className="font-medium">{project.client}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Year</dt>
            <dd className="font-medium">{project.year}</dd>
          </div>
          <div className="col-span-2">
            <dt className="text-sm text-muted-foreground">Services</dt>
            <dd className="mt-1 flex flex-wrap gap-2">
              {(project.services ?? []).map((s) => (
                <Badge key={s} variant="secondary">{s}</Badge>
              ))}
            </dd>
          </div>
        </dl>
      </div>

      <div className="mt-12 space-y-6">
        {gallery.map((src, i) => (
          <div key={i} className="relative aspect-[16/9] overflow-hidden rounded-3xl bg-secondary">
            <Image
              src={src}
              alt={`${project.title} — image ${i + 1}`}
              fill
              sizes="100vw"
              className="object-cover"
              priority={i === 0}
            />
          </div>
        ))}
      </div>

      <div className="mt-16 flex flex-col items-center gap-4 rounded-3xl border border-border bg-card/40 p-10 text-center">
        <h2 className="font-display text-2xl font-bold">Like what you see?</h2>
        <p className="max-w-md text-muted-foreground">
          Let's talk about how we can do the same for your brand.
        </p>
        <LinkButton href="/contact" size="lg">
          Start a project <ArrowRight className="h-4 w-4" />
        </LinkButton>
      </div>
    </Section>
  );
}
