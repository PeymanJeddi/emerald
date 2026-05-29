"use client";

import { ConferenceCard } from "@/components/conference/ConferenceCard";
import {
  ConferenceFiltersBar,
  emptyFilters,
  type ConferenceFilterState,
} from "@/components/conference/ConferenceFiltersBar";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import {
  fetchEventFilters,
  fetchPublicEvents,
  mapApiEventToConference,
  type EventFilters,
} from "@/lib/events-api";
import type { Conference } from "@/lib/types";
import { useCallback, useEffect, useState } from "react";

type Tab = "upcoming" | "completed" | "archived";

interface EventsExplorerSectionProps {
  title: string;
  subtitle: string;
}

const PAGE_SIZE = 6;

export function EventsExplorerSection({ title, subtitle }: EventsExplorerSectionProps) {
  const [tab, setTab] = useState<Tab>("upcoming");
  const [filters, setFilters] = useState<ConferenceFilterState>(emptyFilters);
  const [filterOptions, setFilterOptions] = useState<EventFilters | null>(null);
  const [conferences, setConferences] = useState<Conference[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEventFilters().then(setFilterOptions);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetchPublicEvents({
        tab,
        search: filters.search || undefined,
        year: filters.year ? Number(filters.year) : undefined,
        month: filters.month ? Number(filters.month) : undefined,
        season: filters.season || undefined,
        conference_type: filters.conference_type || undefined,
        country: filters.country || undefined,
        status: filters.status || undefined,
        limit: PAGE_SIZE,
        sort: tab === "upcoming" ? "date_asc" : "date_desc",
      });
      setConferences(res.items.map(mapApiEventToConference));
    } catch {
      setError("Unable to load events.");
      setConferences([]);
    } finally {
      setLoading(false);
    }
  }, [tab, filters]);

  function setTabAndReset(next: Tab) {
    setTab(next);
  }

  function setFiltersAndReset(next: ConferenceFilterState) {
    setFilters(next);
  }

  useEffect(() => {
    const timer = setTimeout(load, filters.search ? 300 : 0);
    return () => clearTimeout(timer);
  }, [load, filters]);

  const cardVariant = tab === "upcoming" ? "upcoming" : "past";

  return (
    <section className="py-16 lg:py-20">
      <Container>
        <SectionHeader title={title} description={subtitle} />
        <div className="mt-8 flex flex-wrap gap-2">
          {(["upcoming", "completed", "archived"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTabAndReset(t)}
              className={`rounded-sm border px-4 py-2 text-sm font-medium capitalize ${
                tab === t
                  ? "border-emerald bg-emerald text-ivory"
                  : "border-border bg-soft-white text-graphite hover:border-emerald/40"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        {filterOptions ? (
          <div className="mt-8">
            <ConferenceFiltersBar filters={filters} options={filterOptions} onChange={setFiltersAndReset} />
          </div>
        ) : null}
        {loading ? (
          <p className="py-16 text-center text-graphite/60">Loading events…</p>
        ) : error ? (
          <p className="py-16 text-center text-red-700">{error}</p>
        ) : conferences.length === 0 ? (
          <p className="py-16 text-center text-graphite/60">No events match your filters.</p>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {conferences.map((conference) => (
              <ConferenceCard key={conference.slug} conference={conference} variant={cardVariant} />
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
