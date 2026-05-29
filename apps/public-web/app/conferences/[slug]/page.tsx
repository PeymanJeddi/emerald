import { EventDetailView } from "@/components/event/EventDetailView";
import {
  fetchPublicEventDetail,
  fetchPublicEvents,
  mapApiEventToConference,
} from "@/lib/events-api";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const res = await fetchPublicEvents({ limit: 200 }).catch(() => null);
  const items = res?.items ?? [];
  return items.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await fetchPublicEventDetail(slug);
  if (!event) return { title: "Event Not Found" };
  return {
    title: event.seo_title ?? event.title,
    description: event.seo_description ?? event.short_description ?? event.overview ?? undefined,
    openGraph: {
      title: event.seo_title ?? event.title,
      description: event.seo_description ?? undefined,
    },
  };
}

export default async function ConferenceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const event = await fetchPublicEventDetail(slug);
  if (!event) notFound();

  const relatedRes = await fetchPublicEvents({
    conference_type: event.category ?? undefined,
    limit: 4,
  }).catch(() => ({ items: [], total: 0, limit: 4, offset: 0 }));

  const related = relatedRes.items
    .filter((e) => e.slug !== slug)
    .slice(0, 3)
    .map(mapApiEventToConference);

  return <EventDetailView event={event} related={related} />;
}
