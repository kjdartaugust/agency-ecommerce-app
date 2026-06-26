"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/layout/footer";

// Hide the Lumen footer on Nexus Market routes (which use their own footer).
export function FooterGate() {
  const pathname = usePathname();
  if (pathname.startsWith("/market")) return null;
  return <Footer />;
}
