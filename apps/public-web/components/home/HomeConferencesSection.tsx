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

type Tab = "upcoming" | "past";

interface HomeConferencesSectionProps {
  upcomingTitle: string;
  upcomingSubtitle: string;
  pastTitle: string;
  pastSubtitle: string;
}

export function HomeConferencesSection({
  upcomingTitle,
  upcomingSubtitle,
  pastTitle,
  pastSubtitle,
}: HomeConferencesSectionProps) {
  const [tab, setTab] = useState<Tab>("upcoming");
  const [filters, setFilters] = useState<ConferenceFilterState>({ ...emptyFilters, upcoming_only: true });
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
        upcoming_only: tab === "upcoming" && filters.upcoming_only,
        limit: 6,
        sort: tab === "upcoming" ? "date_asc" : "date_desc",
      });
      setConferences(res.items.map(mapApiEventToConference));
    } catch {
      setError("Unable to load conferences.");
      setConferences([]);
    } finally {
      setLoading(false);
    }
  }, [tab, filters]);

  useEffect(() => {
    const timer = setTimeout(load, filters.search ? 300 : 0);
    return () => clearTimeout(timer);
  }, [load, filters]);

  const sectionTitle = tab === "upcoming" ? upcomingTitle : pastTitle;
  const sectionSubtitle = tab === "upcoming" ? upcomingSubtitle : pastSubtitle;

  return (
    <section className="py-16 lg:py-20">
      <Container>
        <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeader title={sectionTitle} description={sectionSubtitle} className="mb-0" />
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => setTab("upcoming")}
              className={`rounded-sm border px-4 py-2 text-sm font-medium transition-colors ${
                tab === "upcoming"
                  ? "border-emerald bg-emerald text-ivory"
                  : "border-border bg-soft-white text-graphite hover:border-emerald/40"
              }`}
            >
              Upcoming
            </button>
            <button
              type="button"
              onClick={() => setTab("past")}
              className={`rounded-sm border px-4 py-2 text-sm font-medium transition-colors ${
                tab === "past"
                  ? "border-emerald bg-emerald text-ivory"
                  : "border-border bg-soft-white text-graphite hover:border-emerald/40"
              }`}
            >
              Past
            </button>
          </div>
        </div>

        {filterOptions ? (
          <div className="mt-8">
            <ConferenceFiltersBar filters={filters} options={filterOptions} onChange={setFilters} compact />
          </div>
        ) : null}

        {loading ? (
          <p className="py-16 text-center text-graphite/60">Loading conferences…</p>
        ) : error ? (
          <p className="py-16 text-center text-red-700">{error}</p>
        ) : conferences.length === 0 ? (
          <p className="py-16 text-center text-graphite/60">No conferences match your filters.</p>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {conferences.map((conference) => (
              <ConferenceCard key={conference.slug} conference={conference} variant={tab} />
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Button href="/conferences" variant="secondary" className="min-w-[12rem]">
            View All Conferences
          </Button>
        </div>
      </Container>
    </section>
  );
}
