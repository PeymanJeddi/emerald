import { ConferencesClient } from "./ConferencesClient";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conferences & Academic Events",
  description:
    "Browse public academic event records including dates, locations, formats, and reference codes.",
};

export default function ConferencesPage() {
  return (
    <Container className="py-12 lg:py-16">
      <SectionHeader
        title="Conferences & Academic Events"
        description="Browse basic public information about academic events coordinated through the Emerald Scholars Congress."
      />
      <ConferencesClient />
    </Container>
  );
}
