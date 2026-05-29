import { ConferencesClient } from "@/app/conferences/ConferencesClient";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events",
  description: "Browse upcoming and past academic conferences and events.",
};

export default function EventsPage() {
  return (
    <Container className="py-12 lg:py-16">
      <SectionHeader
        title="Events"
        description="Browse upcoming and past conferences with advanced filters, search, and pagination."
      />
      <ConferencesClient />
    </Container>
  );
}
