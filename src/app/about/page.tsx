import type { Metadata } from "next";
import Image from "next/image";
import { getTeam } from "@/lib/data";
import { Section, SectionHeader } from "@/components/ui/section";
import { LinkButton } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Studio",
  description: "Meet the Lumen team and the principles behind our work.",
};

const values = [
  { title: "Craft over noise", body: "We'd rather ship one considered thing than ten loud ones." },
  { title: "Design and code together", body: "Our designers and engineers sit on the same team, from day one." },
  { title: "Own the outcome", body: "We measure success by your numbers, not our deliverables." },
];

export default async function AboutPage() {
  const team = await getTeam();

  return (
    <>
      <Section className="pt-16 pb-8">
        <div className="max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">The studio</p>
          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-6xl">
            A small team that ships like a big one.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            Lumen is a design and engineering studio founded in 2018. We partner with founders and
            product teams to build brands, websites, and products that perform — and we run a small
            store of the tools we wish existed.
          </p>
        </div>
      </Section>

      <Section className="pt-4">
        <div className="grid gap-6 md:grid-cols-3">
          {values.map((v) => (
            <div key={v.title} className="rounded-2xl border border-border bg-card/50 p-7">
              <h3 className="font-display text-xl font-semibold">{v.title}</h3>
              <p className="mt-2 text-muted-foreground">{v.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="border-t border-border">
        <SectionHeader eyebrow="The people" title="Meet the team" />
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((m) => (
            <div key={m.id}>
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-secondary">
                <Image
                  src={m.avatar_url}
                  alt={m.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">{m.name}</h3>
              <p className="text-sm text-primary">{m.role}</p>
              <p className="mt-2 text-sm text-muted-foreground">{m.bio}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="pt-0">
        <div className="rounded-3xl bg-primary px-8 py-14 text-center text-primary-foreground">
          <h2 className="font-display text-3xl font-bold">Want to work with us?</h2>
          <p className="mx-auto mt-3 max-w-md text-primary-foreground/80">
            We take on a handful of new partners each quarter.
          </p>
          <LinkButton href="/contact" size="lg" variant="accent" className="mt-7">
            Get in touch
          </LinkButton>
        </div>
      </Section>
    </>
  );
}
