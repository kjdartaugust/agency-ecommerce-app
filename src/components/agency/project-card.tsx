import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/work/${project.slug}`} className="group block">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-secondary">
        <Image
          src={project.cover_url}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-background/90 opacity-0 transition-opacity group-hover:opacity-100">
          <ArrowUpRight className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <Badge variant="outline">{project.category}</Badge>
        <span className="text-sm text-muted-foreground">{project.year}</span>
      </div>
      <h3 className="mt-2 font-display text-xl font-semibold tracking-tight">{project.title}</h3>
      <p className="mt-1 text-muted-foreground">{project.summary}</p>
    </Link>
  );
}
