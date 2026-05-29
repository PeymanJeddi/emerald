import { EventEditor } from "@/components/events/EventEditor";

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EventEditor eventId={id} />;
}
