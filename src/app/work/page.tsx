import type { Metadata } from "next";
import { getProjects } from "@/lib/data";
import { Section, SectionHeader } from "@/components/ui/section";
import { ProjectCard } from "@/components/agency/project-card";

export const metadata: Metadata = {
  title: "Work",
  description: "Selected projects across brand, product, and campaign work.",
};

export default async function WorkPage() {
  const projects = await getProjects();

  return (
    <Section className="pt-16">
      <SectionHeader
        eyebrow="Portfolio"
        title="Work that earns its place"
        description="A selection of brand, product, and campaign work from across industries."
      />
      <div className="mt-14 grid gap-x-8 gap-y-14 md:grid-cols-2">
        {projects.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>
    </Section>
  );
}
