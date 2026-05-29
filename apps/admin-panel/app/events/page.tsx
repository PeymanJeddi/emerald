"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export default function EventsPage() {
  const [events, setEvents] = useState<Array<Record<string, string>>>([]);

  useEffect(() => {
    apiFetch<Array<Record<string, string>>>("/api/admin/events").then(setEvents);
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl text-emerald">Events</h1>
        <Link href="/events/new" className="rounded-sm bg-emerald px-4 py-2 text-sm text-ivory">New Event</Link>
      </div>
      <div className="mt-6 space-y-3">
        {events.map((e) => (
          <Link key={e.id} href={`/events/${e.id}`} className="archival-card block rounded-sm p-4 hover:border-emerald">
            <p className="text-xs text-gold">{e.event_code}</p>
            <p className="font-medium">{e.title}</p>
            <p className="text-sm text-graphite/60">{e.status} · {e.location}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
