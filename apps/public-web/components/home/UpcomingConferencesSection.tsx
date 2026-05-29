import { ConferenceCard } from "@/components/conference/ConferenceCard";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { fetchPublicEvents, mapApiEventToConference } from "@/lib/events-api";

interface UpcomingConferencesSectionProps {
  title: string;
  subtitle: string;
}

export async function UpcomingConferencesSection({ title, subtitle }: UpcomingConferencesSectionProps) {
  const res = await fetchPublicEvents({ tab: "upcoming", limit: 3, sort: "date_asc" }).catch(() => ({
    items: [],
    total: 0,
    limit: 3,
    offset: 0,
  }));
  const conferences = res.items.map(mapApiEventToConference);

  return (
    <section className="border-b border-border bg-soft-white py-16 lg:py-20">
      <Container>
        <SectionHeader title={title} description={subtitle} align="center" className="mx-auto" />
        {conferences.length === 0 ? (
          <p className="py-12 text-center text-graphite/60">No upcoming conferences at this time.</p>
        ) : (
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {conferences.map((conference) => (
              <ConferenceCard key={conference.slug} conference={conference} variant="upcoming" />
            ))}
          </div>
        )}
        <div className="mt-12 text-center">
          <Button href="/events" variant="secondary" className="min-w-[12rem]">
            View All Events
          </Button>
        </div>
      </Container>
    </section>
  );
}
