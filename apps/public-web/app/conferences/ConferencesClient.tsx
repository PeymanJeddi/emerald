"use client";

import { useCallback, useEffect, useState } from "react";
import { ConferenceCard } from "@/components/conference/ConferenceCard";
import {
  ConferenceFiltersBar,
  emptyFilters,
  type ConferenceFilterState,
} from "@/components/conference/ConferenceFiltersBar";
import { Button } from "@/components/ui/Button";
import {
  fetchEventFilters,
  fetchPublicEvents,
  mapApiEventToConference,
  type EventFilters,
} from "@/lib/events-api";
import type { Conference } from "@/lib/types";

const PAGE_SIZE = 9;

export function ConferencesClient() {
  const [tab, setTab] = useState<"upcoming" | "completed" | "archived" | "all">("upcoming");
  const [filters, setFilters] = useState<ConferenceFilterState>(emptyFilters);
  const [filterOptions, setFilterOptions] = useState<EventFilters | null>(null);
  const [conferences, setConferences] = useState<Conference[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
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
        tab: tab === "all" ? undefined : tab,
        search: filters.search || undefined,
        year: filters.year ? Number(filters.year) : undefined,
        month: filters.month ? Number(filters.month) : undefined,
        season: filters.season || undefined,
        conference_type: filters.conference_type || undefined,
        country: filters.country || undefined,
        upcoming_only: filters.upcoming_only,
        limit: PAGE_SIZE,
        offset,
        sort: tab === "upcoming" || tab === "all" ? "date_asc" : "date_desc",
      });
      setConferences(res.items.map(mapApiEventToConference));
      setTotal(res.total);
    } catch {
      setError("Unable to load events from the server.");
      setConferences([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [tab, filters, offset]);

  function setTabAndReset(next: typeof tab) {
    setTab(next);
    setOffset(0);
  }

  function setFiltersAndReset(next: ConferenceFilterState) {
    setFilters(next);
    setOffset(0);
  }

  useEffect(() => {
    const timer = setTimeout(load, filters.search ? 300 : 0);
    return () => clearTimeout(timer);
  }, [load, filters, offset]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.floor(offset / PAGE_SIZE) + 1;

  return (
    <>
      <div className="mb-6 flex flex-wrap gap-2">
        {(["upcoming", "completed", "archived", "all"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTabAndReset(t)}
            className={`rounded-sm border px-4 py-2 text-sm font-medium capitalize ${
              tab === t
                ? "border-emerald bg-emerald text-ivory"
                : "border-border bg-soft-white text-graphite"
            }`}
          >
            {t === "all" ? "All" : t}
          </button>
        ))}
      </div>

      {filterOptions ? (
        <ConferenceFiltersBar
          filters={filters}
          options={filterOptions}
          onChange={setFiltersAndReset}
        />
      ) : null}

      {loading ? (
        <p className="py-12 text-center text-graphite/60">Loading events…</p>
      ) : error ? (
        <p className="py-12 text-center text-red-700">{error}</p>
      ) : (
        <>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {conferences.map((conference) => (
              <ConferenceCard
                key={conference.slug}
                conference={conference}
                variant={
                  tab === "completed" ||
                  tab === "archived" ||
                  conference.status === "Completed" ||
                  conference.status === "Archived"
                    ? "past"
                    : "upcoming"
                }
              />
            ))}
          </div>
          {conferences.length === 0 && (
            <p className="py-12 text-center text-graphite/60">No conferences match the selected filters.</p>
          )}
          {totalPages > 1 ? (
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Button
                variant="ghost"
                disabled={offset === 0}
                onClick={() => setOffset((o) => Math.max(0, o - PAGE_SIZE))}
              >
                Previous
              </Button>
              <span className="text-sm text-graphite/70">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="ghost"
                disabled={offset + PAGE_SIZE >= total}
                onClick={() => setOffset((o) => o + PAGE_SIZE)}
              >
                Next
              </Button>
            </div>
          ) : null}
        </>
      )}
    </>
  );
}
