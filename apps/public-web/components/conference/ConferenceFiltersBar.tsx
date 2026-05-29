"use client";

import type { EventFilters } from "@/lib/events-api";

export type ConferenceFilterState = {
  search: string;
  year: string;
  month: string;
  season: string;
  conference_type: string;
  country: string;
  status: string;
  upcoming_only: boolean;
};

export const emptyFilters: ConferenceFilterState = {
  search: "",
  year: "",
  month: "",
  season: "",
  conference_type: "",
  country: "",
  status: "",
  upcoming_only: false,
};

interface ConferenceFiltersBarProps {
  filters: ConferenceFilterState;
  options: EventFilters;
  onChange: (next: ConferenceFilterState) => void;
  compact?: boolean;
}

function SelectField({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="flex min-w-[8.5rem] shrink-0 flex-col gap-1 text-xs">
      <span className="font-medium uppercase tracking-wide text-graphite/55">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-sm border border-border bg-soft-white px-2 py-2 text-sm text-graphite"
      >
        {children}
      </select>
    </label>
  );
}

export function ConferenceFiltersBar({ filters, options, onChange, compact }: ConferenceFiltersBarProps) {
  const set = (patch: Partial<ConferenceFilterState>) => onChange({ ...filters, ...patch });

  return (
    <div className={compact ? "space-y-3" : "space-y-4"}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <label className="flex flex-1 flex-col gap-1 text-xs">
          <span className="font-medium uppercase tracking-wide text-graphite/55">Search</span>
          <input
            type="search"
            value={filters.search}
            onChange={(e) => set({ search: e.target.value })}
            placeholder="Conference name, location…"
            className="rounded-sm border border-border bg-soft-white px-3 py-2 text-sm"
          />
        </label>
        <label className="flex items-center gap-2 self-end pb-2 text-sm text-graphite/80">
          <input
            type="checkbox"
            checked={filters.upcoming_only}
            onChange={(e) => set({ upcoming_only: e.target.checked })}
            className="h-4 w-4 rounded border-border"
          />
          Upcoming only
        </label>
      </div>
      <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-1">
        <SelectField label="Year" value={filters.year} onChange={(year) => set({ year })}>
          <option value="">All years</option>
          {options.years.map((y) => (
            <option key={y} value={String(y)}>
              {y}
            </option>
          ))}
        </SelectField>
        <SelectField label="Month" value={filters.month} onChange={(month) => set({ month })}>
          <option value="">All months</option>
          {options.months.map((m) => (
            <option key={m} value={String(m)}>
              {new Date(2000, m - 1, 1).toLocaleString("en", { month: "long" })}
            </option>
          ))}
        </SelectField>
        <SelectField label="Season" value={filters.season} onChange={(season) => set({ season })}>
          <option value="">All seasons</option>
          {options.seasons.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </SelectField>
        <SelectField
          label="Type"
          value={filters.conference_type}
          onChange={(conference_type) => set({ conference_type })}
        >
          <option value="">All types</option>
          {options.conference_types.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </SelectField>
        <SelectField label="Country" value={filters.country} onChange={(country) => set({ country })}>
          <option value="">All locations</option>
          {options.countries.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </SelectField>
      </div>
    </div>
  );
}
