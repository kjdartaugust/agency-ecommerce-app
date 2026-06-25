import { Section } from "@/components/ui/section";
import { LinkButton } from "@/components/ui/button";

export default function NotFound() {
  return (
    <Section className="pt-28 text-center">
      <p className="font-display text-7xl font-bold text-primary/30">404</p>
      <h1 className="mt-4 font-display text-3xl font-bold">Page not found</h1>
      <p className="mt-3 text-muted-foreground">The page you're looking for doesn't exist or moved.</p>
      <LinkButton href="/" className="mt-8">Back home</LinkButton>
    </Section>
  );
}
