import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { NexusNavbar } from "@/components/nexus/navbar";
import { NexusFooter } from "@/components/nexus/footer";
import { PageTransition } from "@/components/nexus/page-transition";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: {
    default: "Nexus Market — Hire Talent. Shop Products.",
    template: "%s · Nexus Market",
  },
  description:
    "Nexus Market is the marketplace where the world's best freelancers and sellers meet buyers — services and products on one trusted platform.",
};

export default function MarketLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`nexus ${jakarta.variable} flex min-h-screen flex-col`}>
      <NexusNavbar />
      <main className="flex-1">
        <PageTransition>{children}</PageTransition>
      </main>
      <NexusFooter />
    </div>
  );
}
