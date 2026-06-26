import type { Metadata } from "next";
import { getServices, nexusCategories } from "@/lib/nexus/data";
import { ServiceFilters } from "@/components/nexus/service-filters";
import { ServiceCard } from "@/components/nexus/service-card";
import { FadeUp, Stagger, StaggerItem } from "@/components/nexus/motion";

export const metadata: Metadata = {
  title: "Services",
  description: "Browse thousands of services from verified, top-rated sellers.",
};

export default function ServicesPage({
  searchParams,
}: {
  searchParams: { category?: string; sort?: string; search?: string };
}) {
  const services = getServices(searchParams);
  const active = nexusCategories.find((c) => c.slug === searchParams.category);

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
      <FadeUp>
        <h1 className="text-3xl font-extrabold tracking-tight text-[#0F172A] sm:text-4xl">
          {active ? active.name : "All services"}
        </h1>
        <p className="mt-2 text-slate-500">
          {services.length} services from verified sellers ready to deliver.
        </p>
      </FadeUp>

      <div className="mt-8">
        <ServiceFilters categories={nexusCategories} />
      </div>

      {services.length === 0 ? (
        <p className="mt-16 text-center text-slate-500">No services match these filters.</p>
      ) : (
        <Stagger className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {services.map((s) => (
            <StaggerItem key={s.id}>
              <ServiceCard service={s} />
            </StaggerItem>
          ))}
        </Stagger>
      )}
    </div>
  );
}
