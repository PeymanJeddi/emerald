"use client";

import { cn } from "@/lib/utils";
import type { Conference } from "@/lib/types";

const filters: Array<Conference["status"] | "All"> = [
  "All",
  "Upcoming",
  "Open for Registration",
  "Completed",
];

interface ConferenceFilterProps {
  active: Conference["status"] | "All";
  onChange: (filter: Conference["status"] | "All") => void;
}

export function ConferenceFilter({ active, onChange }: ConferenceFilterProps) {
  return (
    <div
      className="mb-8 flex flex-wrap gap-2 border-b border-border pb-4"
      role="tablist"
      aria-label="Filter events"
    >
      {filters.map((filter) => (
        <button
          key={filter}
          type="button"
          role="tab"
          aria-selected={active === filter}
          onClick={() => onChange(filter)}
          className={cn(
            "px-4 py-2 text-sm transition-colors",
            active === filter
              ? "border-b-2 border-navy font-medium text-navy"
              : "text-gray-600 hover:text-navy"
          )}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}
